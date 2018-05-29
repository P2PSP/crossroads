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

// parse command line args
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .describe('port', 'Port number of server')
  .alias('port', 'p')
  .default('p', 3000)
  .describe('standalone', 'Is standalone engine')
  .alias('standalone', 's')
  .default('s', true)
  .describe('engineport', 'Standalone engine port')
  .alias('engineport', 'e')
  .default('e', 5000)
  .describe('sip', 'Splitter bind address')
  .alias('sip', 'i')
  .default('i', '127.0.0.1')
  .describe('binary', 'Splitter/Monitor binaries path')
  .alias('binary', 'b')
  .default('b', '../console/bin/')
  .help('help')
  .alias('help', 'h')
  .example('$0 -p 3000 -b /home/bin/', 'Start server on port 3000')
  .demandOption(['b']).argv;

const port = argv.port;
const standaloneEngine = argv.standalone !== 'false';
const standaloneEnginePort = argv.engineport;
const splitterAddress = argv.sip;
//const splitterBin = argv.binary;
//const monitorBin = argv.binary;
const splitterBin = argv.binary;
const monitorBin = argv.binary;

/**
 * Method to check if proper P2PSP core binaries are present on supplied path.
 * Exits with code 1 if checks fail.
 */
const checkBinaries = () => {
  if (
    !fs.existsSync(splitterBin + 'splitter') ||
    !fs.existsSync(monitorBin + 'monitor')
  ) {
    logger('ERROR', 'Cannot find binaries. Exiting!', splitterBin, monitorBin);
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
