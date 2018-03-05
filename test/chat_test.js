/**
 * JWT socket test
 */
const testLib = require('clout-js/test/lib');
const { join } = require('path');
const should = require('should');
const io = require('socket.io-client');

const KITCHENSINK_DIR = join(__dirname, 'fixed/kitchensink');
const DEFAULT_SOCKET_OPTIONS = {
    'force new connection': true,
    reconnection: false
};

describe('module: clout-socket-io', () => {
    let clout;

    before(function (done) {
        this.timeout(0);
        process.env.PORT = 8420;
        clout = testLib.createInstance(KITCHENSINK_DIR);
        clout.on('started', () => done());
        setTimeout(() => done(), 1000);
    });

    after(() => clout.stop());

    describe('/chat test', () => {
        let client1;
        let client2;

        before((done) => {
            client1 = io.connect(testLib.config.serverAddress + '/chat', DEFAULT_SOCKET_OPTIONS);
            client1.on('connect', () => done());
        });

        before((done) => {
            client2 = io.connect(testLib.config.serverAddress + '/chat', DEFAULT_SOCKET_OPTIONS);
            client2.on('connect', () => done());
        });

        after(() => client1.close());
        after(() => client2.close());

        it('client1 should join general', (done) => {
            client1.emit('join', 'general', (err) => {
                should(err).be.equal(null);
                done()
            });
        });

        it('client2 should join general', (done) => {
            client2.emit('join', 'general', (err) => {
                should(err).be.equal(null);
                done()
            });
        });

        it('client1 should send messege on general and client2 should recieve', (done) => {
            client2.on('messege', (data) => {
                should(data).be.deepEqual({
                    from: client1.id,
                    roomName: 'general',
                    messege: 'hello world!'
                });
                done();
            });

            client1.emit('send_messege', {
                roomName: 'general',
                messege: 'hello world!'
            }, (err) => {
                should(err).be.equal(null);
            });
        });

        it('client1 leave general', (done) => {
            client1.emit('leave', 'general', (err) => {
                should(err).be.equal(null);
                done()
            });
        });

        it('client2 leave general', (done) => {
            client1.emit('leave', 'general', (err) => {
                should(err).be.equal(null);
                done()
            });
        });
    });
});
