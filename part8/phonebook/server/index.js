//Apollo server
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
	ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');

//Websocket
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

//Express
const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');

//MODELS
const User = require('./model/user');

//schema
const typeDefs = require('./schema');
//resolvers
const resolvers = require('./resolvers');

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

const start = async () => {
	const app = express();
	const httpServer = http.createServer(app);

	//create websocket server
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: '/',
	});

	const schema = makeExecutableSchema({ typeDefs, resolvers });

	// Hand in the schema we just created and have the
	// WebSocketServer start listening.
	const serverCleanup = useServer({ schema }, wsServer);

	const server = new ApolloServer({
		schema,
		plugins: [
			//server shutdown for http server
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				//server shutdown for websocket server
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
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
			context: async ({ req, res }) => {
				const auth = req ? req.headers.authorization : null;
				if (auth && auth.toLowerCase().startsWith('bearer ')) {
					const decodedToken = jwt.verify(
						auth.substring(7),
						process.env.JWT_SECRET
					);
					const currentUser = await User.findById(decodedToken.id).populate(
						'friends'
					);
					return { currentUser };
				}
			},
		})
	);

	httpServer.listen(process.env.PORT || 4000, () =>
		console.log(`Server is running on http://localhost:${process.env.PORT}`)
	);
};

start();
