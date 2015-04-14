'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    autoIncrement = require('mongoose-auto-increment');

var ResourceList = {
    brick : Number,
    ore : Number,
    sheep : Number,
    wheat : Number,
    wood : Number
};

var Message = new Schema({
    message : String,
    source : String
}, { _id : false });

var MessageList = {
    lines : [Message]
};

var DevCardList = {
    monopoly : Number,
    monument : Number,
    roadBuilding : Number,
    soldier : Number,
    yearOfPlenty : Number
};

var Player = new Schema({
    playerID : Number,
    cities : Number,
    color : String,
    discarded : Boolean,
    monuments : Number,
    name : String,
    newDevCards : DevCardList,
    oldDevCards : DevCardList,
    playerIndex : Number,
    playedDevCard : Boolean,
    resources : ResourceList,
    roads : Number,
    settlements : Number,
    soldiers : Number,
    victoryPoints : Number,
    longestRoadCount : Number
}, { _id : false });

var HexLocation = {
    x : Number,
    y : Number
};

var Hex = new Schema({
    location : HexLocation,
    resource : String,
    number : Number
}, { _id : false });

var Port = new Schema({
    resource : String,
    location : HexLocation,
    direction : String,
    ratio : Number
}, { _id : false }); 

/**
* @desc Normalizes the location contained within the port
* @method normalize
* @class Port
*/
Port.methods.normalize = function() {
    
    switch(this.location.direction) {
        case 'NW':
        case 'NE':
        case 'N':
            break;
        case 'SW':
            this.location.direction = 'NE';
            this.location.x = this.location.x - 1;
            this.location.y = this.location.y + 1;
            break;
        case 'SE':
            this.location.direction = 'NW';
            this.location.x = this.location.x + 1;
            break;
        case 'S':
            this.location.direction = 'N';
            this.location.y = this.location.y + 1;
            break;
        default:
            break;
    }
    return this;
}

var Road = new Schema({
    owner : Number,
    location : {
        x : Number,
        y : Number,
        direction : String
    }
}, { _id : false });

/**
* @desc Normalizes the location inside the road object
* @method normalize
* @class Road
*/
Road.methods.normalize = function() {
    
    switch(this.location.direction) {
        case 'NW':
        case 'NE':
        case 'N':
            break;
        case 'SW':
            this.location.direction = 'NE';
            this.location.x = this.location.x - 1;
            this.location.y = this.location.y + 1;
            break;
        case 'SE':
            this.location.direction = 'NW';
            this.location.x = this.location.x + 1;
            break;
        case 'S':
            this.location.direction = 'N';
            this.location.y = this.location.y + 1;
            break;
        default:
            break;
    }
    return this;
}

var VertexObject = new Schema({
    owner : Number,
    location : {
        x : Number,
        y : Number,
        direction : String
    }
}, { _id : false });

/**
* @desc Normalizes the location contained within the vertex object
* @method normalize
* @class VertexObject
*/
VertexObject.methods.normalize = function() {
    switch(this.location.direction) {
        case 'NW':
        case 'NE':
            break;
        case 'W':
            this.location.direction = 'NE';
            this.location.x = this.location.x - 1;
            this.location.y = this.location.y + 1;
            break;
        case 'SW':
            this.location.direction = 'NW';
            this.location.y = this.location.y + 1;
            break;
        case 'SE':
            this.location.direction = 'NE';
            this.location.y = this.location.y + 1;
            break;
        case 'E':
            this.location.direction = 'NW';
            this.location.x = this.location.x + 1;
            break;
        default:
            break;
    }
    return this;
}

var Map = {
    hexes : [Hex],
    ports : [Port],
    roads : [Road],
    settlements : [VertexObject],
    cities : [VertexObject],
    radius : Number,
    robber : HexLocation
};

var TradeOffer = {
    sender : Number,
    receiver : Number,
    offer : ResourceList
};

var TurnTracker = {
    currentTurn : Number,
    status : String,
    longestRoad : Number,
    largestArmy : Number
};

