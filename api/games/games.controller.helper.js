'use strict'

var shuffle = require('knuth-shuffle').knuthShuffle;

var randomizeArray = function(array) {
    return shuffle(array);
}; 

var createMap = function(randomTiles, randomChits, ports) {
    var hexes = [];
    // These are not in the correct order. This will need to be changed later
    // We also don't handle ports correctly
    var chits = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 11, 10, 9, 8, 6, 5, 4, 3];
    var tiles = [   "brick", "brick", "brick", 
                    "ore", "ore", "ore",
                    "sheep", "sheep", "sheep", "sheep",
                    "wheat", "wheat", "wheat", "wheat",
                    "wood", "wood", "wood", "wood"
                ];
    if (randomChits) {
        chits = randomizeArray(chits);
    }
    if (randomTiles) {
        tiles = randomizeArray(tiles);
    }
    var count = 0;
    for (var i = -2; i < 3; i++) {
        var range = 5 - Math.abs(i);
        for (var j = 0; j < range; j++) {
            var location = {
                x : i,
                y : j - count
            };
            if (location.x == 0 && location.y == -1) {
                hexes.push({ location : location });
            } else {
                hexes.push({
                    location : location,
                    resource : tiles.pop(),
                    number : chits.pop()
                });
            }
        }
        count++
    }
    var ports = [],
        roads = [],
        settlements = [],
        cities = [];

    return {
        hexes : hexes,
        ports : ports,
        roads : roads,
        settlements : settlements,
        cities : cities,
        radius : 3,
        robber : {
            x : 0,
            y : -1
        }
    };
};
    

module.exports = {
    /**
     * @desc creates a new user
     * @method createNewUser
     * @method {number} id - user id of player
     * @param {string} name - name of new user
     * @param {string} color - color of new player
     * @return {object} player object
     */
    createNewPlayer : function(id, name, color) {
        return {
            id : id, 
            cities : 4,
            color : color,
            discarded : false,
            monuments : 0,
            name : name,
            newDevDards : {
                monopoly : 0,
                monument : 0,
                roadBuilding : 0,
                soldier : 0,
                yearOfPlenty : 0
            },
            oldDevCards : {
                monopoly : 0,
                monument : 0,
                roadBuilding : 0,
                soldier : 0,
                yearOfPlenty : 0
            },
            index : -1,
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
    },
    createNewGame : function(tiles, chits, ports, name) {
        return {
            title : name,
            players : [],
            game : {
                bank : {
                    brick : 19,
                    ore : 19,
                    sheep : 19,
                    wheat : 19,
                    wood : 19
                },
                chat : {
                   lines : []
                },
                log : {
                    lines : []
                },
                map : createMap(tiles, chits, ports),
                tradeOffer : {},
                turnTracker : {
                    currentTurn : 0,
                    status : "Setup",
                    longestRoad : -1,
                    largestArmy : -1
                },
                version : 0,
                winner : -1
            }
        };
    }  
        
};
