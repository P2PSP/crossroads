/**
 * Config module containing useful constants used throughout the application.
 *
 * Exports following constants
 *  - port
 *
 * @module configs/config
 */

/**
 * Default port number for running Server. Default value is 3000 which is picked
 * if there is no PORT env variable set.
 *
 * @constant
 * @type {number}
 * @default 3000
*/
const port = process.env.PORT || 3000;

module.exports = {
  port
};
