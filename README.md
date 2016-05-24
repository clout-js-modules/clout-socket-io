clout-socket-io
==================
## Install
In the directory of your clout-js application, do the following;

1) Install this package
```bash
npm install clout-socket-io
```

2) Add this module to ```package.json``` or ```clout.json```
```JSON
{
    ...
    "modules": ["clout-socket-io"]
    ...
}
```

## Usage
This module inject socket.io into clout and makes use of the express session. e.g.
```
var clout = require('clout-js'),
    sio = clout.sio;

sio.sockets.on("connection", function(socket) {
  socket.request.session // Express session is also available in Sockets!
  socket.logger // Clout logger are also exposed!
  socket.models // Clout models are here too!
});
```

