'use strict';

const createTable = `CREATE TABLE IF NOT EXISTS channels (
	name            TEXT    NOT NULL,
	password	      INTEGER NOT NULL,
	url	            TEXT    NOT NULL UNIQUE,
	splitterAddress TEXT    NOT NULL,
  description	    TEXT    NOT NULL,
  headerSize      INTEGER NOT NULL,
  visible         INTEGER NOT NULL DEFAULT 1
);`;

const selectAllChannels = `SELECT name, url, splitterAddress, description
  FROM channels
  WHERE VISIBLE = 1
  LIMIT @limit OFFSET @offset`;

const selectChannel = `SELECT name, splitterAddress, description
  FROM channels WHERE url = (?)`;

const insertChannel = `INSERT INTO channels VALUES (
  @name, @password, @url, @splitterAddress, @description, @headerSize, 1 )`;

const updateChannel = `UPDATE channels
  SET name = @name, description = @description
  WHERE url = @url`;

const deleteChannel = 'DELETE FROM channels WHERE url = (?)';

const selectHash = 'SELECT password FROM channels WHERE url = (?)';

module.exports = {
  createTable,
  selectAllChannels,
  selectChannel,
  insertChannel,
  updateChannel,
  deleteChannel,
  selectHash
};
