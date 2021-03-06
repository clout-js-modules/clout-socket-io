/*!
 * clout-socket-io
 * Copyright(c) 2018 Muhammad Dadu
 * MIT Licensed
 */
const _ = require('lodash');
const path = require('path');
const { getGlobbedFiles } = require('clout-js/lib/utils');
const CloutSocketHandler = require('./CloutSocketHandler');


function loadFile(filePath) {
    let file = require(filePath);
    let names = Object.keys(file);
    let group = path.basename(filePath, 'js');

    console.log(`loading file '${filePath}'`);

    return {file, names, group};
}

/**
 * CloutSocketManager
 * @class
 */
class CloutSocketManager {

    /**
     * @constructor
     * @param {object} io socket.io instance
     */
    constructor(clout) {
        this.clout = clout;
        this.logger = clout.logger;
        this.io = clout.sio;
        this.handlers = {};

        this.initialize();
    }

    createGlobForPath(dir) {
        return path.join(dir, 'sockets/**.js');
    }

    initialize() {
        let applicationSocketsGlob = this.createGlobForPath(this.clout.rootDirectory);
        let moduleSocketsGlobs = this.clout.modules.map((module) => this.createGlobForPath(module.path));

        this.initializeSocketHandlersForFiles(getGlobbedFiles(applicationSocketsGlob));
        moduleSocketsGlobs.forEach((path) => this.initializeSocketHandlersForFiles(getGlobbedFiles(path)));
    }

    /**
     * initializes socket handling for files
     * @param {array} files
     */
    initializeSocketHandlersForFiles(files) {
        this.logger.debug(`loading socket handlers from '${files}'`);

        files.forEach((filePath) => {
            const {file, names, group} = loadFile(filePath);

            names.forEach((name) => {
                let handlerOpts = Object.assign({ name: name, group: group, }, file[name]);
                let handler = new CloutSocketHandler(handlerOpts);

                if (!this.handlers[handler.nsp]) {
                    this.createNamespace(handler.nsp);
                }

                this.handlers[handler.nsp].push(handler);
            });
        });

        this.logger.debug(`loading socket handlers '${this.handlers}'`);
    }

    /**
     * attaches socket handling to namespace
     * @param {string} name
     */
    createNamespace(name) {
        this.handlers[name] = [];
        this.io.of(name).on('connection', (client) => this.onConnection(client));
    }

    /**
     * onConnection
     * @param {object} socket
     * @param {object} socket.id
     */
    onConnection(socket) {
        let handlers = this.handlers[socket.nsp.name] || [];

        socket.on('disconnect', () => this.onDisconnect(socket));
        handlers.forEach((handler) => handler.attachToClient(socket));
    }

    /**
     * onDisconnect
     * @param {object} client
     * @param {object} client.id
     */
    onDisconnect(client) {

    }
}

module.exports = CloutSocketManager;
module.exports.utils = {
    loadFile
};
