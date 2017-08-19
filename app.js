'use strict';

const express = require('express');
const morgan = require('morgan');
const logger = require('kaho');
const Database = require('better-sqlite3');
const config = require('./configs/config');
const channelApi = require('./routes/channelRoutes');
const frontend = require('./routes/frontendRoutes');
const db = require('./models/channelModel');

db.setDB(new Database('p2psp_rest_server.db'));
db.start();

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev'));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/channels', channelApi);
app.use('/', frontend);

app.listen(config.port, () => {
  logger('INFO', 'Starting P2PSP server');
});
