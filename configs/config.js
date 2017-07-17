/**
 * Config module containing useful constants used throughout the application.
 *
 * Exports following constants
 *  - port
 *
 * @module configs/config
 */

/**
 * Default port number for running Server. Default value is 3000 which is picked
 * if there is no PORT env variable set.
 *
 * @constant
 * @type {number}
 * @default 3000
*/
const port = process.env.PORT || 3000;

/**
 * P2PSP splitter binary path
 *
 * @constant
 * @type {string}
*/
const splitterBin = process.env.SPLITTERBIN;

/**
 * P2PSP splitter bind address
 *
 * @constant
 * @type {string}
 * @default '127.0.0.1'
*/
const splitterAddress = process.env.BINDADDRESS || '127.0.0.1';

/**
 * P2PSP monitor binary path
 *
 * @constant
 * @type {string}
*/
const monitorBin = process.env.MONITORBIN;

module.exports = {
  port,
  splitterBin,
  splitterAddress,
  monitorBin
};
