'use strict'

var model = require('../game/game.model.mongoose');

var MovesModel = {
    /**
    * @desc adds chat to a game
    * @method addChat
    * @param {number} id - specifies game
    * @param {number} player - index of sender
    * @param {string} message - chat message to add
    * @param {function} callback - callback(err, game)
    */
    addChat : function(id, player, message, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.addChat(message, player);
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc modifies a games latest rolled number
    * @method rollNumber
    * @param {number} id - specifies the game
    * @param {string} status - new status of game
    * @param {function} callback - callback
    */
    rollNumber : function(id, status, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.updateStatus(status);
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs rob operation on specified game
    * @method robPlayer
    * @param {number} id - specifies game
    * @param {object} hex - new hex location of robber
    * @param {number} player - index of player
    * @param {number} victim - index of robbed victim
    * @param {string} resource - robbed resource
    * @param {function} callback - callback
    */
    robPlayer : function(id, hex, player, victim, resource, status, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                if (victim != -1) {
                    game.giveResource(player, resource, 1);
                    game.takeResource(victim, resource, 1);
                }
                game.updateRobber(hex); 
                game.updateStatus(status);
                game.incVersion();
                return game.save(callback);
            } else {
                return callback(null, null);
            }
        });
    },
    /**
    * @desc performs a finish turn operation on specified game
    * @method finishTurn
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {function} callback - callback
    */
    finishTurn : function(id, player, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.mergeDevCards(player);
                game.updateTurn(player);
                game.incVersion();
                return game.save(callback);
            } else {
                return callback(null, null);
            }
        }); 
    },
    /**
    * @desc performs a dev card purchase operation
    * @method buyDevCard
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {function} callback - callback
    */
    buyDevCard : function(id, player, callback) {},
    /**
    * @desc performs year of plenty operation
    * @method yearOfPlenty
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {string} first - first resource requested
    * @param {string} second - second resource requested
    * @param {function} callback - callback
    */
    yearOfPlenty : function(id, player, first, second, callback) {},
    /**
    * @desc performs a road building card operation
    * @method roadBuilding
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} first - edge location of first road to be built
    * @param {obejct} second - edge location of second road to be built
    * @param {function} callback - callback
    */
    roadBuilding : function(id, player, first, second, callback) {},
    /**
    * @desc performs a soldier operation
    * @method soldier
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {number} victim - index of victim
    * @param {object} hex - new hex location of robber
    * @param {function} callback - callback
    */
    soldier : function(id, player, victim, hex, callback) {},
    /**
    * @desc performs a monopoly operation
    * @method monopoly
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {string} resource - resource to monopolize
    * @param {function} callback - callback
    */
    monopoly : function(id, player, resource, callback) {},
    /**
    * @desc performs monument operation
    * @method monument
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {function} callback - callback
    */
    monument : function(id, player, callback) {},
    /**
    * @desc performs a build road operation
    * @method buildRoad
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} edge - edge location of road to be built
    * @param {boolean} free - whether or not the road should be free
    * @param {function} callback - callback
    */
    buildRoad : function(id, player, edge, free, callback) {},
    /**
    * @desc performs a build settlement operation
    * @method buildSettlement
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} vertex - vertex location of settlement to be built
    * @param {boolean} free - whethere of not the settlement should be free
    * @param {function} callback - callback
    */
    buildSettlement : function(id, player, vertex, free, callback) {},
    /**
    * @desc performs a build city operation
    * @method buildCity
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} vertex - vertex location of city to be built
    * @param {function} callback - callback
    */
    buildCity : function(id, player, vertex, callback) {},
    /**
    * @desc performs a offer trade operation
    * @method offerTrade
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} offer - resources to be offered in a trade
    * @param {number} receiver - index of receiver
    * @param {function} callback - callback
    */
    offerTrade : function(id, player, offer, receiver, callback) {},
    /**
    * @desc performs an accept trade operation
    * @method acceptTrade
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {boolean} acceptance - whether or not the trade was accepted
    * @param {function} callback - callback
    */
    acceptTrade : function(id, player, acceptance, callback) {},
    /**
    * @desc performs a maritime trade operation
    * @method maritimeTrade
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {number} ratio - trade ratio
    * @param {string} input - input resource
    * @param {string} output - output resource
    * @param {function} callback - callback
    */
    maritimeTrade : function(id, player, ratio, input, output, callback) {},
    /**
    * @desc performs a discard cards operation
    * @method discardCards
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} discarded - cards to discard
    * @param {function} callback - callback
    */
    discardCards : function(id, player, discarded, callback) {}
};

module.exports = MovesModel;  
