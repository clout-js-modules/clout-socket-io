const path = require('path');
const clout = require('clout-js');

clout.loadHooksFromDir(path.join(__dirname, '../../..'));

clout.start();

module.exports = clout;
