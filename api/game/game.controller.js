'use strict';

var _ = require('lodash'),
    GameModel = require('./game.model');

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
   * @method model
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */

  model: function(req, res, next) {
    var gameId = req.game;
    GameModel.getModel(gameId, function(err, model) {
      if (err) {
        return res.status(400).send(err.message);
      }
      console.log(model.game);
      return res.status(200).json(model.game);
    });
  },
  /**
   * @desc get request to get commands in command log
   * @method getCommands
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  getCommands: function(req, res, next) {},
    /**
   * @desc get request to get all AI types
   * @method listAI
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  listAI: function(req, res, next) {
    res.json([]);
  },
    /**
   * @desc request to reset game state to initial state
   * @method reset
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  reset: function(req, res, next) {},
    /**
   * @desc request for adding new commands to command log
   * @method postCommands
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  postCommands: function(req, res, next) {},
    /**
   * @desc request to add an AI player
   * @method addAI
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  addAI: function(req, res, next) {},
};

module.exports = GameController;
