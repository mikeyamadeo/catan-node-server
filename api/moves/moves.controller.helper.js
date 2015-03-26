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

        async.series([
	        function(callback) {
	            movesModel.verifyEdge(gameId, buildRoad, function (err, result) {
	                if (err) {
	                    return callback(err); 
	                } else if (result === false) {
	                	console.log("location outside the map");
	                    return callback(new Error("location is not on the map"));
	                }
	               	console.log("location in the map");
	                return callback(null);
	            });
	        },
	        function(callback) {
	            gameModel.getRoads(gameId, function (err, roads) {
	                if (err) {
	                      return callback(err); 
	                } else {
        				var matchedRoads = roads.filter(function(road) {
			                return (helpers.isLocationEqual(road.location, buildRoad));
			            });
			            if (matchedRoads.length > 0)
			            	return callback(new Error("location is already occupied"));
			            if (addedRoad != null)
			                if (helpers.isLocationEqual(addedRoad, buildRoad)) {
			                	console.log("location occupied");
			                    return callback(new Error("location is already occupied"));
			                }
			        }
	                return callback(null);
	            });
	        },
	        function(callback) {
	            movesModel.getAdjacentEdges(gameId, buildRoad, function (err, edges) {
		            if (err) {
		                console.log(err.stack);
		            }			            
			        return movesModel.getOwnedRoads(gameId, playerIndex, function (err, roads) {
			        	console.log(edges);
			        	console.log(roads);
			        	var matchingRoads = roads.filter(function (road) {
			        		return (helpers.containsEdge(road.location, edges) && road.owner === playerIndex);
			        	});
			        	return movesModel.getGameState( gameId, function (err, state) {
			        		console.log(state);
				            if (state.indexOf("Round") > -1) {
				            	console.log("init round, num of connecting roads is " + matchingRoads.length);
				            	if (matchingRoads.length > 0)
				                	return callback(new Error("During initial round the road cannot be connected to another road")); 
				                else 
				                	return callback(null);
				            }
				            else {
				            	console.log("not init round, num of connecting roads is " + matchingRoads.length);
				              	if (matchingRoads.length === 0)
				                	return callback(new Error("During initial round the road cannot be connected to another road"));
				                else 
				                	return callback(null);
				                //logic for ident settlements && cities
				            }
				        });
			        });
			    });
	        }
	    ], function(err, result) {
	    	if (err)
	    		return callback(null, false);
	    	else
	        	return callback(null, true);
	    });
	}

};
