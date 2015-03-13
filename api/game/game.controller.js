'use strict';

var _ = require('lodash');

/**
 * Example of getting access to required models:
 *
 * var Model = require('../model');
 * var MovesModel = require('./moves.model');
 */


var GameController = {
  /** CREATE **/

  /**
   * @desc get request that gets game's current state
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  model: function(req, res, next) {},
  /**
   * @desc get request to get commands in command log
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  getCommands: function(req, res, next) {},
    /**
   * @desc get request to get all AI types
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  listAI: function(req, res, next) {},
    /**
   * @desc request to reset game state to initial state
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  reset: function(req, res, next) {},
    /**
   * @desc request for adding new commands to command log
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  postCommands: function(req, res, next) {},
    /**
   * @desc request to add an AI player
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  addAI: function(req, res, next) {},
};

module.exports = MovesController;
