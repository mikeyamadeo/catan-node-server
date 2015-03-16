'use strict';

var _ = require('lodash');

/**
 * Example of getting access to required models:
 *
 * var Model = require('../model');
 * var MovesModel = require('./moves.model');
 */


var MovesController = {
  /** CREATE **/

  /**
   * @desc store a chat message & return a response
   * @method sendChat
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  sendChat: function(req, res, next) {

    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        - add chat object to the chat object array
    */

    /* Psuedo code
        //Example of how we can store commands for the command pattern
        var body = req.body;
        Model.storeCommand(body);

        //store chat message
        MovesModel.storeMessage(body, function(err, msg) {
            //send back response after message stored
            if(err) return next(err);
            res.status(201);
        })
    */
  },
  /**
   * @desc get rolled number and based on the 
   * number, change the game state and distribute
   * resources to players and return a response
   * @method rollNumer
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  rollNumber: function(req, res, next) {

    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
          check that the player index matches the current player index
          verify that the number is valid
          if (number is not 7)
            create array of users/ resources
            find resource hexes with same number
            find settlements that border those hexes
              for each settlement
                add one to the user/resource total in the array
            find cities that border those hexes
              for each city
                add two to the user/resource total stored in the array
            for each resource, get total and verify that there are enough resources in bank
              if available
                give cards to players
            change game state to 'playing'
          else
            change state to 'discarding'
    */
  },
  /**
   * @desc gets a rob player request and updates
   * player resources based on the request and returns
   * a response
   * @method robPlayer
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  robPlayer: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
        check that player index matches the current player
        check that location is not the current robber location
        if victim index is valid and is not the current player
          get victim player's resource card hand
          while (card is not stolen)
            get random resource
              if resource total is greater than zero
                set card stolen flag to true
                subtract one resource from victim
                add one resource to current player
              else
                mark resource as being checked
        change state to 'playing'
    */
  },
  /**
   * @desc recieves a finish turn request and updates
   * the turn tracker accordingly
   * @method finishTurn
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  finishTurn: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
   /**
   * @desc receives a request to buy a dev card and
   * checks if the requester is the current player, the
   * requester has enough resources, and the dev card
   * deck is not empty
   * @method buyDevCard
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buyDevCard: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc receives a request to play a year of plenty card and
   * checks to see that the requester is the current player, 
   * the requester has a year of plenty card, that card was not 
   * bought that same turn, and the user hasn't used another
   * dev card that turn and returns a response
   * @method yearOfPlenty
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  yearOfPlenty: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc receives a request to play a road building card and 
   * verifies that the actiono is valid and sends a response
   * @method roadBuilding
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  roadBuilding: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to play a soldier card, validates
   * the request and sends a response after performing the action
   * @method Soldier
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  Soldier: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to play a monopoly card, validates
   * the request and sends a response after performing the action
   * @method Monopoly
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  Monopoly: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to play a monument card, validates
   * the request and sends a response after performing the action
   * @method Monument
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  Monument: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to build a road, validates
   * the request and sends a response after performing the action
   * @method buildRoad
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buildRoad: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to build a settlement, validates
   * the request and sends a response after performing the action
   * @method buildSettlement
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buildSettlement: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to build a city, validates
   * the request and sends a response after performing the action
   * @method buildCity
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  buildCity: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to offer a domestic trade, validates
   * the request and sends a response after performing the action
   * @method offerTrade
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  offerTrade: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to accept a trade, validates
   * the request and sends a response after performing the action
   * @method acceptTrade
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  acceptTrade: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to offer a maritime trade, validates
   * the request and sends a response after performing the action
   * @method maritimeTrade
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  maritimeTrade: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },
  /**
   * @desc gets a request to discard cards, validates
   * the request and sends a response after performing the action
   * @method discardCards
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  discardCards: function(req, res, next) {
    /*
      Things to do:
      1. pull model from request body.
      2. call correct execute method
    */
  },

};

module.exports = MovesController;
