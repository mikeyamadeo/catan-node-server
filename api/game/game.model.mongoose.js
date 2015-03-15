'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DevCardList = new Schema({
    monopoly : Number,
    monument : Number,
    roadBuilding : Number,
    soldier : Number,
    yearOfPlenty : Number
});

var ResourceList = new Schema({
    brick : Number,
    ore : Number,
    sheep : Number,
    wheat : Number,
    wood : Number
});

var Message = new Schema({
    message : String,
    source : String
});

var MessageList = new Schema({
    lines : [Message]
});

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
    reources : ResourceList,
    roads : Number,
    settlements : Number,
    soldiers : Number,
    victoryPoints : Number
});

var HexLocation = new Schema({
    x : Number,
    y : Number
});

var Hex = new Schema({
    address : HexLocation,
    resource : String,
    chit : Number
});

var Port = new Schema({
    resource : String,
    address : HexLocation,
    direction : String,
    ratio : Number
}); 

var Road = new Schema({
    owner : Number,
    address : {
        x : Number,
        y : Number,
        direction : String
    }
});

var VertexObject = new Schema({
    owner : Number,
    address : {
        x : Number,
        y : Number,
        direction : String
    }
});

var Map = new Schema({
    hexes : [Hex],
    ports : [Port],
    roads : [Road],
    settlements : [VertexObject],
    cities : [VertexObject],
    radius : Number,
    robber : HexLocation
});

var TradeOffer = new Schema({
    sender : Number,
    receiver : Number,
    offer : ResourceList
});

var TurnTracker = new Schema({
    currentTurn : Number,
    stat : String,
    longestRoad : Number,
    largestArmy : Number
});

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
});
    
modele.exports = mongoose.model('Game', GameSchema);
