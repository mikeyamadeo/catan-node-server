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

var Command = new Schema({
    type : String,
    command : String // Stringified JSON
});

var CommandsSchema = new Schema({
    id : Number,
    initialState : {
        bank : ResourceList,
        chat : MessageList,
        log : MessageList,
        map : Map,
        tradeOffer : TradeOffer,
        turnTracker : TurnTracker,
        version : Number,
        winner : Number
    },
    commands : [Command]
});

/* MAY NOT USE GAME ID*/
CommandsSchema.methods.getInitialState = function() {
    return this.initialState;
}

CommandsSchema.methods.getCommands = function() {
    var commands = [];
    for (var i = 0; i < this.commands.length; i++) {
        commands = {
            type: this.commands[i].type, 
            command: JSON.parse(this.commands[i].command)
        };
    };
    return commands;
}

CommandsSchema.methods.addCommand = function(command) {
    var newCommand = {
        type:command.type, 
        command: JSON.stringify(command.command)
    }
    console.log("Command after", newCommand);
    this.commands.push(newCommand);

}

var connection = mongoose.createConnection("mongodb://localhost/catan");

autoIncrement.initialize(connection);

CommandsSchema.plugin(autoIncrement.plugin, 'Command');

module.exports = mongoose.model('Command', CommandsSchema);
