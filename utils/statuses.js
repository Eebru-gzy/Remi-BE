"use strict";

const badRequestResponse = (message) => {
	const status = 400;
	return { statusCode: status, message };
};

const unauthorizedResponse = (message) => {
	const status = 401;
	return { statusCode: status, message };
};

const notFoundResponse = (message) => {
	const status = 404;
	return { statusCode: status, message };
};

const forbiddenResponse = (message) => {
	const status = 403;
	return { statusCode: status, message };
};

const internalServerErrorResponse = (message) => {
	const status = 500;
	return { statusCode: status, message };
};

module.exports = {
	unauthorizedResponse,
	forbiddenResponse,
	notFoundResponse,
	badRequestResponse,
	internalServerErrorResponse,
};
