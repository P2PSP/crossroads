const express = require('express');
const morgan = require('morgan');
const logger = require('kaho');
const Database = require('better-sqlite3');
const config = require('./configs/config');
const channelApi = require('./routes/channelRoutes');
const db = require('./models/channelModel');

db.setDB(new Database('p2psp_rest_server.db'));
db.start();

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Welcome to P2PSP rest_server.');
});

app.use('/channels', channelApi);

app.listen(config.port, () => {
  logger('INFO', 'Starting P2PSP server');
});
