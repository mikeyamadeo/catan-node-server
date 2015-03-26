'use strict'

var _ = require('lodash');
var movesModel = require('./moves.model.js');
var gamesModel = require('./../games/games.model.js');
var gameModel = require('./../game/game.model.js');
var helpers = require('./../../common/common.helper.js');
var  async = require('async');

module.exports = {

    gameToModel : function(game) {
        game = _.omit(game._doc, '__v');
        return _.omit(game._doc, '_id');
    },

    verifyRoadsAvailable : function (gameId, playerId, callback) {

        movesModel.getOwnedRoads(gameId, playerId, function (err, roads) {
            if (err) {
                console.log(err); 
                return callback(err, true);
            }
            console.log("player has " + roads.length);
            if (roads.length >= 15) {
                return callback(null, false);
            }
            else {
                return callback(null, true);
            }
        });
    },

    /* 
    Verifies that the road loctaion is acceptable
    @param addedroad is for the use in roadBuildingCard - a road 1 that is not in the model yet
    */    
    verifyRoadLocation : function (gameId, playerIndex, buildRoad, addedRoad, callback) {

/*
        //initial round? not adj to other road!
        //adjacent to another player's road
        //no other person's settlent at the intersection
        movesModel.getGameState(gameId, function (err, state) {
            if (state.contains("Round")) {
                var verified =  verifyRoadNotConnected(gameId, playerIndex, buildRoad);
                return callback(null, verified); 
            }
            else {
                var verified = verifyRoadNotConnected(gameId, playerIndex, buildRoad, addedroad);
                return callback(null, verified); 
            }
                
        });

        return callback(null, true);   
        */

        async.series([
	        function(callback) {
	            movesModel.verifyEdge(gameId, buildRoad, function (err, result) {
	                if (err) {
	                      return callback(err); 
	                } else if (result === false) {
	                	console.log("location outside the map");
	                    return callback(new Error("location is not on the map"));
	                }
	                return callback(null);
	            });
	        }/*,
	        function(callback) {
	            gameModel.getRoads(gameId, function (err, roads) {
	                if (err) {
	                      return callback(err); 
	                } else {
        				adjEdges.forEach(function(road, index) {
			                if (helpers.isLocationEqual(road.location, buildRoad)) {
			                	console.log("location occupied");
			                    return callback(new Error("location is already occupied"));
			                }
			            });
			            if (addedRoad != null)
			                if (helpers.isLocationEqual(addedRoad, buildRoad)) {
			                	console.log("location occupied");
			                    return callback(new Error("location is already occupied"));
			                }
			        }
	                return callback(null);
	            });
	        }
	        
	        function(callback) {
	            helper.verifyRoadLocation(req.game, req.body.playerIndex, req.body.roadLocation, null, function (err, locationVerified) {
	                if (err) {
	                      return callback(err); 
	                } else if (!locationVerified) {
	                    return callback(new Error("This road location is not acceptable"));
	                }
	                return callback(null);
	            });
	        },
	        function(callback) {
	            MovesModel.buildRoad(req.game, req.body.playerIndex, req.body.roadLocation, req.body.free, function(err, game) {
	                if (err) {
	                      return callback(err); 
	                }
	                console.log("road built");
	                return callback(null, game);
	            });
	        ]
        */
    ], function(err, result) {
    	if (err)
    		return callback(null, false);
    	else
        	return callback(null, true);
    });
    },

    /* 
    Verifies that the road is not adjacent to another player's road for initial round
    */
    verifyRoadNotConnected : function (gameId, playerIndex, buildRoad) {
        
        var adjEdges = [];
        var ownedRoads = [];
        movesModel.getAdjacentEdges(gameId, buildRoad, function (err, edges) {
            if (err) {
                console.log(err.stack);
            }
            else {
                adjEdges = edges;
            }
        });

        movesModel.getOwnedRoads(gameId, playerIndex, function (err, roads) {
            if (err)
                console.log(err.stack);
            else {
                ownedRoads = roads;
            }
        });

        for (var road in ownedRoads) {
            for (var edge in adjEdges) {
                if (helpers.isLocationEqual(road, edge)) {
                    return false;
                }
            }
        }

        return true;        
    },

    /* 
    Verifies that the road is adjacent to another player's road 
    and there is no other person's settlent at the intersection
    @param addedroad is for the use in roadBuildingCard - a road 1 that is not in the model yet
    */
    verifyRoadConnected : function (gameId, playerIndex, buildRoad, addedRoad) {

        var adjEdges = [];
        var ownedRoads = [];
        var settlements = [];
        var cities = [];

        movesModel.getAdjacentEdges(gameId, buildRoad, function (err, edges) {
            if (err) {
                console.log(err.stack);
            }
            else {
                adjEdges = edges;
            }
        });

        gameModel.getSettlements(gameId, function (err, sett) {
            if (err) {
                console.log(err.stack);
            }
            else {
                settlements = sett;
            } 
        });

        gameModel.getCities(gameId, function (err, cit) {
            if (err) {
                console.log(err.stack);
            }
            else {
                cities = cit;
            } 
        });

        movesModel.getOwnedRoads(gameId, playerIndex, function (err, roads) {
            if (err)
                console.log(err.stack);
            else {
                ownedRoads = roads;
            }
        });

        for (var road in ownedRoads) {
            if (helpers.containsEdge(road, adjEdges)) {
                //code for settlement & city check will go here
                return true;
            }
        }

        if (helpers.containsEdge(addedRoad, adjEdges)) {
                //code for settlement & city check will go here
                return true;
        }

        return false;
    },
    countResources : function(resources) {
        var total = 0;
        _.forOwn(resources, function(value, key) {
            if (!isNaN(value)) {
                total += value;
            }
        });        
        return total;
    }

};
