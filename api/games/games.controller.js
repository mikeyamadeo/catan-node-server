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
   * @method list
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  list: function(req, res, next) {},
  /**
   * @desc request to create new game
   * @method create
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  create: function(req, res, next) {},
  /**
   * @desc request to join existing game
   * @method join
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  join: function(req, res, next) {},
  /**
   * @desc request to store current state of game
   * @method save
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  save: function(req, res, next) {},
  /**
   * @desc request to load a saved game state game state
   * @method load
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  load: function(req, res, next) {},

};

module.exports = MovesController;
