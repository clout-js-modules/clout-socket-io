/*!
 * clout-socket-io
 * Copyright(c) 2015 - 2018 Muhammad Dadu
 * MIT Licensed
 */
const socket = require('socket.io');

module.exports = {
	initialize: {
		event: 'start',
		priority: 26,
		fn: function (next) {
			this.logger.info('attached socket to server');
			this.sio = socket(this.server.http);
			next();
		}
	},
	middleware: {
		event: 'start',
		priority: 27,
		fn: function (next) {
			let sessionMiddleware = this.app.session;

			this.logger.info('attaching clout-js middleware to socket');

			// append session information from express
			this.sio.use((socket, next) => {
				// expose clout server
				socket.logger = this.logger;
				socket.models = this.models;

				// check if sessionMiddleware exists
				if (!sessionMiddleware) {
					this.logger.warn('sessionMiddleware not found');
					return next();
				}

				sessionMiddleware(socket.request, socket.request.res, next);
			});

			next();
		}
	}
};