var GameSchema = new Schema({
    title : String,
    game : {
        players : [Player],
        bank : ResourceList,
        deck : DevCardList,
        chat : MessageList,
        log : MessageList,
        map : Map,
        tradeOffer : TradeOffer,
        turnTracker : TurnTracker,
        version : Number,
        winner : Number
    }
});

/**
* @desc Updates the color of the specified player
* @method updateColor
* @param {string} name - specifes player
* @param {string} color - player's new color
* @class Game
*/
GameSchema.methods.updateColor = function(name, color) {
    for (var i = 0; i < this.game.players.length; i++) {
        if (this.game.players[i].name == name) {
            this.game.players[i].color = color;
        }
    }
};

GameSchema.methods.updateLongestRoad = function(player) {
    var hasLongest = this.game.turnTracker.longestRoad;
    if(hasLongest == -1 && this.game.players[player].roads <= 10) {
        this.game.turnTracker.longestRoad = player;
    }
    else {
        var currentLongest = this.game.players[hasLongest].roads;
        if(this.game.players[player].roads < currentLongest) {
            this.game.turnTracker.longestRoad = player;
        }
    }
};

/**
* @desc Retrieves the list of players from a game
* @method getPlayers
* @class Game
*/
GameSchema.methods.getPlayers = function() {
    return this.game.players;
};

/**
* @desc Retrieves the deck from the game
* @method getDeck
* @class Game
*/
GameSchema.methods.getDeck = function() {
    return this.game.deck;
};

/**
* @desc Retrieves the "playedDevCard" flag from specified player
* @method getPlayedDevCard
* @param {number} index - specifies player
* @class Game
*/
GameSchema.methods.getPlayedDevCard = function(index) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index].playedDevCard;
    }
};

/**
* @desc Retrieves the devCards from specified player
* @method getDevCards
* @param {number} index - specifies player
* @param {string} type - [oldDevCards/newDevCards]
* @class Game
*/ 
GameSchema.methods.getDevCards = function(index, type) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index][type];
    }
};

/**
* @desc Retrieves the bank from game
* @method getBank
* @class Game
*/
GameSchema.methods.getBank = function() {
    return this.game.bank;
};

/**
* @desc Retrieves the resource list from specified player
* @method getResources
* @param {number} index - specified player
* @class Game
*/
GameSchema.methods.getResources = function(index) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index].resources;
    }
    return null
};



/**
* @desc Retrieves the hexes from game map
* @method getHexes
* @class Game
*/
GameSchema.methods.getHexes = function() {
    return this.game.map.hexes;
};

/**
* @desc Retrieves the hexes from game map by chit
* @method getHexesByChit
* @param {number} chit - [2-12]
* @class Game
*/
GameSchema.methods.getHexesByChit = function(chit) {
    var hexes = this.game.map.hexes;
    var resourceHexes = [];
    for (var i = 0; i < hexes.length; i++) {
        if(hexes[i].number === chit) {
            resourceHexes.push(hexes[i]);
        }
    }
    return resourceHexes;
};

/**
* @desc Adds message to log concatenated with specified players name
* @method addToLog
* @param {string} - message to add to log
* @param {number} - specifies player
* @class Game
*/
GameSchema.methods.addToLog = function(message, index) {
    var players = this.game.players;
    var logMessage = players[index].name + message;
    this.game.log.lines.push({
          message:logMessage,
          source:players[index].name
    });
};


/**
* @desc Retrieves the status of game
* @method getStatus
* @class Game
*/
GameSchema.methods.getStatus = function() {
    return this.game.turnTracker.status;
};

GameSchema.methods.getLargestArmy = function() {
    return this.game.turnTracker.largestArmy;
};

GameSchema.methods.setLargestArmy = function(player) {
    return this.game.turnTracker.largestArmy = player;
};

GameSchema.methods.getSoldier = function(player) {
    if (player >= 0 && player < this.game.players.length) {
        return this.game.players[player].soldiers;                
    }
    else
        return 0;
};

/**
* @desc Retrieves the robber from the game
* @method getRobber
* @class Game
*/
GameSchema.methods.getRobber = function() {
    return this.game.map.robber;
};

