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
const db = require('./../models/channelModel');
const mode = require('./mode');
const communicator = require('./communicator');

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

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
    0,
    0,
    channel.name,
    channel.headerSize
  ];
  cmdParams[1] = channel.isSmartSourceClient
    ? await getPort()
    : channel.sourcePort;
  cmdParams[2] = channel.splitterPort ? channel.splitterPort : await getPort();

  const stamp = new Date().getTime();
  const name = os.tmpdir() + '/P2PSP-' + channel.url + '-' + stamp + '.log';
  const openFile = promisify(fs.open);
  const splitterFD = await openFile(name, 'a');

  const splitterArgs =
    genCmdSplitter(...cmdParams) +
    (channel.isSmartSourceClient ? ' --smart_source_client 1' : '');

  let isError = false;

  const splitterProcess = spawn('./splitter', splitterArgs.split(' '), {
    cwd: config.splitterBin,
    stdio: ['ignore', splitterFD, splitterFD]
  });
  splitterProcess.on('error', err => {
    isError = true;
    if(mode.isStandaloneEngine()) {
      communicator.engineChannelRemove(channel.url);
    } else {
      setTimeout(() => {
        db.removeChannel(channel.url);
      }, 1000);
    }
    logger('WARNING', channel.name + ': splitter error', err, name);
  });
  splitterProcess.on('exit', code => {
    isError = true;
    if (mode.isStandaloneEngine()) {
      communicator.engineChannelRemove(channel.url);
    } else {
      setTimeout(() => {
        db.removeChannel(channel.url);
      }, 1000);
    }
    logger('DEBUG', channel.name + ': splitter closed', code, name);
  });

  await sleep(50);

  return {
    process: splitterProcess,
    address: config.splitterAddress + ':' + cmdParams[2],
    listenPort: channel.isSmartSourceClient ? cmdParams[1] : undefined,
    error: isError
  };
};

module.exports = {
  launchSplitter
};
