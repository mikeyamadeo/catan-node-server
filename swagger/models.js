'use strict'

module.exports = {
    "Crudentials" : {
        "username" : "string",
        "password" : "string"
    },
    "Game" : {
        "title" : "string",
        "id" : "integer",
        "players" : "array[Player]"
    },
    "User" : {
        "color" : "string",
        "name" : "string",
        "id" : "integer"
    },
    "New Game" : {
        "title" : "string",
        "id" : "integer",
        "players" : "array[EmpytPlayer]"
    },
    "EmptyPlayer" : {
    },
    "JoinGameRequest" : {
        "id" : "integer",
        "color" : "string"
    },
    "SaveGameRequest" : {
        "id" : "integer",
        "name" : "string",
    },
    "LoadGameRequest" : {
        "name" : "string"
    },
    "ClientModel" : {
        "bank" : "ResourceList",
        "chat" : "MessageList",
        "log" : "MessageList",
        "map" : "Map",
        "players" : "array[Player]",
        "tradeOffer" : "TradeOffer",
        "turnTracker" : "TurnTracker",
        "version" : "integer",
        "winner" : "integer"
    },
    "ResourceList" : {
        "brick" : "integer",
        "ore" : "integer",
        "sheep" : "integer",
        "wheat" : "integer",
        "wood" : "integer"
    },
    "MessageList" : {
        "lines" : "array[MessageLine]",
    },
    "MessageLine" : {
        "message" : "string",
        "source" : "string"
    },
    "Map" : {
        "hexes" : "array[Hex]",
        "ports" : "array[Port]",
        "settlements" : "array[VertexObject]",
        "cities" : "array[VertexObject]",
        "radius" : "integer",
        "robber" : "HexLocation"
    },
    "Hex" : {
        "location" : "HexLocation",
        "resource" : "string",
        "number" : "integer"
    },
    "HexLocation" : {
        "x" : "integer",
        "y" : "integer"
    },
    "Port" : {
        "resource" : "string",
        "location" : "HexLocation",
        "direction" : "string",
        "ratio" : "integer"
    },
    "Road" : {
        "owner" : "integer",
        "location" : "EdgeLocation"
    },
    "EdgeLocation" : {
        "x" : "integer",
        "y" : "integer",
        "direction" : "string"
    },
    "VertexObject" : {
        "owner" : "integer",
        "location" : "EdgeLocation",
    },
    "Player" : {
        "cities" : "integer",
        "color" : "string",
        "discarded" : "boolean",
        "monuments" : "integer",
        "name" : "string",
        "newDevCards" : "DevCardList",
        "playerIndex" : "integer",
        "playedDevCard" : "boolean",
        "playerID" : "integer",
        "resources" : "ResourceList",
        "roads" : "integer",
        "settlements" : "integer",
        "soldiers" : "integer",
        "victoryPoints" : "integer"
    },
    "DevCardList" : {
        "monopoly" : "integer",
        "monument" : "integer",
        "roadBuilding" : "integer",
        "soldier" : "integer",
        "yearOfPlenty" : "integer"
    },
    "TradeOffer" : {
        "sender" : "integer",
        "receiver" : "integer",
        "offer" : "ResourceList"
    },
    "TurnTracker" : {
        "currentTurn" : "integer",
        "status" : "string",
        "longestRoad" : "integer",
        "largestArmy" : "integer"
    },
    "AddAIRequest" : {
        "AIType" : "string"
    },
    "SendChat" : {
        "type" : "sendChat",
        "playerIndex" : "integer",
        "content" : "string"
    },
    "RollNumber" : {
        "type" : " rollNumber",
        "playerIndex" : "integer",
        "number" : "integer"
    },
    "RobPlayer" : {
        "type" : "robPlayer",
        "playerIndex" : "integer",
        "victimIndex" : "integer",
        "location" : "HexLocation",
    },
    "FinishMove" : {
        "type" : "finishTurn",
        "playerIndex" : "integer"
    },
    "BuyDevCard" : {
        "type" : "buyDevCard",
        "playerIndex" : "integer"
    },
    "Year_of_Plenty" : {
        "type" : "Year_of_Plenty",
        "playerIndex" : "integer",
        "resource1" : "Resource",
        "resource2" : "Resource"
    },
    "Road_Building" : {
        "type" : "Road_Building",
        "playerIndex" : "integer",
        "spot1" : "EdgeLocation",
        "spot2" : "EdgeLocation"
    },
    "Soldier" : {
        "type" : "Soldier",
        "playerIndex" : "integer",
        "victimIndex" : "integer",
        "location" : "HexLocation"
    },
    "Monopoly" : {
        "type" : "Monopoly",
        "resource" : "string",
        "playerIndex" : "integer"
    },
    "Monument" : {
        "type" : "Monument",
        "playerIndex" : "integer"
    },
    "BuildRoad" : {
        "type" : "buildRoad",
        "playerIndex" : "integer",
        "roadLocation" : "EdgeLocation",
        "free" : "boolean"
    },
    "BuildSettlement" : {
        "type" : "buildSettlement",
        "playerIndex" : "integer",
        "vertexLocation" : "VertexLocation",
        "free" : "boolean"
    },
    "BuildCity" : {
        "type" : "buildCity",
        "playerIndex" : "integer",
        "vertexLocation" : "VertexLocation"
    },
    "OfferTrade" : {
        "type" : "offerTrade",
        "playerIndex" : "integer",
        "offer" : "ResourceList",
        "receiver" : "integer"
    },
    "AcceptTrade" : {
        "type" : "acceptTrade",
        "playerIndex" : "integer",
        "willAccept" : "boolean"
    },
    "MaritimeTrade" : {
        "type" : "maritimeTrade",
        "playerIndex" : "integer",
        "ratio" : "integer",
        "inputResource" : "string",
        "outputResource" : "string"
    },
    "DiscardCards" : {
        "type" : "discardCards",
        "playerIndex" : "integer",
        "discardedCards" : "ResourceList"
    },
    "ChangeLogLevelRequest" : {
        "logLevel" : "string"
    }
};
