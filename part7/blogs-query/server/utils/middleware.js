const logger = require('./logger');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

const requestLogger = (req, res, next) => {
	logger.info('Method: ', req.method);
	logger.info('Path: ', req.path);
	logger.info('Body: ', req.body);
	logger.info('--- ');

	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'mal formatted id' });
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
		return res.status(400).json({ error: error.message });
	} else if (error.name === 'TokenExpiredError') {
		return res.status(400).json({ error: error.message });
	}

	next(error);
};

const getTokenFrom = (req) => {
	const authorization = req.get('authorization');

	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}
	return null;
};

const tokenExtractor = (req, res, next) => {
	const token = getTokenFrom(req);

	if (!token) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}

	const decodedToken = jwt.verify(token, process.env.SECRET);

	req.decodedToken = decodedToken;

	next();
};

const userExtractor = async (req, res, next) => {
	const token = getTokenFrom(req);

	if (!token) {
		return res.status(401).json({ error: 'token missing or invalid' });
	}

	const decodedToken = jwt.verify(token, process.env.SECRET);

	const user = await User.findById(decodedToken.id);

	req.user = user;

	next();
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
