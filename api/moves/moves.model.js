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
        console.log("Are we here");
        model.findById(id, function(err, game) {
            if (err) {
                console.log(err);
                return callback(err);
            }
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
    * @param {object} resources - resources to add for each player 
    * (e.g. [{ player : 0, 
               resourceMap : { brick : 0, ore : 1, sheep : 2, wheat : 5, wood : 0 }}, 
    *   etc...])
    * @param {function} callback - callback
    */
    rollNumber : function(id, status, resources, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                resources.map(function(tuple, index, array) {
                    var resourceMap = tuple.resourceMap;
                    _.forOwn(resourceMap, function(value, key) {
                        game.modifyResource(tuple.player, key, value, true);
                    });
                });
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
                    game.modifyResource(player, resource, 1, false);
                    game.modifyResource(victim, resource, -1, false);
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
                game.setPlayedDevCard([0, 1, 2, 3], false);
                game.setDiscarded([0, 1, 2, 3], false);
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
    * @param {string} devCard - type of dev card to add
    * @param {function} callback - callback
    */
    buyDevCard : function(id, player, devCard, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.modifyResource(player, 'sheep', -1, true);
                game.modifyResource(player, 'ore', -1, true);
                game.modifyResource(player , 'wheat', -1, true);
                if (devCard === 'monument') {
                    game.modifyDevCard(player, devCard, 1);
                } else {
                    game.modifyNewDevCard(player, devCard, 1);
                }
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });     
    },
    /**
    * @desc performs year of plenty operation
    * @method yearOfPlenty
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {string} first - first resource requested
    * @param {string} second - second resource requested
    * @param {function} callback - callback
    */
    yearOfPlenty : function(id, player, first, second, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.modifyResource(player, first, 1, true);
                game.modifyResource(player, second, 1, true);
                game.incVersion();
                game.setPlayedDevCard([player], true);
                game.modifyOldDevCard(player, 'yearOfPlenty', -1);
                return game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs a road building card operation
    * @method roadBuilding
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} first - edge location of first road to be built
    * @param {obejct} second - edge location of second road to be built
    * @param {function} callback - callback
    */
    roadBuilding : function(id, player, first, second, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.addStructure(player, first, 'road');
                game.addStructure(player, second, 'road');
                game.incVersion();
                game.setPlayedDevCard([player], true);
                game.modifyOldDevCard(player, 'roadBuilding', -1);
                return game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs a soldier operation
    * @method soldier
    * @param {number} id - specifies game
    * @param {object} hex - new hex location of robber
    * @param {number} player - index of player
    * @param {number} victim - index of victim
    * @param {function} callback - callback
    */
    soldier : function(id, hex, player, victim, resource, status, callback) {
        var self = this;
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                 self.robPlayer(id, player, victim, hex, resource, status, 
                                function(err, game) {
                                    game.addSoldier(player, 1);
                                    game.modifyOldDevCard(player, 'soldier', -1); 
                                    return game.save(callback);
                                });
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs a monopoly operation
    * @method monopoly
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} resources - resources to add for each player 
    * (e.g. [{ player : 0, 
               resourceMap : { brick : -1, ore : 1, sheep : 2, wheat : 5, wood : 0 }}, 
    *   etc...])
    * @param {function} callback - callback
    */
    monopoly : function(id, player, resources, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                resources.map(function(tuple, index, array) {
                    var resourceMap = tuple.resourceMap;
                    _.forOwn(resourceMap, function(value, key) {
                        game.modifyResource(tuple.player, key, value, false);
                    });
                });
                game.setPlayedDevCard(player, true);
                game.modifyOldDevCard(player, 'monopoly', -1);
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });     
    },
    /**
    * @desc performs monument operation
    * @method monument
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {function} callback - callback
    */
    monument : function(id, player, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.modifyOldDevCard(player, 'monument', -1);
                game.incVersion();
                game.modifyVictoryPoint(player, 1);
                return game.save(callback);
            }
            return callback(null, null);
        }); 
    },
    /**
    * @desc performs a build road operation
    * @method buildRoad
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} edge - edge location of road to be built
    * @param {boolean} free - whether or not the road should be free
    * @param {function} callback - callback
    */
    buildRoad : function(id, player, edge, free, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.addStructure(player, edge, 'road');
                if (!free) {
                    game.modifyResource(player, 'wood', -1, true);
                    game.modifyResource(player, 'brick', -1, true);
                }
                game.incVersion();
                game.save(callback);
            }
            return callback(null, null);
        });               
    },
    /**
    * @desc performs a build settlement operation
    * @method buildSettlement
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} vertex - vertex location of settlement to be built
    * @param {boolean} free - whethere of not the settlement should be free
    * @param {function} callback - callback
    */
    buildSettlement : function(id, player, vertex, free, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err, game);
            if (game) {
                game.addStructure(player, vertex, 'settlement');
                if (!free) {
                    game.modifyResource(player, 'brick', -1, true);
                    game.modifyResource(player, 'sheep', -1, true);
                    game.modifyResource(player, 'wood', -1, true);
                    game.modifyResource(player, 'wheat', -1, true);
                }
                game.incVersion();
                game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs a build city operation
    * @method buildCity
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} vertex - vertex location of city to be built
    * @param {function} callback - callback
    */
    buildCity : function(id, player, vertex, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err, game);
            if (game) {
                game.addStructue(player, vertex, 'city');
                game.removeStructure(player, vertex, 'settlement');
                game.modifyResource(player, 'ore', -3, true);
                game.modifyResource(player, 'wheat', -2, true);
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs a offer trade operation
    * @method offerTrade
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} offer - resources to be offered in a trade
    * @param {number} receiver - index of receiver
    * @param {function} callback - callback
    */
    offerTrade : function(id, player, offer, receiver, callback) {        
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.addTradeOffer(player, receiver, offer);
                game.incVersion();
                game.save(callback);
            }
            return callback(null, null);
        });
    },
    /**
    * @desc performs an accept trade operation
    * @method acceptTrade
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {boolean} acceptance - whether or not the trade was accepted
    * @param {object} resources - resources to add for each player 
    * (e.g. [{ player : 0, 
               resourceMap : { brick : -1, ore : 1, sheep : 2, wheat : 5, wood : 0 }}, 
    *   etc...])
    * @param {function} callback - callback
    */
    acceptTrade : function(id, player, acceptance, resources, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.removeTradeOffer()            
                if (acceptance) {
                    resources.map(function(tuple, index, array) {
                        var resourceMap = tuple.resourceMap;
                        _.forOwn(resourceMap, function(value, key) {
                            game.modifyResource(tuple.player, key, value, false);
                        });
                    });
                }
                game.incVersion();
                return game.save(callback);
            }
            callback(null, null);
        });
    },
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
    maritimeTrade : function(id, player, ratio, input, output, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                game.modifyResource(player, input, -ratio, true);
                game.modifyResource(player, output, 1, true);
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });
                
    },
    /**
    * @desc performs a discard cards operation
    * @method discardCards
    * @param {number} id - specifies game
    * @param {number} player - index of player
    * @param {object} resources - resources to add for each player 
    * (e.g. { brick : -1, ore : -1, sheep : -2, wheat : -5, wood : 0 })
    * @param {function} callback - callback
    */
    discardCards : function(id, player, discarded, callback) {
        model.findById(id, function(err, game) {
            if (err) return callback(err);
            if (game) {
                _.forOwn(discarded, function(value, key) {
                    game.modifyResource(player, key, value, true);
                });
                game.setDiscarded(player, true);
                game.incVersion();
                return game.save(callback);
            }
            return callback(null, null);
        });
    }
};

module.exports = MovesModel;  
