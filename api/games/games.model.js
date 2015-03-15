'use strict'

var model = require('../game/game.model.mongoose');

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
    addPlayer : function(id, color, name, callback) {},
    /**
    * @desc saves the state of the current game
    * @method saveGame
    * @param {number} id - game id for saved game
    * @param {string} name - file location to save game
    * @param {array} commands - list of commands to be saved
    * @param {function} callback - callback
    */
    saveGame : function(id, name, commands, callback) {},
    /**
    * @desc loads the state of specified game
    * @method loadGame
    * @param {string} name - file location to load game
    * @param {function} callback - callback
    */
    loadGame : function(name, callback) {},
}

module.exports = GamesModel; 
    
