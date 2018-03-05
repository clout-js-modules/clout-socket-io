/**
 * Chat Example
 */
const clout = require('clout-js');

module.exports = {
    join: {
        type: 'on',
        event: 'join',
        namespace: '/chat',
        fn(roomName, cb) {
            this.socket.join(roomName);
            cb(null, 'Success');
        }
    },
    leave: {
        type: 'on',
        event: 'leave',
        namespace: '/chat',
        fn(roomName, cb) {
            this.socket.leave(roomName);
            cb(null, 'Success');
        }
    },
    sendMessege: {
        type: 'on',
        event: 'send_messege',
        namespace: '/chat',
        fn(data, cb) {
            let from = this.socket.id;
            let { roomName, messege } = data;

            clout.sio.of('chat').to(roomName).emit('messege', {
                roomName, messege, from
            });
        }
    }
};
