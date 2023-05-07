require('dotenv').config();

const express = require('express');
require('express-async-errors');

const app = express();

const cors = require('cors');

const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const blogsRouter = require('./controllers/blogs');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to mongodb');
	})
	.catch((error) => logger.error('error connecting to mongodb', error.message));

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', userRouter);

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing');
	app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
