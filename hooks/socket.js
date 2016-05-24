/*!
 * clout-socket-io
 * Copyright(c) 2015 - 2016 Muhammad Dadu
 * MIT Licensed
 */
const
	debug = require('debug')('clout-socket-io:hooks/socket'),
	socket = require('socket.io');

module.exports = {
	initialize: {
		event: 'start',
		priority: 26,
		fn: function (next) {
			var self = this,
				sessionMiddleware = this.app.session;

			// start socket
			debug('start socket');
			this.sio = socket(this.server.http);

			// append session information from express
			this.sio.use(function(socket, next) {
				// expose clout server
				socket.logger = self.logger;
				socket.models = self.models;
				// check if sessionMiddleware exists
				if (!sessionMiddleware) {
					debug('sessionMiddleware not found');
					self.logger.warn('sessionMiddleware not found');
					return next();
				}
				debug('sessionMiddleware appended');
				sessionMiddleware(socket.request, socket.request.res, next);
			});
			next();
		}
	}
};
