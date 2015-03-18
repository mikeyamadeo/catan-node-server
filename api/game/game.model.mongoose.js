'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

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
});

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
});

var hexLocation = {
    x : Number,
    y : Number
};

var HexLocation = {
    x : Number,
    y : Number
};

var Hex = new Schema({
    location : HexLocation,
    resource : String,
    chit : Number
});

var Port = new Schema({
    resource : String,
    location : HexLocation,
    direction : String,
    ratio : Number
}); 

var Road = new Schema({
    owner : Number,
    location : {
        x : Number,
        y : Number,
        direction : String
    }
});

var VertexObject = new Schema({
    owner : Number,
    location : {
        x : Number,
        y : Number,
        direction : String
    }
});

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
    _id : { type : Number, unique : true },
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

GameSchema.methods.giveResource = function(player, resource, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].resources[resource] += amount;
    }
};

GameSchema.methods.takeResource = function(player, resource, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].resources[resource] -= amount;
    }
};

GameSchema.methods.updateRobber = function(hex) {
    this.game.map.robber.x = hex.x;
    this.game.map.robber.y = hex.y;
};

GameSchema.methods.updateStatus = function(status) {
    this.game.turnTracker.status = status;
};

GameSchema.methods.addOldDevCard = function(player, devCard, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].oldDevCards[devCard] += amount;
    }
};

GameSchema.methods.removeOldDevCard = function(player, devCard, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].oldDevCards[devCard] -= amount;
    }
};

GameSchema.methods.addNewDevCard = function(player, devCard, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].newDevCards[devCard] += amount;
    }
};

GameSchema.methods.removeNewDevCard = function(player, devCard, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].newDevCards[devCard] -= amount;
    }
};

GameSchema.methods.addRoad = function(player, location) {
    if (player >= 0 && player < players.length) {
        var road = this.map.roads.find(function(road, index, array) {
            return _.isEqual(road.location, location);
        });
        if (!road) {
            this.map.roads.push({ owner : player, location : location });
            this.players[player].roads -= 1;
        }
    }
};

GameSchema.methods.setDiscarded = function(players, discarded) {
    players.map(function(player, index, array) {
        if (player >= 0 && player < players.length) {
            this.players[player].discarded = discarded;
        }
    });
};

GameSchema.methods.setPlayedDevCard = function(players, played) {
    players.map(function(player, index, array) {
        if (player >= 0 && player < players.length) {
            this.players[player].playedDevCard = played;
        }
    });
};

GameSchema.methods.addSoldier = function(player, amount) {
    if (player >= 0 && player < players.length) {
        this.players[player].soldier += amount;                
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
        this.turnTracker.currentTurn = newTurn;
    }
};

GameSchema.methods.mergeDevCards = function(player) {
    if (player >= 0 && player < players.length) {
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
    this.chat.lines.push(newMessage);
};

module.exports = mongoose.model('Game', GameSchema);
