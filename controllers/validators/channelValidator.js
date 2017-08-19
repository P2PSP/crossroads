/**
 * ChannelValidator module - Contains various middlewares for validating
 * presence of appropriate data in req object and/or authorization process for
 * modifying exisiting data. Should be called before actual controller methods.
 *
 * Exports methods
 * - list
 * - add
 * - frontendAdd
 * - edit
 * - remove
 * - auth
 *
 * @module controllers/validators/channelValidator
 */

'use strict';

const argon2 = require('argon2');
const db = require('../../models/channelModel');
const logger = require('kaho');

/**
 * Validator for listing all existing channels. Sanitizes limit and offset query
 * and proceeds to next() middleware. If limit is more than 50 items, it will
 * default to 50.
 *
 * @param {Object} req - Express request object
 * @param {String} req.query.limit  - Numerical value for limit on items
 * @param {String} req.query.offset - Numerical value for offset of items
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const list = (req, res, next) => {
  req.query.limit = parseInt(req.query.limit) || undefined;
  req.query.offset = parseInt(req.query.offset) || undefined;

  if (req.query.limit != undefined && req.query.limit > 50) {
    req.query.limit = 50;
  }
  next();
};

/**
 * Request body validator for adding a new channel route. Validates the type of
 * data being sent and also performs checks on port numbers. Returns HTTP Status
 * 400 if wrong data is being sent otherwise calls next() middleware. Keep in
 * mind that this validator is seperate from frontendAdd() since this guards the
 * api rather than the frontend request.
 *
 * @param {Object} req - Express request object
 * @param {String} req.body.channelDescription - Description about the channel
 * @param {String} req.body.channelName - Name of the channel
 * @param {String} req.body.sourceAddress - Address of the source stream
 * @param {Number} req.body.sourcePort - Source port, should be between 0 - 65535
 * @param {Number} req.body.headerSize - Size of headers in bytes
 * @param {Boolean} req.body.isSmartSourceClient - Boolean flag to change modes
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const add = (req, res, next) => {
  if (
    typeof req.body.channelDescription !== 'string' ||
    typeof req.body.channelName !== 'string' ||
    typeof req.body.sourceAddress !== 'string' ||
    typeof req.body.sourcePort !== 'number' ||
    req.body.sourcePort > 65535 ||
    req.body.sourcePort < 0 ||
    typeof req.body.headerSize !== 'number' ||
    req.body.headerSize < 0 ||
    typeof req.body.isSmartSourceClient !== 'boolean'
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};

/**
 * Request body validator for adding a new channel through frontend. Validates
 * the type of data being sent and also performs checks on port numbers. Returns
 * HTTP Status 400 if wrong data is being sent otherwise calls next() middleware
 * The isSmartSourceClient is optional field because of the way HTTP form works
 * with a checkbox value, nothing is sent if it's not checked.
 *
 * @param {Object} req - Express request object
 * @param {String} req.body.channelDescription - Description about the channel
 * @param {String} req.body.channelName - Name of the channel
 * @param {String} req.body.sourceAddress - Address of the source stream
 * @param {Number} req.body.sourcePort - Source port, should be between 0 - 65535
 * @param {Number} req.body.headerSize - Size of headers in bytes
 * @param {Boolean} req.body.isSmartSourceClient - Boolean flag to change modes (optional)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const frontendAdd = (req, res, next) => {
  if (
    typeof req.body.channelDescription !== 'string' ||
    typeof req.body.channelName !== 'string' ||
    typeof req.body.sourceAddress !== 'string' ||
    typeof req.body.sourcePort !== 'string' ||
    typeof req.body.headerSize !== 'string'
  ) {
    res.sendStatus(400);
  } else {
    req.body.sourcePort = parseInt(req.body.sourcePort, 10);
    req.body.headerSize = parseInt(req.body.headerSize, 10);
    if (
      isNaN(req.body.sourcePort) ||
      req.body.sourcePort > 65535 ||
      req.body.sourcePort < 0 ||
      isNaN(req.body.headerSize) ||
      req.body.headerSize < 0
    ) {
      res.sendStatus(400);
    } else {
      req.body.isSmartSourceClient = req.body.isSmartSourceClient
        ? true
        : false;
      next();
    }
  }
};

/**
 * Request body validator for editing channel route. Checks for channelNewName,
 * channelNewDescription, channelUrl and channelPassword are sent with the
 * request and calls next(), otherwise denies the request by returning HTTP 400.
 * Does not performs any kind of authorization, needs another validator for that
 *
 * @param {Object} req - Express request object
 * @param {String} req.body.channelNewDescription - New description about the channel
 * @param {String} req.body.channelNewName - New name of the channel
 * @param {String} req.body.channelUrl - Url of the channel to be edited
 * @param {String} req.body.channelPassword - Password of the channel to be edited
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const edit = (req, res, next) => {
  if (
    typeof req.body.channelNewName !== 'string' ||
    typeof req.body.channelNewDescription !== 'string' ||
    typeof req.body.channelUrl !== 'string' ||
    typeof req.body.channelPassword !== 'string'
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};

/**
 * Request body validator for removing an existing channel route. Checks for
 * channelUrl and channelPassword are sent with the request and calls next(),
 * denies the request otherwise by returning HTTP 400. Does not performs any
 * kind of authorization, needs another validator for that.
 *
 * @param {Object} req - Express request object
 * @param {String} req.body.channelUrl - Url of the channel to be removed
 * @param {String} req.body.channelPassword - Password of the channel to be removed
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const remove = (req, res, next) => {
  if (
    typeof req.body.channelUrl !== 'string' ||
    typeof req.body.channelPassword !== 'string'
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};

/**
 * Authorization middleware - assumes channelUrl is already present in request
 * and tries to locate and authorize appropirate channel if possible, otherwise
 * denies the request and returns HTTP 401.
 *
 * @param {Object} req - Express request object
 * @param {String} req.body.channelUrl - Url of the channel
 * @param {String} req.body.channelPassword - Password of the channel
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const auth = async (req, res, next) => {
  const row = db.getChannelHash(req.body.channelUrl);
  if (row === null) {
    res.status(400).json({
      message: 'No channel found with given url.'
    });
    return;
  }

  try {
    const matched = await argon2.verify(row.password, req.body.channelPassword);
    if (matched) {
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    logger('ERROR', err.toString(), err);
    res.sendStatus(500);
  }
};

module.exports = {
  list,
  add,
  frontendAdd,
  edit,
  remove,
  auth
};
