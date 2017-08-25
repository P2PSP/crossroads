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

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


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
  const port = channel.monitorPort ? channel.monitorPort : await getPort();

  const openFile = promisify(fs.open);
  const stamp = new Date().getTime();
  const name = os.tmpdir() + '/P2PSP-M-' + channel.url + '-' + stamp + '.log';
  const monitorFD = await openFile(name, 'a');

  const monitorArgs =
    genCmdMonitor(config.splitterAddress, splitterPort, port) +
    (channel.isSmartSourceClient ? ' --smart_source_client 1' : '');

  let isError = false;

  const monitorProcess = spawn('./monitor', monitorArgs.split(' '), {
    cwd: config.monitorBin,
    stdio: ['ignore', monitorFD, monitorFD]
  });
  monitorProcess.on('error', err => {
    isError = true;
    logger('Warning', channel.name + ': monitor error', err, name);
  });
  monitorProcess.on('exit', code => {
    isError = true;
    logger('INFO', channel.name + ': monitor closed', code, name);
  });

  await sleep(50);

  return {
    process: monitorProcess,
    address: config.splitterAddress + ':' + port,
    error: isError
  };
};

module.exports = {
  launchMonitor
};
