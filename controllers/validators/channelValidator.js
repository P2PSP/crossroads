/**
 * ChannelValidator module - Contains various middlewares for validating
 * presence of appropriate data in req object and/or authorization process for
 * modifying exisiting data. Should be called before actual controller methods.
 *
 * Exports methods
 *  - add
 *  - edit
 *  - remove
 *  - auth
 *
 * @module controllers/validators/channelValidator
 */

const argon2 = require('argon2');
const db = require('../../models/channelModel');
const logger = require('kaho');

/**
 * Validator for listing all existing channels. Sanitizes limit and offset query
 * and proceeds to next()
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const list = (req, res, next) => {
  req.query.limit = parseInt(req.query.limit) || undefined;
  req.query.offset = parseInt(req.query.offset) || undefined;
  next();
};

/**
 * Request body validator for adding a new channel route. Checks for channelName
 * is sent with the request, denies the request otherwise by returning HTTP 400.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const add = (req, res, next) => {
  if (
    !req.body.channelName ||
    !req.body.channelDescription ||
    !req.body.sourceAddress ||
    !req.body.sourcePort ||
    !req.body.headerSize ||
    typeof req.body.channelDescription !== 'string' ||
    typeof req.body.channelName !== 'string' ||
    typeof req.body.sourceAddress !== 'string' ||
    typeof req.body.sourcePort !== 'number' ||
    typeof req.body.headerSize !== 'number'
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};

/**
 * Request body validator for editing channel route. Checks for channelNewName,
 * channelUrl and channelPassword are sent with the request, denies the request
 * otherwise by returning HTTP 400.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const edit = (req, res, next) => {
  if (
    !req.body.channelNewName ||
    !req.body.channelNewDescription ||
    !req.body.channelUrl ||
    !req.body.channelPassword ||
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
 * channelUrl and channelPassword are sent with the request, denies the request
 * otherwise by returning HTTP 400. Does not performs any kind of authorization.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {undefined}
 */
const remove = (req, res, next) => {
  if (
    !req.body.channelUrl ||
    !req.body.channelPassword ||
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
  edit,
  remove,
  auth
};
