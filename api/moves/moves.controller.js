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
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  sendChat: function(req, res, next) {
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

  rollNumber: function(req, res, next) {},
  robPlayer: function(req, res, next) {},
  finishTurn: function(req, res, next) {},
  buyDevCard: function(req, res, next) {},
  yearOfPlenty: function(req, res, next) {},
  roadBuilding: function(req, res, next) {},
  Soldier: function(req, res, next) {},
  Monopoly: function(req, res, next) {},
  Monument: function(req, res, next) {},
  buildRoad: function(req, res, next) {},
  buildSettlement: function(req, res, next) {},
  buildCity: function(req, res, next) {},
  offerTrade: function(req, res, next) {},
  acceptTrade: function(req, res, next) {},
  maritimeTrade: function(req, res, next) {},
  discardCards: function(req, res, next) {},
  roadBuilding: function(req, res, next) {},

};

module.exports = MovesController;
