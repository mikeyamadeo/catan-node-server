'use strict';

var _ = require('lodash'),
    GameModel = require('./game.model'),
    moveCtrl = require('../moves/moves.controller');

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
      return res.status(200).json(model);
    });
  },
  /**
   * @desc get request to get commands in command log
   * @method getCommands
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  getCommands: function(req, res, next) {
    var gameId = req.game;
    var body = req.body;

    command.findOne({id:gameId}, function(err, state) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        if (state) {
          var commands = state.getCommands(); 
          return res.status(200).send(commands);           }
    });
  },
    /**
   * @desc get request to get all AI types
   * @method listAI
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  listAI: function(req, res, next) {
      return res.status(200).json(['LARGEST_ARMY']);
  },
    /**
   * @desc request to reset game state to initial state
   * @method reset
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  reset: function(req, res, next) {
    var gameId = req.game;
    var body = req.body;

    command.findOne({id:gameId}, function(err, state) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        if (state) {
          GameModel.getModel(gameId, function(err, game) {
            if (err) {
              return res.status(400).send(err.message);
            }
            if(game) {
              game.game = state.getInitialState();
              state.reset();
              return res.status(200).json(game);
            }
          });
        }
    });
  },
    /**
   * @desc request for adding new commands to command log
   * @method postCommands
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  postCommands: function(req, res, next) {
    var gameId = req.game;
    var body = req.body;

    command.findOne({id:gameId}, function(err, state) {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        if (state) {
          // add command and run using controller
          for (var i in body) {
            state.addCommand(body[i]);
            var req = {
              command: true,
              body: body[i]
            };
            moveCtrl[body[i].type](req);
          }

          GameModel.getModel(gameId, function(err, model) {
            if (err) {
              return res.status(400).send(err.message);
            }
            return res.status(200).json(model);
          });
        }
    });
  },
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
