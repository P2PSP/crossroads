/**
 * Frontend Controller module - Contains various methods for acting as controller
 * layer frontend client and backend server. Uses channelController method most
 * times while capturing the output and piping it back to rendering engine.
 *
 * Exports methods
 * - renderAllChannels
 * - renderAChannel
 * - renderAddChannelForm
 * - addChannel
 * - renderEditChannelForm
 * - editChannel
 * - renderRemoveChannelForm
 * - removeChannel
 *
 * @module controllers/validators/frontendController
 */

'use strict';

const ctrl = require('./channelController');

class CaptureResponse {
  constructor() {
    this.status = 500;
    this.jsonPayload = undefined;
  }
  getStatus() {
    return this.status;
  }
  getJson() {
    return this.jsonPayload;
  }
  json(payload) {
    this.jsonPayload = payload;
    this.status = 200;
  }
  sendStatus(s) {
    this.status = s;
  }
  end() {
    this.status = 200;
  }
}

/**
 * Main controller method for rendering all channels currently present in
 * database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const renderAllChannels = (req, res) => {
  const cres = new CaptureResponse();
  ctrl.listAllChannels(req, cres);
  const channels = {
    status: cres.getStatus(),
    data: cres.getJson()
  };
  res.render('pages/list_all_channels', channels);
};

/**
 * Controller method for getting information about a single channel with given
 * channel url.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const renderAChannel = (req, res) => {
  const cres = new CaptureResponse();
  ctrl.getChannel(req, cres);
  const channel = {
    status: cres.getStatus(),
    data: cres.getJson(),
    channelUrl: req.params.channelUrl
  };
  res.render('pages/get_channel', channel);
};

/**
 * Controller method for rendering form for adding a new channel.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const renderAddChannelForm = (req, res) => {
  const options = {
    containsResponse: false
  };
  res.render('pages/add_channel', options);
};

/**
 * Controller method for adding a new channel with given channel name.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addChannel = async (req, res) => {
  const cres = new CaptureResponse();
  await ctrl.addChannel(req, cres);
  const channel = {
    status: cres.getStatus(),
    data: cres.getJson(),
    containsResponse: true
  };
  res.render('pages/add_channel', channel);
};

/**
 * Controller method for rendering form for editing an exisitng channel.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const renderEditChannelForm = (req, res) => {
  const options = { containsResponse: false, channelUrl: req.query.channelUrl };
  res.render('pages/edit_channel', options);
};

/**
 * Controller method for editing a single channel with given channel url and its
 * corresponding password.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const editChannel = (req, res) => {
  const cres = new CaptureResponse();
  ctrl.editChannel(req, cres);
  const data = {
    status: cres.getStatus(),
    containsResponse: true,
    channelUrl: ''
  };
  res.render('pages/edit_channel', data);
};

/**
 * Controller method for rendering remove channel form.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const renderRemoveChannelForm = (req, res) => {
  const options = { containsResponse: false, channelUrl: req.query.channelUrl };
  res.render('pages/remove_channel', options);
};

/**
 * Controller method for removing a single channel with given channel url and
 * its corresponding password.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeChannel = (req, res) => {
  const cres = new CaptureResponse();
  ctrl.removeChannel(req, cres);
  const data = {
    status: cres.getStatus(),
    containsResponse: true,
    channelUrl: ''
  };
  res.render('pages/remove_channel', data);
};

module.exports = {
  renderAllChannels,
  renderAChannel,
  renderAddChannelForm,
  addChannel,
  renderEditChannelForm,
  editChannel,
  renderRemoveChannelForm,
  removeChannel
};
