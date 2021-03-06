'use strict'

var model = require('../game/game.model.mongoose');
var command = require('../game/game.command.mongoose');
var fs = require('fs'),
    config = require('../../config');

var GamesModel = {
    /**
    * @desc retrieve games from server model
    * @method listGames
    * @param {function} callback - callback(err, games)
    */
    listGames : function(callback) {
        model.find(function(err,games) {
            if (err) return callback(err);
            if (games) {
                return callback(null, games);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc add a game to the database
    * @method addGame
    * @param {object} game - game object to be stored
    * @param {function} callback - callback(err, saved)
    */
    addGame : function(game, callback) {
        model.create(game, function(err, saved) {
            if (err) return callback(err);
            callback(null, saved);
        });    
    },
    /**
    * @desc adds a player to currently existing game
    * @method addPlayer
    * @param {number} id - game id for game
    * @param {object} player - player object 
    * @param {function} callback - callback(err, game)
    */
    addPlayer : function(id, player, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                player.playerIndex = game.game.players.length;
                game.addPlayer(player);
                return game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc modifies the player's color
    * @method updateColor
    * @param {number} id - specifies game
    * @param {number} index - specifies player
    * @param {function} callback - callback(err, game)
    */
    updateColor : function(id, name, color, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.updateColor(name, color);
                return game.save(callback);
                return callback(null, game);
            } else {
                return callback(null, null);
            }
        });
    },
    /**
    * @desc determines if the given player is in the specified game
    * @method isPlayerInGame
    * @param {number} id - specifies game
    * @param {string} username - specifies user
    * @param {function} callback -callback(err, valid)
    */
    isPlayerInGame : function(id, username, callback) {
        console.log(arguments);
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                return callback(null, game.isPlayerInGame(username));
            } else {
                return callback(null, false);
            }
        });
    },
    /**
    * @desc saves the state of the current game
    * @method saveGame
    * @param {number} id - game id for saved game
    * @param {string} name - file location to save game
    * @param {array} commands - list of commands to be saved
    * @param {function} callback - callback(err, boolean)
    */
    saveGame : function(id, name, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                fs.writeFile(config.saves + 'saves/' + name, 
                             JSON.stringify(game), function(err) {
                    if (err) return callback(err);
                    return callback(null, true);
                });        
            } else {
                return callback(null, false);
            }
        });
    },
    /**
    * @desc loads the state of specified game
    * @method loadGame
    * @param {string} name - file location to load game
    * @param {function} callback - callback(err, game)
    */
    loadGame : function(name, callback) {
        fs.readFile(config.saves + 'saves/' + name, function(err, data) {
            if (err) return callback(err);
            callback(null, JSON.parse(data));    
        });
    },
    /**
    * @desc determines if game has an open player position
    * @method isGameAvailable
    * @param {number} id - specifies game
    * @param {function} callback - callback(err, open)
    */
    isGameAvailable : function(id, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                return callback(null, game.isGameAvailable());
            }
            return callback(null, false);
        });   
    },

    initializeGameCommands: function(initGame, callback) {

        command.create(initGame); 
    },
}

module.exports = GamesModel; 
    
