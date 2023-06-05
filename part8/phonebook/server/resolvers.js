const { GraphQLError } = require('graphql');

//Websocket Subscription
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

//Models
const Person = require('./model/person');
const User = require('./model/user');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const resolvers = {
	Query: {
		//PERSON COUNT RESOLVER
		personCount: () => Person.collection.countDocuments(),

		//ALL PERSONS RESOLVER
		allPersons: async (root, args) => {
			if (!args.phone) {
				return await Person.find({}).populate('friendOf');
			}
			return await Person.find({
				phone: { $exists: args.phone === 'YES' },
			}).populate('friendOf');
		},

		//FIND PERSON RESOLVER
		findPerson: async (root, args) => await Person.findOne({ name: args.name }),

		//ME RESOLVER
		me: (root, args, context) => {
			return context.currentUser;
		},
	},

	//PERSON'S ADDRESS RESOLVER
	Person: {
		address: (root) => {
			return {
				street: root.street,
				city: root.city,
			};
		},
	},

	Mutation: {
		//ADD PERSON MUTATION
		addPerson: async (root, args, context) => {
			const person = new Person({ ...args });
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
					},
				});
			}

			try {
				await person.save();
				currentUser.friends = currentUser.friends.concat(person);
				await currentUser.save();
			} catch (error) {
				throw new GraphQLError('saving person failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error,
					},
				});
			}

			//publish subscription
			pubsub.publish('PERSON_ADDED', { personAdded: person });

			return person;
		},

		//EDIT NUMBER MUTATION
		editNumber: async (root, args) => {
			const person = await Person.findOne({ name: args.name });
			person.phone = args.phone;
			try {
				await person.save();
				return person;
			} catch (error) {
				throw new GraphQLError('saving person failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error,
					},
				});
			}
		},

		//CREATE USER MUTATION
		createUser: async (root, args) => {
			const user = new User({ username: args.username });

			try {
				await user.save();
			} catch (error) {
				throw new GraphQLError('saving user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error,
					},
				});
			}

			return user;
		},

		//LOGIN MUTATION
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
		},

		//ADD FRIEND MUTATION
		addAsFriend: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'UNAUTHENTICATED',
					},
				});
			}

			const isFriend = (person) => currentUser.friends.includes(person._id);

			const person = await Person.findOne({ name: args.name });
			if (!isFriend(person)) {
				currentUser.friends = currentUser.friends.concat(person);
			}

			await currentUser.save();
			return currentUser;
		},
	},

	//SUBSCRIPTION
	Subscription: {
		personAdded: {
			subscribe: () => pubsub.asyncIterator(['PERSON_ADDED']),
		},
	},
};

module.exports = resolvers;
