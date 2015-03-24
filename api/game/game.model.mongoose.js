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
    id : Number,
    cities : Number,
    color : String,
    discarded : Boolean,
    monuments : Number,
    name : String,
    newDevCards : DevCardList,
    oldDevCards : DevCardList,
    index : Number,
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

var Road = new Schema({
    owner : Number,
    location : {
        x : Number,
        y : Number,
        direction : String
    }
}, { _id : false });

var VertexObject = new Schema({
    owner : Number,
    location : {
        x : Number,
        y : Number,
        direction : String
    }
}, { _id : false });

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
    players : [Player],
    game : {
        bank : ResourceList,
        chat : MessageList,
        log : MessageList,
        map : Map,
        tradeOffer : TradeOffer,
        turnTracker : TurnTracker,
        version : Number,
        winner : Number
    }
});

GameSchema.methods.getDevCards = function(index, type) {
    if (index >= 0 && index < this.players.length) {
        return this.players[index][type];
    }
};

GameSchema.methods.getBank = function() {
    return this.game.bank;
};

GameSchema.methods.getResources = function(index) {
    if (index >= 0 && index < this.players.length) {
        return this.players[index].resources;
    }
    return null
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
    this.players.push(player);
};

GameSchema.methods.isGameAvailable = function() {
    return this.players.length < 4;
};

GameSchema.methods.isPlayerInGame = function(username) {
    var found = _.find(this.players, function(player, index, array) {
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
    if (player >= 0 && player < this.players.length) {
        this.players[player].resources[resource] += amount;
        if (bank) {
            var reverse = -1 * amount;
            this.game.bank[resource] += reverse;
        }
    }
};

GameSchema.methods.modifyVictoryPoint = function(player, amount) {
    if (player >= 0 && player < this.players.length) {
        this.players[player].victoryPoints += amount;
        if (this.players[player].victoryPoints >= 10) {
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

GameSchema.methods.modifyOldDevCard = function(player, devCard, amount) {
    if (player >= 0 && player < this.players.length) {
        this.players[player].oldDevCards[devCard] += amount;
    }
};

GameSchema.methods.modifyNewDevCard = function(player, devCard, amount) {
    if (player >= 0 && player < this.players.length) {
        this.players[player].newDevCards[devCard] += amount;
    }
};

GameSchema.methods.addStructure = function(player, location, type) {
    if (player >= 0 && player < this.players.length) {
        var structures = this.game.map[type];
        var found = _.find(structures, function(structure) {
            return (structure.location.x === location.x &&
                    structure.location.y === location.y &&
                    structure.location.direction === location.direction);
        });
        if (!found) {
            structures.push({ owner : player, location : location });
            this.players[player][type] -= 1;
        }
    }
};

GameSchema.methods.removeStructure = function(player, location, type) {
    if (player >= 0 && player < this.players.length) {
        var structures = this.game.map[type];
        _.remove(structures, function(structure) {
            return (structure.location.x === location.x &&
                    structure.location.y === location.y &&
                    structure.location.direction === location.direction);
        });
    }
};

GameSchema.methods.setDiscarded = function(players, discarded) {
    this.players.map(function(player, index, array) {
        if (player >= 0 && player < this.players.length) {
            this.players[player].discarded = discarded;
        }
    });
};

GameSchema.methods.setPlayedDevCard = function(players, played) {
    this.players.map(function(player, index, array) {
        if (player >= 0 && player < this.players.length) {
            this.players[player].playedDevCard = played;
        }
    });
};

GameSchema.methods.addSoldier = function(player, amount) {
    if (player >= 0 && player < this.players.length) {
        this.players[player].soldier += amount;                
    }
};

GameSchema.methods.getResourceCount = function(player, resource) {
    if (player >= 0 && player < this.players.length) {
        return this.players[player].resouces[resource];
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
    if (player >= 0 && player < this.players.length) {
        var oldDevCards = this.players[player].oldDevCards;
        var newDevCards = this.players[player].newDevCards;
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

var connection = mongoose.createConnection("mongodb://localhost/catan");

autoIncrement.initialize(connection);

GameSchema.plugin(autoIncrement.plugin, 'Game');

module.exports = mongoose.model('Game', GameSchema);
