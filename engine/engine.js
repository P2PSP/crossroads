const onExit = require('signal-exit');
const logger = require('kaho');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const { genCmdSplitter, genCmdMonitor } = require('./cmdGen');
const { getPort } = require('./getPort');
const config = require('./../configs/config');

const splitterStore = new Map();

const launch = async channel => {
  const cmdParams = [
    channel.sourceAddress,
    channel.sourcePort,
    0,
    channel.name,
    channel.headerSize
  ];

  let splitterPort, monitorPort;

  try {
    splitterPort = await getPort();
    monitorPort = await getPort();
  } catch (err) {
    return false;
  }

  cmdParams[2] = splitterPort;

  const stamp = new Date().getTime();
  const sLog = os.tmpdir() + '/P2PSP-' + channel.url + '-' + stamp + '.log';
  const mLog = os.tmpdir() + '/P2PSP-M-' + channel.url + '-' + stamp + '.log';
  const outS = fs.openSync(sLog, 'a');
  const outM = fs.openSync(mLog, 'a');

  const splitterArgs = genCmdSplitter(...cmdParams);
  const splitterProcess = spawn('./splitter', splitterArgs.split(' '), {
    cwd: config.splitterBin,
    stdio: ['ignore', outS, 'pipe']
  });
  splitterProcess.on('err', err => {
    logger('ERROR', 'Splitter process error', channel.url, err);
  });
  splitterProcess.stderr.on('data', err => {
    logger('ERROR', 'Splitter process error', channel.url, err.toString());
  });
  splitterProcess.on('exit', (err, code) => {
    logger('INFO', 'Splitter process closed', channel.url, code);
  });

  const monitorArgs = genCmdMonitor(config.splitterAddress, splitterPort);
  const monitorProcess = spawn('./monitor', monitorArgs.split(' '), {
    cwd: config.monitorBin,
    stdio: ['ignore', outM, 'pipe']
  });
  monitorProcess.on('err', err => {
    logger('ERROR', 'Monitor process error', channel.url, err);
  });
  monitorProcess.stderr.on('data', err => {
    logger('ERROR', 'Monitor process error', channel.url, err.toString());
  });
  monitorProcess.on('exit', (err, code) => {
    logger('INFO', 'Monitor process closed', channel.url, code);
  });

  splitterStore.set(channel.url, {
    splitter: splitterProcess,
    monitor: monitorProcess
  });

  return config.splitterAddress + ':' + splitterPort;
};

const stop = url => {
  const o = splitterStore.get(url);
  if (o !== undefined) {
    o.splitter.kill('SIGTERM');
    o.monitor.kill('SIGTERM');
  }
};

onExit(function(code, signal) {
  splitterStore.forEach(o => {
    o.splitter.kill('SIGKILL');
    o.monitor.kill('SIGKILL');
  });
});

module.exports = {
  launch,
  stop
};
