/**
 * Splitter and Monitor process management engine module
 *
 * Exports methods
 *  - launch
 *  - stop
 *  - setProcessMap
 *
 * @module engine/engine
 */

const onExit = require('signal-exit');
const { launchSplitter } = require('./splitterProcess');
const { launchMonitor } = require('./monitorProcess');

// Map of [channelUrl] => {splitter, monitor} processes
let processMap = new Map();

/**
 * Function to set processMap to supplied map type
 *
 * @param {Map} mapp - Map to store all running processes
 */
const setProcessMap = mapp => {
  processMap = mapp;
};

/**
 * Async function to launch splitter and monitor processes for given channel,
 * returns splitter and monitor address on success, otherwise throws Error
 *
 * @param {Array} strings - Array of Strings
 * @param {Array} params - Array of arguments passed to function
 * @throws Will throw an error if any process fails to launch
 * @returns {Array} Array of splitter and monitor address
 */
const launch = async channel => {
  const splitter = await launchSplitter(channel);
  const splitterPort = splitter.address.split(':')[1];
  const monitor = await launchMonitor(channel, splitterPort);

  processMap.set(channel.url, {
    splitter: splitter.process,
    monitor: monitor.process
  });

  return [splitter.address, monitor.address];
};

/**
 * Function to stop splitter and monitor process associated with certain channel
 *
 * @param {string} url - Unique channel url for which stop is to be called
 */
const stop = url => {
  const o = processMap.get(url);
  if (o !== undefined) {
    o.splitter.kill('SIGTERM');
    o.monitor.kill('SIGTERM');
  }
};

/**
 * OnExit handler, in case of fatal exit all processes are killed
 */
onExit((code, signal) => {
  processMap.forEach(o => {
    o.splitter.kill('SIGKILL');
    o.monitor.kill('SIGKILL');
  });
});

module.exports = {
  launch,
  stop,
  setProcessMap
};
