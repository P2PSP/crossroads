const createTable = `CREATE TABLE IF NOT EXISTS channels (
	name          TEXT    NOT NULL,
	password	    INTEGER NOT NULL,
	url	          TEXT    NOT NULL UNIQUE,
	splitterAddr  TEXT    NOT NULL,
  description	  TEXT    NOT NULL,
  sourceAddress TEXT    NOT NULL,
  sourcePort    INTEGER NOT NULL,
  headerSize    INTEGER NOT NULL,
  visible       INTEGER NOT NULL DEFAULT 1
);`;

const selectAllChannels = `SELECT name, url, splitterAddr, description
  FROM channels
  WHERE VISIBLE = 1
  LIMIT @limit OFFSET @offset`;

const selectChannel = `SELECT name, splitterAddr, description
  FROM channels WHERE url = (?)`;

const insertChannel = `INSERT INTO channels VALUES (
  @name, @password, @url, @splitterAddr, @description,
  @sourceAddress, @sourcePort, @headerSize, 1 )`;

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
