/**
 * Splitter process launcher module for engine module
 *
 * Exports methods
 *  - launchSplitter
 *
 * @module engine/splitterProcess
 */

'use strict';

const fs = require('fs');
const os = require('os');
const logger = require('kaho');
const { promisify } = require('util');
const { spawn } = require('child_process');
const { getPort } = require('./getPort');
const config = require('./../configs/config');
const { genCmdSplitter } = require('./cmdGen');

/**
 * Async function to launch splitter process for given channel, returns splitter
 * process and address on success, otherwise throws Error
 *
 * @param {Object} channel - Channel object containing relevant information
 * @throws Will throw an error if process fails to launch or log file fails
 * @returns {Object} Contains splitter process and address
 */
const launchSplitter = async channel => {
  const cmdParams = [
    channel.sourceAddress,
    channel.sourcePort,
    0,
    channel.name,
    channel.headerSize
  ];
  cmdParams[2] = await getPort();

  const stamp = new Date().getTime();
  const name = os.tmpdir() + '/P2PSP-' + channel.url + '-' + stamp + '.log';
  const openFile = promisify(fs.open);
  const splitterFD = await openFile(name, 'a');

  const splitterArgs =
    genCmdSplitter(...cmdParams) +
    (channel.isSmartSourceClient ? ' --smart_source_client 1' : '');

  const splitterProcess = spawn('./splitter', splitterArgs.split(' '), {
    cwd: config.splitterBin,
    stdio: ['ignore', splitterFD, splitterFD]
  });
  splitterProcess.on('error', err => {
    logger('WARNING', channel.name + ': splitter error', err);
  });
  splitterProcess.on('exit', code => {
    logger('INFO', channel.name + ': splitter closed', code);
  });

  return {
    process: splitterProcess,
    address: config.splitterAddress + ':' + cmdParams[2]
  };
};

module.exports = {
  launchSplitter
};
