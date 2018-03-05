# Handle a socket call
> Handling a socket should not be complicated. We have found you an elegent standardized solution.

1) Create a new file in the ```sockets/``` directory

2) Add the following to the file
e.g. chat.js

```javascript
module.exports = {
    join: {
        type: 'on',
        event: 'join',
        namespace: '/chat',
        fn(roomName, cb) {
            this.client.join(roomName);
            cb('Success');
        }
    }
}
```

3) Lets create another endpoint

```javascript
...
    leave: {
        type: 'on',
        event: 'join',
        namespace: '/chat',
        fn(roomName, cb) {
            this.client.leave(roomName);
            cb('Success');
        }
    },
    sendMessege: {
        type: 'on',
        event: 'send_messege',
        namespace: '/chat',
        fn(data, cb) {
            let {roomName, messege} = data;
            io.to(roomName).emit('messege', {
                roomName, messege
            });
        }
    }
...
```

4) Example usage

Note: this following example requires a transpiler for front-end or to manually include the dependencies.

Requires: socket.io-client

```javascript
const io = require('socket.io-client');
const chatSocket = io.connect('/chat');

chatSocket.emit('join', 'general');

chatSocket.on('messege', (data) => {
    let {messege} = data;
    console.log(messege);
});

chatSocket.emit('send_messege', 'Hello World!');
```
