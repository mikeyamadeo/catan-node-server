'use strict'

var shuffle = require('knuth-shuffle').knuthShuffle;

var randomizeArray = function(array) {
    return shuffle(array);
}; 

var createMap = function(randomTiles, randomChits, randomPorts) {
    var hexes = [];
    var chits = [6, 12, 11, 10, 5, 9, 4, 8, 4, 11, 3, 3, 9, 10, 8, 6, 2, 5];
    var tiles = [   "wheat", "sheep", "wood", 
                    "sheep", "brick", "ore",
                    "brick", "wheat", "wood", "wheat",
                    "wood", "ore", "sheep", "sheep",
                    "brick", "wood", "wheat", "ore"
                ];
    var ports = [];
    var portResource = ["sheep", "ore",
                        "wheat", "brick", "wood"
                        ];
    var portType = [ null, 2, null, 3, 3, 
                     null, null, 2, 3, 
                     null, null, 2, 2,
                     null, null,  2,
                     null, 3
            ];

    if (randomChits) {
        chits = randomizeArray(chits);
    }
    if (randomTiles) {
        tiles = randomizeArray(tiles);
    }
    if (randomPorts) {
       randomizeArray(portResource);
       randomizeArray(portType);
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


var addToPorts = function(loc) {
    var x = portType.pop();
    if (x != null) {
        if (x == 3) {
            var y = {ratio : x, location : location}
        } else {
            var z = portResource.pop();
            var y = {ratio : x, resource : z, location : location}
        }
        ports.push(y);
    }
}

    var count = 0;
    for (var i = -3; i < 4; i++) {
        var range = 7 - Math.abs(i);
        for (var j = 0; j < range; j++) {
            var location = {
                x : i,
                y : j - count
            };

            if (location.x == -3) {
               addToPorts(location);
            } else if (location.x == -2 && location.y == -1) {
               addToPorts(location);
            } else if (location.x == -2 && location.y == 3) {
                addToPorts(location);
            } else if (location.x == -1 && location.y == -2) {
                addToPorts(location);
            } else if (location.x == -1 && location.y == 3) {
               addToPorts(location);
            } else if (location.x == 0 && location.y == -3) {
                addToPorts(location);
            } else if (location.x == 0 && location.y == 3) {
               addToPorts(location);
            } else if (location.x == 1 && location.y == -3) {
               addToPorts(location);
            } else if (location.x == 1 && location.y == 2) {
               addToPorts(location);
            } else if (location.x == 2 && location.y == -3) {
                addToPorts(location);
            } else if (location.x == 2 && location.y == 1) {
                addToPorts(location);
            } else if (location.x == 3) {
                addToPorts(location);
            } else {

            }
        }
        if (count != 3) {
            count++
        }
    }

    var roads = [],
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
            newDevCards : {
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
