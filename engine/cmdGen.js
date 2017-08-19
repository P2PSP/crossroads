/**
 * Command Generator module - Contains various methods for generating splitter &
 * monitor commands for execution.
 *
 * Exports methods
 *  - genCmdSplitter
 *  - genCmdMonitor
 *
 * @module engine/cmdGen
 */

'use strict';

/**
 * Tag Method that helps generating execution command for given string & params
 *
 * @param {Array} strings - Array of Strings
 * @param {Array} params - Array of arguments passed to function
 * @returns {String} string with all params placed at right position
 */
const tagCmd = (strings, ...params) => {
  let result = '';
  for (let i = 0; i < strings.length - 1; ++i) {
    result += strings[i] + params[i];
  }
  return result;
};

/**
 * Simply stiches together the command and params passed to this function to
 * generate splitter process execution command
 *
 * @param {Array} params - Array of arguments passed to function
 * @returns {String} splitter process execution command
 */
const genCmdSplitter = (...params) => {
  return tagCmd`--source_addr ${params[0]} --source_port ${params[1]} --splitter_port ${params[2]} --channel ${params[3]} --header_size ${params[4]}`;
};

/**
 * Simply stiches together the command and params passed to this function to
 * generate monitor process execution command
 *
 * @param {Array} params - Array of arguments passed to function
 * @returns {String} monitor process execution command
 */
const genCmdMonitor = (...params) => {
  return tagCmd`--splitter_addr ${params[0]} --splitter_port ${params[1]} --player_port ${params[2]}`;
};

module.exports = {
  genCmdSplitter,
  genCmdMonitor
};
