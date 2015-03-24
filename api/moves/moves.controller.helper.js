'use strict'

var _ = require('lodash');
var movesModel = require('./moves.model.js');
var gamesModel = require('./../games/games.model.js');
var gameModel = require('./../game/game.model.js');
var helpers = require('./../../common/common.helper.js');

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
        
        // on the map, not water
        movesModel.verifyEdge(gameId, buildRoad.location, function (err, result) {
            if (err || !result)
                return callback(err, false);
        });

        //no road on that place
        gameModel.getRoads(gameId, function (err, roads) {
            if (err)
                return callback(err, null);
            for (var road in roads) {
                if (helpers.isLocationEqual(road.location, buildRoad.location))
                    return callback(null, false);
            }
            if (addedroad)
                if (helpers.isLocationEqual(addedRoad.location, buildRoad.location))
                    return callback(null, false);
        });

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
    },

    /* 
    Verifies that the road is not adjacent to another player's road for initial round
    */
    verifyRoadNotConnected : function (gameId, playerIndex, buildRoad) {
        
        var adjEdges = [];
        var ownedRoads = [];
        movesModel.getAdjacentEdges(gameId, buildRoad.location, function (err, edges) {
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
                if (helpers.isLocationEqual(road.location, edge)) {
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

        movesModel.getAdjacentEdges(gameId, buildRoad.location, function (err, edges) {
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
            if (helpers.isRoadOnEdges(road, adjEdges)) {
                //code for settlement & city check will go here
                return true;
            }
        }

        if (helpers.isRoadOnEdges(addedRoad, adjEdges)) {
                //code for settlement & city check will go here
                return true;
        }

        return false;
    }

};
