'use strict';

var _ = require('lodash'),
    gameModel = require('../game/game.model'),
    gamesModel = require('./games.model'),
    helper = require('./games.controller.helper');
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
  list: function(req, res, next) {
    /**
     * Authentication:
     * - Requires User Cookie ?
     *
     * Request type: GET
     *
     * POST CONDITIONS:
     * Returns a list of Games where a game has a title, an id, and an array of players
     * and a player has a name, a color, and an id
     */
    gamesModel.listGames(function(err, games) {
        if (err) {
            console.log(err);
            next();
        }
        if (games) {
            return res.json(games);
        } else {
            res.json([]);
        }
    });
  },
  /**
   * @desc request to create new game
   * @method create
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  create: function(req, res, next) {
    console.log("Create");
    /**
     * Authentication:
     * - Requires User Cookie
     *
     * Request type: POST
     * Schema:
     * {
     *     "randomTiles": "boolean",
     *     "randomNumbers": "boolean",
     *     "randomPorts": "boolean",
     *     "name": "string" -- game title
     * }
     *
     * POST CONDITIONS:
     * Creates a new game on server
     */
    var body = req.body,
        tiles = body.randomTiles,
        chits = body.randomNumbers,
        ports = body.randomPorts,
        name = body.name;
    var newGame = helper.createNewGame(tiles, chits, ports, name);
    gamesModel.addGame(newGame, function(err, saved) {
        if (err) { console.log(err); }
        res.json(saved);
    });
  },
  /**
   * @desc request to join existing game
   * @method join
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
    /**
     * Authentication:
     * - Requires User Cookie
     * - sets Game cookie
     *
     * Request type: POST
     * Schema:
     * {
     *    "id": "integer", -- game id
     *    "color": "string"
     * }
     *
     *
     * POST CONDITIONS:
     * Adds user to game
     */ 
  join: function(req, res, next) {
    var user = req.user;
    var body = req.body;
    gamesModel.isPlayerInGame(body.id, user.name, function(err, inGame) {
        if (err) return res.status(404).send("Join failed");
        if (inGame) {
            res.cookie('catan.game', body.id);
            return res.send("Success");
        } else {
            gamesModel.isGameAvailable(body.id, function(err, available) {
                if (err) return res.status(404).send("Join failed");
                if (available) {
                    var newPlayer = helper.createNewPlayer(user.name, body.color);
                    gamesModel.addPlayer(body.id, newPlayer, function(err, game) {
                        if (err || !game) {
                            return res.status(404).send("Join failed");
                        }
                        res.cookie('catan.game', game._id);
                        return res.send("Success");
                    });
                } else {
                    return res.status(404).send("Join failed");
                }
            });
        }
    });
  },
  /**
   * @desc request to store current state of game
   * @method save
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  save: function(req, res, next) {
    /**
         * Authentication:
         * - Requires User Cookie
         *
         * Request type: POST
         * Schema:
         * {
         *    "id": "integer", -- game id
         *    "name": "string" -- file name
         *  }
         *
         * PRE CONDITIONS: 
         * Verify that username is available
         * Verify that password is legit
         *
         * POST CONDITIONS:
         * saves state of game in file
         * attaches the file to a bug report
         *
         * can use this file to load state of game using load function
         */
  },
  /**
   * @desc request to load a saved game state game state
   * @method load
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  load: function(req, res, next) {
    /**
         * Authentication:
         * - Requires User Cookie
         *
         * Request type: POST
         * Schema:
         * {
         *    "name": "string" -- file name
         *  }
         *
         * PRE CONDITIONS: 
         * Verify that username is available
         * Verify that password is legit
         *
         * POST CONDITIONS:
         * Loads 
         */
  },

};

module.exports = GamesController;
