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
    victoryPoints : Number
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

GameSchema.methods.getPlayers = function() {
    return this.game.players;
};

GameSchema.methods.getDeck = function() {
    return this.game.deck;
};

GameSchema.methods.getPlayedDevCard = function(index) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index].playedDevCard;
    }
};

GameSchema.methods.getDevCards = function(index, type) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index][type];
    }
};

GameSchema.methods.getBank = function() {
    return this.game.bank;
};

GameSchema.methods.getResources = function(index) {
    if (index >= 0 && index < this.game.players.length) {
        return this.game.players[index].resources;
    }
    return null
};

GameSchema.methods.getHexes = function(index) {
    return this.game.map.hexes;
};

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

GameSchema.methods.getStatus = function(index) {
    return this.game.turnTracker.status;
};

GameSchema.methods.getRobber = function() {
    return this.game.map.robber;
};

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

GameSchema.methods.getOwnedPorts = function(index) {
    var settlements = this.getOwnedStructures(index, 'settlements');
    var cities = this.getOwnedStructures(index, 'cities');
    var ports = this.game.map.ports;
    return ports.filter(function(port) {
        var foundSettlemnt = _.find(settlements, function(settlement) {
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

GameSchema.methods.currentPlayer = function() {
    return this.game.turnTracker.currentTurn;
};

GameSchema.methods.addPlayer = function(player) {
    this.game.players.push(player);
};

GameSchema.methods.addVictoryPoints = function(player, amount) {
    if (player >= 0 && player < this.game.players.length) {
        this.game.players[player].victoryPoints += amount;
    }
};

GameSchema.methods.isGameAvailable = function() {
    return this.game.players.length < 4;
};

GameSchema.methods.isPlayerInGame = function(username) {
    var found = _.find(this.game.players, function(player, index, array) {
        return player.name === username;
    });
    if (found) return true;
    return false;
};

GameSchema.methods.addTradeOffer = function(player, receiver, offer) {
    this.game.tradeOffer = { 
        sender : player,
        receiver : receiver,
        offer : offer
    };
};

GameSchema.methods.modifyResource = function(player, resource, amount, bank) {
    if (player >= 0 && player < this.game.players.length) {
        this.game.players[player].resources[resource] += amount;
        if (bank) {
            var reverse = -1 * amount;
            this.game.bank[resource] += reverse;
        }
    }
};

GameSchema.methods.modifyVictoryPoint = function(player, amount) {
    if (player >= 0 && player < this.game.players.length) {
        this.game.players[player].victoryPoints += amount;
        if (this.game.players[player].victoryPoints >= 10) {
            this.game.winner = player;
        }
    }
};

GameSchema.methods.updateRobber = function(hex) {
    this.game.map.robber.x = hex.x;
    this.game.map.robber.y = hex.y;
};

GameSchema.methods.updateStatus = function(status) {
    this.game.turnTracker.status = status;
};

GameSchema.methods.modifyOldDevCard = function(player, devCard, amount, exchange) {
    if (player >= 0 && player < this.game.players.length) {
        this.game.players[player].oldDevCards[devCard] += amount;
        if (exchange && amount > 0) {
            this.game.deck[devCard] -= amount;
        }
    }
};

GameSchema.methods.modifyNewDevCard = function(player, devCard, amount, exchange) {
    if (player >= 0 && player < this.game.players.length) {
        this.game.players[player].newDevCards[devCard] += amount;
        if (exchange && amount > 0) {
            this.game.deck[devCard] -= amount;
        }
    }
};

GameSchema.methods.addStructure = function(player, location, type) {
    if (player >= 0 && player < this.game.players.length) {
        var structures = this.game.map[type];
        var found = _.find(structures, function(structure) {
            return (structure.location.x === location.x &&
                    structure.location.y === location.y &&
                    structure.location.direction === location.direction);
        });
        if (!found) {
            structures.push({ owner : player, location : location });
            this.game.players[player][type] -= 1;
        }
    }
};

GameSchema.methods.removeStructure = function(player, location, type) {
    if (player >= 0 && player < this.game.players.length) {
        var structures = this.game.map[type];
        _.remove(structures, function(structure) {
            return (structure.location.x === location.x &&
                    structure.location.y === location.y &&
                    structure.location.direction === location.direction);
        });
        this.game.players[player][type] += 1;
    }
};

GameSchema.methods.setDiscarded = function(players, discarded) {
    var self = this;
    players.map(function(player) {
        if (player >= 0 && player < self.game.players.length) {
            self.game.players[player].discarded = discarded;
        }
    });
};

GameSchema.methods.setPlayedDevCard = function(players, played) {
    var self = this;
    players.map(function(player) {
        if (player >= 0 && player < self.game.players.length) {
            self.game.players[player].playedDevCard = played;
        }
    });
};

GameSchema.methods.addSoldier = function(player, amount) {
    if (player >= 0 && player < this.game.players.length) {
        this.game.players[player].soldier += amount;                
    }
};

GameSchema.methods.getResourceCount = function(player, resource) {
    if (player >= 0 && player < this.game.players.length) {
        return this.game.players[player].resouces[resource];
    }
};

GameSchema.methods.updateTurn = function(player) {
    var newTurn = -1;
    switch (player) {
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

GameSchema.methods.mergeDevCards = function(player) {
    if (player >= 0 && player < this.game.players.length) {
        var oldDevCards = this.game.players[player].oldDevCards;
        var newDevCards = this.game.players[player].newDevCards;
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

GameSchema.methods.incVersion = function() {
    this.game.version += 1;
};

GameSchema.methods.addChat = function(message, source) {
    var newMessage = {
        message : message,
        source : source
    };
    this.game.chat.lines.push(newMessage);
};

GameSchema.methods.removeTradeOffer = function() {
    this.game.tradeOffer = null;
};

var connection = mongoose.createConnection("mongodb://localhost/catan");

autoIncrement.initialize(connection);

GameSchema.plugin(autoIncrement.plugin, 'Game');

module.exports = mongoose.model('Game', GameSchema);
