'use strict';

const express = require('express');
const morgan = require('morgan');
const logger = require('kaho');
const Database = require('better-sqlite3');
const config = require('./configs/config');
const channelApi = require('./routes/channelRoutes');
const frontend = require('./routes/frontendRoutes');
const db = require('./models/channelModel');
const communicator = require('./engine/communicator');

config.checkBinaries();

const stamp = new Date().getTime();
db.setDB(new Database('database-' + stamp + '.db'));
db.start();

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev'));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/channels', channelApi);
app.use('/', frontend);

app.listen(config.port, async () => {
  if(config.standaloneEngine) {
    logger('INFO', 'Waiting for standalone engine connection...');
    await communicator.connect();
    logger('SUCCESS', 'Connected successfully with standalone engine!');
  }
  logger('DEBUG', 'Starting P2PSP server at http://localhost:' + config.port);
});
