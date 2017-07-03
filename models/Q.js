const createTable = `CREATE TABLE IF NOT EXISTS channels (
	name         TEXT    NOT NULL,
	password	   INTEGER NOT NULL,
	url	         TEXT    NOT NULL UNIQUE,
	splitterList TEXT    NOT NULL,
  description	 TEXT    NOT NULL DEFAULT '',
  visible      INTEGER NOT NULL DEFAULT 1
);`;

const selectAllChannels = `SELECT name, url, splitterList, description
  FROM channels
  WHERE VISIBLE = 1
  LIMIT @limit OFFSET @offset`;

const selectChannel = `SELECT name, splitterList, description
  FROM channels WHERE url = (?)`;

const insertChannel = `INSERT INTO channels VALUES (
  @name, @password, @url, @splitterList, @description, 1 )`;

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
