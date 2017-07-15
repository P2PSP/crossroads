const net = require('net');
const config = require('./../configs/config');

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