/**
* @desc Retrieves the roads owned by specified player from game map
* @method getOwnedRoads
* @param {number} index - specifies player
* @class Game
*/
GameSchema.methods.getOwnedRoads = function(index) {
    var roads = this.game.map.roads;
    return roads.filter(function(road) {
        if (road.owner == index) {
            return true;
        } else {
            return false;
        }
    });
};

/**
* @desc Retrieves the ports owned by specified player from game map
* @method getOwnedPorts
* @param {number} index - specifis player
* @class Game
*/
GameSchema.methods.getOwnedPorts = function(index) {
    var settlements = this.getOwnedStructures(index, 'settlements');
    var cities = this.getOwnedStructures(index, 'cities');
    var ports = this.game.map.ports;
    return ports.filter(function(port) {
        var foundSettlement = _.find(settlements, function(settlement) {
            if (settlement.location.x === port.location.x &&
                settlement.location.y === port.location.y) {
                return true;
            } else {
                return false;
            }
        });
        var foundCity = _.find(cities, function(city) {
            if (city.location.x === port.location.x &&
                city.location.y === port.location.y) {
                return true;
            } else {
                return false;
            }
        });
        if (foundSettlement || foundCity) {
            return true;
        } else {
            return false;
        }
    });
};

/**
* @desc Retrieves the structures owned by specified player
* @method getOwnedStructures
* @param {number} index - specifies player
* @param {string} structure - ['settlements'/'cities']
* @class Game
*/
GameSchema.methods.getOwnedStructures = function(index, structure) {
    var structures = this.game.map[structure];
    return structures.filter(function(struct, index, array) {
        if (struct.owner == index) {
            return true;
        } else {
            return false;
        }
    });
};

/**
* @desc Retrieves the index of the current player
* @method currentPlayer
* @class Game
*/
GameSchema.methods.currentPlayer = function() {
    return this.game.turnTracker.currentTurn;
};

/**
* @desc Adds a player to game
* @method addPlayer
* @param {Object} player - player object
* @class Game
*/
GameSchema.methods.addPlayer = function(player) {
    this.game.players.push(player);
};

/**
* @desc Adds victory points to specified player
* @method addVictoryPoints
* @param {number} index - specifies player
* @param {number} amount - amount to increase victory points by...
* @class Game
*/
GameSchema.methods.addVictoryPoints = function(index, amount) {
    if (index >= 0 && index < this.game.players.length) {
        this.game.players[index].victoryPoints += amount;
    }
};

/**
* @desc Determines whether a game has 4 players
* @method isGameAvailable
* @class Game
*/
GameSchema.methods.isGameAvailable = function() {
    return this.game.players.length < 4;
};

/**
* @desc Determines whether the specified player is in game
* @method isPlayerInGame
* @param {string} username - specifies player
* @class Game
*/
GameSchema.methods.isPlayerInGame = function(username) {
    var found = _.find(this.game.players, function(player, index, array) {
        return player.name === username;
    });
    if (found) return true;
    return false;
};

/**
* @desc Adds a trade offer to the game
* @method addTradeOffer
* @param {number} sender - specifies sender
* @param {number} receiver - specifies receiver
* @param {object} offer - trade offer object (SEE JSON API)
* @class Game
*/
GameSchema.methods.addTradeOffer = function(sender, receiver, offer) {
    this.game.tradeOffer = { 
        sender : sender,
        receiver : receiver,
        offer : offer
    };
};

/**
* @desc Modifies the resource count of specified player by amount. Optionally
* tranfers resources to/from bank
* @method modifyResource
* @param {number} index - specifies player
* @param {string} resource - specifies resource type to modify
* @param {number} amount - amount to modify resources by
* @param {boolean} bank - optional flag to transfer resources to/from bank
* @class Game
*/
GameSchema.methods.modifyResource = function(index, resource, amount, bank) {
    if (index >= 0 && index < this.game.players.length) {
        this.game.players[index].resources[resource] += amount;
        if (bank) {
            var reverse = -1 * amount;
            this.game.bank[resource] += reverse;
        }
    }
};

