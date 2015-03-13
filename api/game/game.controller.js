'use strict';

var _ = require('lodash');

/**
 * Example of getting access to required models:
 *
 * var Model = require('../model');
 * var MovesModel = require('./moves.model');
 */


var GameController = {
  /** CREATE **/

  /**
   * @desc store a chat message & return a response
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  model: function(req, res, next) {
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

  getCommands: function(req, res, next) {},
  listAI: function(req, res, next) {},
  reset: function(req, res, next) {},
  postCommands: function(req, res, next) {},
  addAI: function(req, res, next) {},
};

module.exports = MovesController;
