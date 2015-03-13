'use strict';

var _ = require('lodash');

/**
 * Example of getting access to required models:
 *
 * var Model = require('../model');
 * var MovesModel = require('./moves.model');
 */


var GamesController = {
  /** CREATE **/

  /**
   * @desc get request to list all current games
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  list: function(req, res, next) {},
  /**
   * @desc request to create new game
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  create: function(req, res, next) {},
  /**
   * @desc request to join existing game
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  join: function(req, res, next) {},
  /**
   * @desc request to store current state of game
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  save: function(req, res, next) {},
  /**
   * @desc request to load a saved game state game state
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  load: function(req, res, next) {},

};

module.exports = MovesController;