/**
* @desc Modifies the victory points of specified player
* @method modifyVictoryPoint
* @param {number} index - specifies player
* @param {number} amount - amount to modify victory points by...
* @class Game
*/
GameSchema.methods.modifyVictoryPoint = function(index, amount) {
    if (index >= 0 && index < this.game.players.length) {
        this.game.players[index].victoryPoints += amount;
        if (this.game.players[index].victoryPoints >= 10) {
            this.game.winner = index;
        }
    }
};

/**
* @desc Moves the robber to the specified location
* @method updateRobber
* @param {object} hex - hex location object (SEE JSON API)
* @class Game
*/
GameSchema.methods.updateRobber = function(hex) {
    this.game.map.robber.x = hex.x;
    this.game.map.robber.y = hex.y;
};

/**
* @desc Updates the status of the game
* @method updateStatus
* @param {string} status - New game status ['Rolling', 'Playing', etc...]
* @class Game
*/
GameSchema.methods.updateStatus = function(status) {
    this.game.turnTracker.status = status;
};

/**
* @desc Modifies the specified dev card in the old dev card player of 
* specified player. Optionally transfers dev card to the bank
* @method modifyOldDevCard
* @param {number} index - specifies player
* @param {string} devCard - specifies dev card ['monopoly', 'monument', etc...]
* @param {number} amount - amount to modify specified dev card
* @param {boolean} exchange - optional flag to exhange dev card with bank
* @class Game
*/
GameSchema.methods.modifyOldDevCard = function(index, devCard, amount, exchange) {
    if (index >= 0 && index < this.game.players.length) {
        this.game.players[index].oldDevCards[devCard] += amount;
        if (exchange && amount > 0) {
            this.game.deck[devCard] -= amount;
        }
    }
};

/**
* @desc Modifies the specified dev card in the new dev card player of 
* specified player. Optionally transfers dev card to the bank
* @method modifyNewDevCard
* @param {number} index - specifies player
* @param {string} devCard - specifies dev card ['monopoly', 'monument', etc...]
* @param {number} amount - amount to modify specified dev card
* @param {boolean} exchange - optional flag to exhange dev card with bank
* @class Game
*/
GameSchema.methods.modifyNewDevCard = function(index, devCard, amount, exchange) {
    if (index >= 0 && index < this.game.players.length) {
        this.game.players[index].newDevCards[devCard] += amount;
        if (exchange && amount > 0) {
            this.game.deck[devCard] -= amount;
        }
    }
};

/**
* @desc Adds a structure to the game map
* @method addStructure
* @param {number} index - specifes player
* @param {object} location - VertexObject (SEE JSON API)
* @param {string} type - specifies structure type ['settlements'/'cities']
* @class Game
*/ 
GameSchema.methods.addStructure = function(index, location, type) {
    if (index >= 0 && index < this.game.players.length) {
        var structures = this.game.map[type];
        var found = _.find(structures, function(structure) {
            return (structure.location.x === location.x &&
                    structure.location.y === location.y &&
                    structure.location.direction === location.direction);
        });
        if (!found) {
            structures.push({ owner : index, location : location });
            this.game.players[index][type] -= 1;
        }
    }
};

/**
* @desc Removes a structure from the map
* @method removeStructure
* @param {number} index - specifes player
* @param {object} location - VertexObject (SEE JSON API)
* @param {string} type - specifies structure type ['settlements'/'cities']
* @class Game
*/ 
GameSchema.methods.removeStructure = function(index, location, type) {
    if (index >= 0 && index < this.game.players.length) {
        var structures = this.game.map[type];
        _.remove(structures, function(structure) {
            return (structure.location.x === location.x &&
                    structure.location.y === location.y &&
                    structure.location.direction === location.direction);
        });
        this.game.players[index][type] += 1;
    }
};

/**
* @desc Sets the discarded flag on specified players
* @metod setDiscarded
* @param {array} players - array of indices that specify players
* @param {boolean} discarded - new value of discarded
* @class Game
*/
GameSchema.methods.setDiscarded = function(players, discarded) {
    var self = this;
    players.map(function(player) {
        if (player >= 0 && player < self.game.players.length) {
            self.game.players[player].discarded = discarded;
        }
    });
};

