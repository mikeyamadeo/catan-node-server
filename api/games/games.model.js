'use strict'

var model = require('../game/game.model.mongoose');
var fs = require('fs'),
    config = require('../../config');

var GamesModel = {
    /**
    * @desc retrieve games from server model
    * @method listGames
    * @param {function} callback - callback(err, games)
    */
    listGames : function(callback) {
        model.find().exec(callback);    
    },
    /**
    * @desc add a game to the database
    * @method addGame
    * @param {object} game - game object to be stored
    * @param {function} callback - callback(err, boolean)
    */
    addGame : function(game, callback) {
        
    },
    /**
    * @desc adds a player to currently existing game
    * @method addPlayer
    * @param {number} id - game id for game
    * @param {string} color - color for new player
    * @param {string} name - name of new player
    * @param {function} callback - callback
    */
    addPlayer : function(id, color, name, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                var player = {
                    cities : 4,
                    color : color,
                    discarded : false,
                    monuments : 0,
                    name : name,
                    newDevCards : {
                        monopoly : 0,
                        monument : 0,
                        roadBuilding : 0,
                        soldier : 0,
                        yearOfPlenty : 0 
                    },
                    oldDevCards : {
                        monopoly : 0,
                        monument : 0,
                        roadsBuilding : 0,
                        soldier : 0,
                        yearOfPlenty : 0
                    },
                    index : game.players.length,
                    playedDevCard : false,
                    resources : {
                        brick : 0,
                        ore : 0,
                        sheep : 0,
                        wheat : 0,
                        wood : 0
                    },
                    roads : 15,
                    settlements : 5,
                    soldiers : 0,
                    victoryPoints : 0
                }; 
                game.players.push(player);
                return callback(null, true);
            }
                return callback(null, false);   
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
                fs.writeFile(config.saves + '/' + name, 
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
        fs.readFile(config.saves + '/' + name, function(err, data) {
            if (err) return callback(err);
            callback(null, JSON.parse(data));    
        });
    },
}

module.exports = GamesModel; 
    
