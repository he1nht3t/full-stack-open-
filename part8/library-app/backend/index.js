const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
	ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');

//Websocket
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const express = require('express');
const cors = require('cors');
const http = require('http');

const jwt = require('jsonwebtoken');

//Models
const User = require('./models/user');

//Schema
const typeDefs = require('./graphql/schema');

//Resolvers
const resolvers = require('./graphql/resolvers');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

mongoose.set('debug', true);

/*
let authors = [
	{
		name: 'Robert Martin',
		born: 1952,
	},
	{
		name: 'Martin Fowler',
		born: 1963,
	},
	{
		name: 'Fyodor Dostoevsky',
		born: 1821,
	},
	{
		name: 'Joshua Kerievsky'
	},
	{
		name: 'Sandi Metz'
	},
];

let books = [
	{
		title: 'Clean Code',
		published: 2008,
		author: 'Robert Martin',
		id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Agile software development',
		published: 2002,
		author: 'Robert Martin',
		id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
		genres: ['agile', 'patterns', 'design'],
	},
	{
		title: 'Refactoring, edition 2',
		published: 2018,
		author: 'Martin Fowler',
		id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Refactoring to patterns',
		published: 2008,
		author: 'Joshua Kerievsky',
		id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'patterns'],
	},
	{
		title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
		published: 2012,
		author: 'Sandi Metz',
		id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'design'],
	},
	{
		title: 'Crime and punishment',
		published: 1866,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'crime'],
	},
	{
		title: 'The Demon ',
		published: 1872,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'revolution'],
	},
];

*/

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const start = async () => {
	const app = express();
	const httpServer = http.createServer(app);

	//Websocket server
	const wsServer = new WebSocketServer({ server: httpServer, path: '/' });

	const schema = makeExecutableSchema({ typeDefs, resolvers });

	const serverCleanup = useServer({ schema }, wsServer);

	const server = new ApolloServer({
		schema,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							serverCleanup.dispose();
						},
					};
				},
			},
		],
	});

	await server.start();

	app.use(
		'/',
		cors(),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const auth = req ? req.headers.authorization : null;

				if (auth && auth.toLowerCase().startsWith('bearer ')) {
					const decodedToken = jwt.verify(
						auth.substring(7),
						process.env.JWT_SECRET
					);

					const currentUser = await User.findById(decodedToken.id);
					return { currentUser };
				}
			},
		})
	);

	httpServer.listen({ port: process.env.PORT || 4000 }, () => {
		console.log(`Server ready at http://localhost:${process.env.PORT || 4000}`);
	});
};

start();