/**
* @desc Sets the playedDevCard flag on specified players
* @metod setPlayedDevCard
* @param {array} players - array of indices that specify players
* @param {boolean} discarded - new value of playedDevCard
* @class Game
*/
GameSchema.methods.setPlayedDevCard = function(players, played) {
    var self = this;
    players.map(function(player) {
        if (player >= 0 && player < self.game.players.length) {
            self.game.players[player].playedDevCard = played;
        }
    });
};


/**
* @desc Adds amount to the soldier count of specified player
* @method addSoldier
* @param {number} index - specifies player
* @param {number} amount - amount to add to player soldier count
* @class Game
*/
GameSchema.methods.addSoldier = function(index, amount) {
    if (index >= 0 && index < this.game.players.length) {
        this.game.players[index].soldiers += amount;                
    }
};

/**
* @desc Retrieves the # of resource type of specified player
* @method getResourceCount
* @param {number} index - specifies player
* @param {string} resource - resource type
* @class Game
*/
GameSchema.methods.getResourceCount = function(index, resource) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index].resouces[resource];
    }
};

/**
* @desc Updates the current turn of the game
* @method updateTurn
* @param {number} index - specifies previous player
* @class Game
*/
GameSchema.methods.updateTurn = function(index) {
    var newTurn = -1;
    switch (index) {
        case 0 : newTurn = 1;
                 break;
        case 1 : newTurn = 2;
                 break;
        case 2 : newTurn = 3;
                 break;
        case 3 : newTurn = 0;
                 break;
        default : break;
    }
    if (newTurn != -1) {
        this.game.turnTracker.currentTurn = newTurn;
    }
};

GameSchema.methods.updateInitialTurn = function(player) {
    var newTurn = -1;
    switch (player) {
        case 0 : newTurn = 0;
                 break;
        case 1 : newTurn = 0;
                 break;
        case 2 : newTurn = 1;
                 break;
        case 3 : newTurn = 2;
                 break;
        case 4 : newTurn = 3;
                 break;
        default : break;
    }
    if (newTurn != -1) {
        this.game.turnTracker.currentTurn = newTurn;
    }
};

/**
* @desc Transfer new dev cards to new card pile
* @method mergeDevCards
* @param {number} index - specifies player
* @class Game
*/
GameSchema.methods.mergeDevCards = function(index) {
    if (index >= 0 && index < this.game.players.length) {
        var oldDevCards = this.game.players[index].oldDevCards;
        var newDevCards = this.game.players[index].newDevCards;
        oldDevCards.monument += newDevCards.monument;
        newDevCards.monument = 0;
        oldDevCards.monopoly += newDevCards.monopoly;
        newDevCards.monopoly = 0;
        oldDevCards.roadBuilding += newDevCards.roadBuilding;
        newDevCards.roadBuilding = 0;
        oldDevCards.soldier += newDevCards.soldier;
        newDevCards.soldier = 0;
        oldDevCards.yearOfPlenty += newDevCards.yearOfPlenty;
        newDevCards.yearOfPlenty = 0;
    }        
};

/**
* @desc Increments the current version of the game model
* @method incVersion
* @class Game
*/
GameSchema.methods.incVersion = function() {
    this.game.version += 1;
};

GameSchema.methods.addChat = function(message, index) {
    var players = this.game.players;
    var player = players[index].name;
    var newMessage = {
        message : message,
        source : player
    };
    this.game.chat.lines.push(newMessage);
};

/**
* @desc Removes the trade offer from the model
* @method removeTradeOffer
* @class Game
*/
GameSchema.methods.removeTradeOffer = function() {
    this.game.tradeOffer = null;
};

var connection = mongoose.createConnection("mongodb://localhost/catan");

autoIncrement.initialize(connection);

GameSchema.plugin(autoIncrement.plugin, 'Game');

module.exports = mongoose.model('Game', GameSchema);
