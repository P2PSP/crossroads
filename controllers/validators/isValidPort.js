/**
 * Function to check if passed parameter is valid port number or not.
 *
 * @param {Number} port - Port number
 * @returns {boolean}
 */
const isValidPort = port => {
  port = parseInt(port, 10);
  return !(isNaN(port) || port < 1 || port > 65535);
};

module.exports = isValidPort;
