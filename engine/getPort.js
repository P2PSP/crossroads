/**
 * getPort module - generates a random port for instant use
 *
 * Exports methods
 *  - getPort
 *
 * @module engine/getPort
 */

'use strict';

const net = require('net');
const config = require('./../configs/config');

/**
 * Generates a random port via net.createServer() and returns it in a promise.
 *
 * @returns {Promise} promise resolving to port number
 */
const getPort = () => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.unref();
    server.on('error', reject);

    server.listen(0, config.bindAddress, () => {
      const port = server.address().port;
      server.close(() => {
        resolve(port);
      });
    });
  });
};

module.exports = { getPort };
