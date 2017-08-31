'use strict';

const net = require('net');
const missive = require('missive');
const encode = missive.encode();
const engine = require('./engine/engine');

// parse command line args
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .describe('ip', 'IP address of server')
  .alias('ip', 'i')
  .default('ip', '127.0.0.1')
  .describe('port', 'Port number of server')
  .alias('port', 'p')
  .help('help')
  .alias('help', 'h')
  .example('$0 -p 8000', 'Connect to server running on 127.0.0.1:8000')
  .example(
    '$0 -i 192.168.1.23 -p 8000',
    'Connect to server running on 192.168.1.23:8000'
  )
  .demandOption(['i', 'p']).argv;

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

const reqHandler = async channel => {
  let result = false;
  let payload = [];
  if (isValid(channel)) {
    try {
      payload = await engine.launch(channel);
      result = true;
    } catch(e) {
      result = false;
    }
  }
  encode.write({ result, payload });
};

// connect to crossrads server
const client = net.createConnection({ host: argv.h, port: argv.p });
encode.pipe(client);

client.pipe(missive.parse()).on('message', reqHandler);