/**
 * Monitor process launcher module for engine module
 *
 * Exports methods
 *  - launchMonitor
 *
 * @module engine/monitorProcess
 */

'use strict';

const fs = require('fs');
const os = require('os');
const logger = require('kaho');
const { promisify } = require('util');
const { spawn } = require('child_process');
const { getPort } = require('./getPort');
const config = require('./../configs/config');
const { genCmdMonitor } = require('./cmdGen');

/**
 * Async function to launch monitor process for given channel, returns monitor
 * process and address on success, otherwise throws Error
 *
 * @param {Object} channel - Channel object containing relevant information
 * @param {Number} splitterPort - Port number of splitter process
 * @throws Will throw an error if process fails to launch or log file fails
 * @returns {Object} Contains monitor process and address
 */
const launchMonitor = async (channel, splitterPort) => {
  const port = await getPort();

  const openFile = promisify(fs.open);
  const stamp = new Date().getTime();
  const name = os.tmpdir() + '/P2PSP-M-' + channel.url + '-' + stamp + '.log';
  const monitorFD = await openFile(name, 'a');

  const monitorArgs =
    genCmdMonitor(config.splitterAddress, splitterPort, port) +
    (channel.isSmartSourceClient ? ' --smart_source_client 1' : '');

  const monitorProcess = spawn('./monitor', monitorArgs.split(' '), {
    cwd: config.monitorBin,
    stdio: ['ignore', monitorFD, monitorFD]
  });
  monitorProcess.on('error', err => {
    logger('Warning', channel.name + ': monitor error', err, name);
  });
  monitorProcess.on('exit', code => {
    logger('INFO', channel.name + ': monitor closed', code, name);
  });

  return {
    process: monitorProcess,
    address: config.splitterAddress + ':' + port
  };
};

module.exports = {
  launchMonitor
};
