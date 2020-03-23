import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

let io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';

export default io