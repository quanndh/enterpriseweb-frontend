import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import config from '../../config';

let io = sailsIOClient(socketIOClient);
io.sails.url = config.HOST;

export default io