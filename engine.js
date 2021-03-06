'use strict';

const fs = require('fs');
const net = require('net');
const logger = require('kaho');
const missive = require('missive');
const engine = require('./engine/engine');
const mode = require('./engine/mode');
const communicator = require('./engine/communicator');

mode.setStandaloneEngineMode(true);
const encode = missive.encode();
communicator.setEncoder(encode);

const noop = () => {};

// parse command line args
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .describe('ip', 'IP address of server')
  .alias('ip', 'i')
  .default('ip', '127.0.0.1')
  .describe('port', 'Port number of server')
  .alias('port', 'p')
  .describe('key', 'path to secure key')
  .alias('key', 'k')
  .help('help')
  .alias('help', 'h')
  .example(
    '$0 -i 192.168.1.23 -p 8000 -k ~/my-key.txt',
    'Connect to server on 192.168.1.23:8000 with given key location'
  )
  .demandOption(['i', 'p', 'k']).argv;

const secureKey = fs.readFileSync(argv.k, 'utf-8').trim();

// channel property validator
const isValid = channel => {
  const validNameDescription =
    typeof channel.name === 'string' && typeof channel.description === 'string';

  const validSourceAddress = typeof channel.sourceAddress === 'string';

  const validSourcePort =
    typeof channel.sourcePort === 'number' &&
    channel.sourcePort > 0 &&
    channel.sourcePort < 65535;

  const validHeaderSize =
    typeof channel.headerSize === 'number' && channel.headerSize >= 0;

  const validISSC = typeof channel.isSmartSourceClient === 'boolean';

  const validSplitterMonitorPort =
    (channel.splitterPort > 0 &&
      channel.splitterPort < 65535 &&
      typeof channel.splitterPort === 'number' &&
      channel.monitorPort > 0 &&
      channel.monitorPort < 65535 &&
      typeof channel.monitorPort === 'number') ||
    (typeof channel.splitterPort === 'undefined' &&
      typeof channel.monitorPort === 'undefined');

  const validRest =
    channel.isSmartSourceClient ||
    (!channel.isSmartSourceClient &&
      net.isIP(channel.sourceAddress) !== 0 &&
      channel.sourcePort > 0 &&
      channel.sourcePort < 65535 &&
      typeof channel.sourcePort === 'number');

  return (
    validNameDescription &&
    validSourceAddress &&
    validSourcePort &&
    validHeaderSize &&
    validISSC &&
    validSplitterMonitorPort &&
    validRest
  );
};

const reqHandler = async req => {
  let result = false;
  let payload = [];

  switch (req.type) {
    case 'add':
      if (isValid(req.channel)) {
        try {
          payload = await engine.launch(req.channel);
          result = true;
        } catch (e) {
          result = false;
        }
      }
      encode.write({ type: 'result', url: req.channel.url, result, payload });
      break;

    case 'remove':
      engine.stop(req.url);
      break;
  }
};

let authenticate = req => {
  if (req.type === 'auth' && req.key === secureKey) {
    logger('SUCCESS', 'Authentication successfully with supplied key');
  } else {
    logger('ERROR', 'Supplied key do not match. Exiting!');
    process.exit(1);
  }
  authenticate = noop;
};

const msgHandler = req => {
  // runs only 1 time
  authenticate(req);
  // runs each time
  reqHandler(req);
};

// connect to crossroads server
const client = net.createConnection({ host: argv.h, port: argv.p });
logger('SUCCESS', 'Connection established with Crossroads server');
encode.pipe(client);

client
  .pipe(missive.parse())
  .on('message', msgHandler)
  .on('close', () => {
    logger('ERROR', 'Crossroads server closed connection');
    process.exit(1);
  })
  .on('error', e => {
    logger('ERROR', 'Error with crossroads connection', e);
    process.exit(1);
  });
