/*!
 * clout-socket-io
 * Copyright(c) 2015 - 2018 Muhammad Dadu
 * MIT Licensed
 */

/**
 * @module clout-socket-io/hooks/socket
 */
const socket = require('socket.io');
const CloutSocketManager = require('../hookslib/CloutSocketManager');

module.exports = {
	/**
	 * add socket.io to server
	 * @property {event} event start
	 * @property {priority} priority 26
	 */
	initialize: {
		event: 'start',
		priority: 26,
		fn: function (next) {
			this.logger.info('attached socket to server');
			this.sio = socket(this.server.http);
			next();
		}
	},

	/**
	 * attach clout middleware to socket
	 * @property {event} event start
	 * @property {priority} priority 27
	 */
	middleware: {
		event: 'start',
		priority: 27,
		fn: function (next) {
			let sessionMiddleware = this.app.session;

			this.logger.info('attaching clout-js middleware');

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
	},

	/**
	 * attach clout socket manager to socket
	 * @property {event} event start
	 * @property {priority} priority 28
	 */
	socketManager: {
		event: 'start',
		priority: 28,
		fn: function (next) {
			this.logger.info('attaching clout-js CloutSocketManager');
			this.modules.socketManager = new CloutSocketManager(this);
			next();
		}
	}
};
