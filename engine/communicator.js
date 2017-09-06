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
const crypto = require('crypto');
const logger = require('kaho');
const missive = require('missive');
const config = require('../configs/config');
const db = require('../models/channelModel');

// Map to hold request id => promise resolver value
const requests = new Map();
let socket = undefined;

const responseHandler = res => {
  switch (res.type) {
    case 'result':
      const resolver = requests.get(res.url);
      if (resolver === undefined) {
        reject('Malformed response recieved from engine');
      } else {
        resolver(res);
      }
      requests.delete(res.url);
      break;
    case 'remove':
      db.removeChannel(res.url);
      break;
    default:
      logger('WARN', 'Bad response from standalone Engine');
  }
};

const waitForConnection = () => {
  const key = crypto.randomBytes(256).toString('hex');
  logger('SUCCESS', 'Secure key generated:', key);

  const server = net.createServer();
  return new Promise(resolve => {
    server.on('connection', socket => {
      const encode = missive.encode();
      encode
        .pipe(socket)
        .pipe(missive.parse())
        .on('message', responseHandler);

      encode.write({ type: 'auth', key });
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
  socket.write({ type: 'remove', url });
};

// Methods for standaloneEngine
let encoder = undefined;
const setEncoder = enc => {
  encoder = enc;
};
const engineChannelRemove = url => {
  if (encoder === undefined) {
    logger('WARN', 'Could not send remove channel request to server');
  } else {
    encoder.write({ type: 'remove', url });
  }
};

module.exports = {
  connect,
  launch,
  stop,
  setEncoder,
  engineChannelRemove
};
