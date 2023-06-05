const { GraphQLError } = require('graphql');

//Subscriptions
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const Author = require('../models/author');
const Book = require('../models/book');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

require('dotenv').config();

const resolvers = {
	Query: {
		//AUTHOR COUNT QUERY
		authorCount: () => Author.collection.countDocuments(),

		//ALL AUTHOR QUERY
		allAuthors: async () => {
			console.log('allAuthors');
			const authors = await Author.find({}).populate('books');
			return authors;
		},

		//ALL BOOK QUERY
		allBooks: async (root, args) => {
			if (args.author && args.genres) {
				const author = await Author.findOne({ name: args.author });
				const books = await Book.find({
					author: author._id,
					genres: { $in: args.genres },
				}).populate('author');
				return books;
			}

			if (args.author) {
				const author = await Author.findOne({ name: args.author });
				const books = await Book.find({ author: author._id }).populate(
					'author'
				);
				return books;
			}

			if (args.genres) {
				const books = await Book.find({
					genres: { $in: args.genres },
				}).populate('author');
				return books;
			}

			const books = await Book.find({}).populate('author');
			return books;
		},

		//ME QUERY
		me: (root, args, context) => {
			return context.currentUser;
		},
	},

	Author: {
		bookCount: async (root) => {
			return root.books.length;
		},
	},

	Mutation: {
		//ADD A BOOK MUTATION
		addBook: async (root, args, context) => {
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: { code: 'UNAUTHENTICATED' },
				});
			}

			const { title, published, author: authorName, genres } = args;

			if (args.title.length < 5) {
				throw new GraphQLError('title must be at least 5 characters long');
			}

			if (args.author.length < 4) {
				throw new GraphQLError(
					'author name must be at least 4 characters long'
				);
			}

			let book;
			let author;

			try {
				//CHECK IF AUTHOR EXISTS
				author = await Author.findOne({ name: authorName });

				//IF AUTHOR DOES NOT EXIST, CREATE NEW AUTHOR
				if (!author) {
					author = new Author({ name: authorName });
					await author.save();
				}

				//CREATE NEW BOOK
				book = new Book({ title, published, genres, author: author._id });
				await book.save();

				//UPDATE AUTHOR BOOK COUNT
				author.books = author.books.concat(book);
				await author.save();
			} catch (error) {
				throw new GraphQLError('saving book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error,
					},
				});
			}

			//POPULATE AUTHOR FIELD OF BOOK
			await book.populate('author');

			//PUBLISH BOOK ADDED EVENT
			pubsub.publish('BOOK_ADDED', { bookAdded: book });

			return book;
		},

		//EDIT AUTHOR MUTATION
		editAuthor: async (root, args, context) => {
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated');
			}

			const author = await Author.findOne({ name: args.name });

			if (!author) {
				return null;
			}

			author.born = args.setBornTo;

			try {
				await author.save();

				const bookCount = await Book.countDocuments({ author: author._id });
				return { ...author.toObject(), id: author._id, bookCount };
			} catch (error) {
				throw new GraphQLError('saving author failed', {
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
			const user = new User({ ...args });

			try {
				await user.save();
			} catch (error) {
				throw new GraphQLError('saving user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error,
					},
				});
			}

			return user;
		},

		//LOGIN MUTATION
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'password') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'UNAUTHENTICATED',
						invalidArgs: args,
						error,
					},
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
		},
	},

	//SUBSCRIPTIONS
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
		},
	},
};

module.exports = resolvers;
