'use strict'

var GameModel = {
    /**
    * @desc retrieves game model of specified game
    * @method getModel
    * @param {number} id - id of game to retrieve
    * @param {function} callback - callback
    */
    getModel : function(id, callback) {},
    /**
    * @desc retrieves executed commands for specified game
    * @method getCommands
    * @param {number} id - id of game to retrieve commands
    * @param {function} callback - callback
    */
    getCommands : function(id, callback) {},
    /**
    * @desc reset specified game to initial state
    * @method resetGame
    * @param {number} id - game id to reset game
    * @param {function} callback - callback
    */
    resetGame : function(id, callback) {},
    /**
    * @desc adds commands to a game's command list
    * @method addCommands
    * @param {number} id - specifies game
    * @param {array} commands - list of commands to add
    * @param {function} callback - callback
    */
    addCommands : function(id, commands, callback) {}
};

module.exports = GameModel;
