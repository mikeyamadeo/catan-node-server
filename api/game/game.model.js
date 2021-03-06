'use strict'

var model = require('./game.model.mongoose');
var command = require('./game.command.mongoose');

var GameModel = {
    /**
    * @desc retrieves game by id
    * @method getGame
    * @param {number} id - specifies game
    * @param {function} callback - callback(err, game)
    */
    getGame : function(id, callback) {
        model.findById(id, function(err, obj) {
            if (err) return callback(err);
            return callback(null, obj.game);
        });
    },
    /**
    * @desc retrieves game model of specified game
    * @method getModel
    * @param {number} id - id of game to retrieve
    * @param {function} callback - callback
    */
    getModel : function(id, callback) {
        model.findById(id, function(err, obj) {
            if (err) return callback(err);
            return callback(null, obj);
        }); 
    },
    /**
    * @desc retrieves executed commands for specified game
    * @method getCommands
    * @param {number} id - id of game to retrieve commands
    * @param {function} callback - callback
    */
    getCommands : function(id, callback) {
        
    },
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
    addCommands : function(id, commands, callback) {},
    /**
    * @desc retrieves roads for a particular game
    * @method getRoads
    * @param {number} id - specifies game
    * @param {function} callback - callback(err, roads)
    */
    getRoads : function(id, callback) {
        model.findById(id, function(err, obj) {
            if (err) return callback(err);
            if (obj) {
                return callback(null, obj.game.map.roads);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc retrieves settlement for a particular game
    * @method getSettlements
    * @param {number} id - specifies game
    * @param {function} callback - callback(err, settlements)
    */
    getSettlements : function(id, callback) {
        model.findById(id, function(err, obj) {
            if (err) return callback(err);
            if (obj) {
                return callback(null, obj.game.map.settlements);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc retrieves city for a particular game
    * @method getCities
    * @param {number} id - specifies game
    * @param {function} callback - callback(err, cities)
    */
    getCities : function(id, callback) {
        model.findById(id, function(err, obj) {
            if (err) return callback(err);
            if (obj) {
                return callback(null, obj.game.map.cities);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc retrieves the deck
    * @method getDeck
    * @param {number} id - specifies game
    * @param {function} callback - callback(err, deck)
    */
    getDeck : function(id, callback) {
        model.findById(id, function(err, obj) {
            if (err) return callback(err);
            if (obj) {
                return callback(null, obj.getDeck());
            }
            return callback(null, null);
        });
    },
    /**
    * @desc Resets the game to version 0. This is hard reset that 
    * will delete all version of the game greater than 0. Thus, 
    * resetting a reset will not be possible. 
    * @method reset
    * @param {number} id - specifies the game by id
    * @param {function} callback - callback(err, game)
    */
    reset : function(id) {},
    /**
    * @desc Reverts the game to the previous version. This performs
    * a hard reset deleting the current version of the game, effectively
    * undoing the most recent game action. All subsequent requests for 
    * the model by all other clients will receive the previous version
    * of the model
    * @method undo
    * @param {number} id - specifies the game by id
    * @param {function} callback - callback(err, game)
    */
    undo : function(id) {}
};

module.exports = GameModel;
