/**
 * Communicator module to establish connection and execute commands on remote
 * standalone engine
 *
 * Exports methods
 *  - connect
 *  - launch
 *  - stop
 *
 * @module engine/communicator
 */

const net = require('net');
const logger = require('kaho');
const missive = require('missive');
const config = require('../configs/config');

// Map to hold request id => promise resolver value
const requests = new Map();
let socket = undefined;

const waitForConnection = () => {
  const server = net.createServer();
  return new Promise((resolve, reject) => {
    server.on('connection', socket => {
      const encode = missive.encode();
      encode
        .pipe(socket)
        .pipe(missive.parse())
        .on('message', res => {
          const resolver = requests.get(res.url);
          if(resolver === undefined) {
            reject('Malformed response recieved from engine');
          } else {
            resolver(res);
          }
          requests.delete(res.url);
        });
      resolve(encode);
    });
    server.on('close', () => {
      logger('ERROR', 'Connection dropped with engine');
      process.exit(1);
    });
    server.on('error', e => {
      logger('ERROR', 'Error occurred with engine connection', e);
      process.exit(1);
    });
    server.listen(config.standaloneEnginePort);
  });
};

const connect = async () => {
  try {
    socket = await waitForConnection();
  } catch (e) {
    logger('ERROR', 'Error while connecting to engine');
  }
};

const sendReq = (socket, req) => {
  socket.write(req);
  return new Promise(resolve => {
    requests.set(req.channel.url, resolve);
  });
};

const launch = async channel => {
  try {
    const response = await sendReq(socket, { type: 'add', channel });
    return response.result ? response.payload : false;
  } catch (e) {
    logger('ERROR', 'Error while launching channel', e);
    return false;
  }
};

const stop = async url => {
  try {
    const socket = await getSocket();
    socket.write({ type: 'remove', url });
  } catch (e) {
    logger('ERROR', 'Error while stopping channel', e);
  }
};

module.exports = {
  connect,
  launch,
  stop
};
