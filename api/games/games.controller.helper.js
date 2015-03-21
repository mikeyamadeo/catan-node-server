'use strict'

var shuffle = require('knuth-shuffle').knuthShuffle;

var randomizeArray = function(array) {
    return shuffle(array);
}; 

x : -2
y : 0

x : 2
y : -2

var createMap = function(randomTiles, randomChits, randomPorts) {
    var hexes = [];
    // These are not in the correct order. This will need to be changed later
    var chits = [6, 12, 11, 10, 5, 9, 4, 8, 4, 11, 3, 3, 9, 10, 8, 6, 2, 5];
    var tiles = [   "wheat", "sheep", "wood", 
                    "sheep", "brick", "ore",
                    "brick", "wheat", "wood", "wheat",
                    "wood", "ore", "sheep", "sheep",
                    "brick", "wood", "wheat", "ore"
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
            if (location.x == 0 && location.y == -2) {
                hexes.push({ location : location });
            } else {
                hexes.push({
                    location : location,
                    resource : tiles.pop(),
                    number : chits.pop()
                });
            }
        }
        if (count != 2) {
            count++
        }
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
            y : -2
        }
    };
};
    

module.exports = {
    /**
     * @desc creates a new user
     * @method createNewUser
     * @param {string} name - name of new user
     * @param {string} color - color of new player
     * @return {object} player object
     */
    createNewPlayer : function(name, color) {
        return {
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
            index : 0,
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
        console.log(arguments);
        return {
            title : name,
            players : [],
            game : {
                bank : {
                    brick : 25,
                    ore : 25,
                    sheep : 25,
                    wheat : 25,
                    wood : 25
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
