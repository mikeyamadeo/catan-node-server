'use strict'

var _ = require('lodash');
var movesModel = require('./moves.model');
var gamesModel = require('./../games/games.model');
var gameModel = require('./../game/game.model');
var helpers = require('./../../common/common.helper');
var  async = require('async');

module.exports = {

    gameToModel : function(game) {
        game = _.omit(game._doc, '__v');
        return _.omit(game._doc, '_id');
    },

    verifyRoadsAvailable : function (gameId, playerId, amount, callback) {
        movesModel.getOwnedRoads(gameId, playerId, function (err, roads) {
            if (err) {
                console.log(err.stack); 
                return callback(err, true);
            }
            if (roads.length > 15-amount) {
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
			        	var matchingRoads = roads.filter(function (road) {
			        		return (helpers.containsEdge(road.location, edges) && road.owner === playerIndex);
			        	});
			        	return movesModel.getGameState( gameId, function (err, state) {
				            if (state.indexOf("Round") > -1) {
				            	console.log("init round, num of connecting roads is " + matchingRoads.length);
				            	//if (matchingRoads.length > 0)
				                	//return callback(new Error("During initial round the road cannot be connected to another road")); 
				                //else 
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
	},

 
    countResources : function(resources) {
        var total = 0;
        _.forOwn(resources, function(value, key) {
            if (!isNaN(value)) {
                total += value;
            }
        });        
        return total;
    },

    normalizeEdge : function(edge) {
        
        switch(edge.direction) {
            case 'NW':
            case 'NE':
            case 'N':
                break;
            case 'SW':
                edge.direction = 'NE';
                edge.x = edge.x - 1;
                edge.y = edge.y + 1;
                break;
            case 'SE':
                edge.direction = 'NW';
                edge.x = edge.x + 1;
                break;
            case 'S':
                edge.direction = 'N';
                edge.y = edge.y + 1;
                break;
            default:
                break;
        }
        return edge;
    },

    normalizeVertex : function(vertex) {
        switch(vertex.direction) {
            case 'NW':
            case 'NE':
                break;
            case 'W':
                vertex.direction = 'NE';
                vertex.x = vertex.x - 1;
                vertex.y = vertex.y + 1;
                break;
            case 'SW':
                vertex.direction = 'NW';
                vertex.y = vertex.y + 1;
                break;
            case 'SE':
                vertex.direction = 'NE';
                vertex.y = vertex.y + 1;
                break;
            case 'E':
                vertex.direction = 'NW';
                vertex.x = vertex.x + 1;
                break;
            default:
                break;
        }
        return vertex;
    },

    /*
        Takes the map from a game, the newest road, and an array of counted roads.
        Adds the road to the result array.
        Gets the road's adjacent vertices and checks for opposing player buildings.
        If not found, gets a vertex's adjacent edges and checks if it is on the map,
        owned by player, and not already in the results array. If these are all met, 
        the function is called on that road.
        When this is completed, the array of roads is returned.
    */
    calcuateLongestRoad: function(map, road, results) {
        results.push(road);
        var vertices = getAdjacentVertices(road);
        for (var i = 0; i < vertices.length; i++) {
            if(canContinueLRCalc(map, vertices[i])) {
                var edges = getAdjacentEdges(verticies[i]);
                for (var j = 0; j < edges.length; j++) {
                    var edge = normalizeEdge(edges[j]);

                    if(isOwnedEdge(edge, map.roads) && results.indexOf(edge) === -1) {
                        calcuateLongestRoad(map, edges[j], results)
                    }
                };
            }
        }
        return results;
    },
    // gets adjacent edges of a given vertex
    getAdjacentEdges: function(vertexLocation) {
        var vertex = normalizeVertex(vertexLocation);
        var edges = [];
        switch(road.direction) {
            case 'NW':
                edges.push({owner : vertex.owner,
                    location : {
                        x : vertex.location.x,
                        y : vertex.location.y,
                        direction : 'W'
                    }
                });
                edges.push({owner : vertex.owner,
                    location : {
                        x : vertex.location.x,
                        y : vertex.location.y,
                        direction : 'NE'
                    }
                });
                edges.push({owner : vertex.owner,
                    location : {
                        x : vertex.location.x,
                        y : vertex.location.y - 1,
                        direction : 'W'
                    }
                });
                break;
            case 'NE':
                edges.push({owner : vertex.owner,
                    location : {
                        x : vertex.location.x,
                        y : vertex.location.y,
                        direction : 'E'
                    }
                });
                edges.push({owner : vertex.owner,
                    location : {
                        x : vertex.location.x,
                        y : vertex.location.y,
                        direction : 'NW'
                    }
                });
                edges.push({owner : vertex.owner,
                    location : {
                        x : vertex.location.x,
                        y : vertex.location.y - 1,
                        direction : 'E'
                    }
                });
                break;
            default:
                break;
        }
        return vertices;
    },

    isOwnedEdge: function(road, roads) {
        for (var i = 0; i < roads.length; i++) {
            if(helpers.isLocationEqual(roads[i].location, road.location) && roads[i].owner == road.owner) {
                return true;
            }
        }
        return false;
    },

    // checks if a vertex has a building and is not owned by player
    canContinueLRCalc: function(map, vertex) {
        var normVertex = normalizeVertex(vertex);
        for (var i = 0; i < map.settlements.length; i++) {
            if (helpers.isLocationEqual(map.settlements[i].location, normVertex.location)) {
                if(map.settlements[i].owner !== normVertex.owner) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        for (var i = 0; i < map.cities.length; i++) {
            if (helpers.isLocationEqual(map.cities[i].location, normVertex.location)) {
                if(map.cities[i].owner !== normVertex.owner) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        return true;
    },

    // given a road, will return vertices
    getAdjacentVertices: function(roadLocation) {
        var road = normalizeEdge(roadLocation);
        var vertices = [];
        switch(road.direction) {
            case 'NW':
                vertices.push({owner : road.owner,
                    location : {
                        x : road.location.x,
                        y : road.location.y,
                        direction : 'W'
                    }
                });
                vertices.push({owner : road.owner,
                    location : {
                        x : road.location.x,
                        y : road.location.y,
                        direction : 'NW'
                    }
                });
                break;
            case 'NE':
                vertices.push({owner : road.owner,
                    location : {
                        x : road.location.x,
                        y : road.location.y,
                        direction : 'NE'
                    }
                });
                vertices.push({owner : road.owner,
                    location : {
                        x : road.location.x,
                        y : road.location.y,
                        direction : 'NW'
                    }
                });
                break;
            case 'N':
                vertices.push({owner : road.owner,
                    location : {
                        x : road.location.x,
                        y : road.location.y,
                        direction : 'E'
                    }
                });
                vertices.push({owner : road.owner,
                    location : {
                        x : road.location.x,
                        y : road.location.y,
                        direction : 'NE'
                    }
                });
                break;
            default:
                break;
        }
        return vertices;
    }

};
