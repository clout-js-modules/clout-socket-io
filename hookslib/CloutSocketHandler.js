/*!
 * clout-socket-io
 * Copyright(c) 2018 Muhammad Dadu
 * MIT Licensed
 */
const { each } = require('async');

/**
 * Priority for core hooks
 * @typedef {object} CLOUT_SOCKET_HANDLER_DEFAULTS
 * @property {string} type on
 * @property {string} nsp /
 * @property {array} hooks []
 * @const
 */
const CLOUT_SOCKET_HANDLER_DEFAULTS = {
    type: 'on',
    namespace: '/',
    hooks: []
};

/**
 * CloutSocketManager
 * @class
 */
class CloutSocketHandler {

    /**
     * @param {object} opts handleroptions
     * @param {string} opts.group group
     * @param {string} opts.event event name
     * @param {string} opts.fn function to be executed
     * @param {string} [opts.type] typeof event
     * @param {string} [opts.namespace] namespace
     * @param {array} [opts.hooks] middleware for your events [(data, next) => next()]
     */
    constructor(opts) {
        this.name = opts.name;
        this.group = opts.group;
        this.event = opts.event;
        this.fn = opts.fn;

        this.type = opts.type || CLOUT_SOCKET_HANDLER_DEFAULTS.type;
        this.nsp = opts.namespace || CLOUT_SOCKET_HANDLER_DEFAULTS.namespace;
        this.hooks = opts.hooks || CLOUT_SOCKET_HANDLER_DEFAULTS.hooks;
    }

    /**
     * @param {object} socket socket.io socket object
     */
    attachToClient(socket) {
        socket[this.type](this.event, (data, next) => this._handle(socket, data, next));
    }

    _call(fn, data, next) {
        fn.apply({
            socket: socket
        }, [data, next]);
    }

    _handle(socket, data, next) {
        each(this.hooks,
            (hook, next) => _call(socket, hook, data, next),
            (err) => {
                if (err) { return next(err); }
                this._call(socket, this.fn, data, next);
            }
        );
    }
}

module.exports = CloutSocketHandler;
