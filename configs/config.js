/**
 * Config module containing useful constants used throughout the application.
 *
 * Exports following constants
 *  - port
 *  - splitterBin
 *  - splitterAddress
 *  - monitorBin
 *  - standaloneEngine
 *  - standaloneEnginePort

 * And following methods
 *  - checkBinaries
 *
 * @module configs/config
 */

'use strict';

const fs = require('fs');
const logger = require('kaho');

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
 * Flag to activate standalone engine module, picks from env P2PSP_ENGINE
 *
 * @constant
 * @type {boolean}
 * @default false
*/
const standaloneEngine = process.env.P2PSP_ENGINE || false;

/**
 * Standalone engine port number, picks from env ENGINEPORT
 *
 * @constant
 * @type {number}
 * @default 3000
*/
const standaloneEnginePort = process.env.ENGINEPORT || 5000;

/**
 * P2PSP splitter bind address. By default '127.0.0.1' is picked if nothing is
 * supplied. Set via env - SBINDADDRESS.
 *
 * @constant
 * @type {string}
 * @default '127.0.0.1'
*/
const splitterAddress = process.env.SBINDADDRESS || '127.0.0.1';

/**
 * P2PSP splitter binary path. Set via env - SPLITTERBIN.
 *
 * @constant
 * @type {string}
*/
const splitterBin = process.env.SPLITTERBIN;

/**
 * P2PSP monitor binary path. Set via env - MONITORBIN.
 *
 * @constant
 * @type {string}
*/
const monitorBin = process.env.MONITORBIN;

/**
 * Method to check if proper P2PSP core binaries are present on supplied path.
 * Exits with code 1 if checks fail.
 */
const checkBinaries = () => {
  if (
    !fs.existsSync(splitterBin + '/splitter') ||
    !fs.existsSync(monitorBin + '/monitor')
  ) {
    logger('ERROR', 'Could not find P2PSP binaries!!', splitterBin, monitorBin);
    process.exit(1);
  }
};

module.exports = {
  port,
  splitterBin,
  splitterAddress,
  monitorBin,
  standaloneEngine,
  standaloneEnginePort,
  checkBinaries
};
