'use strict';

var _ = require('lodash');

/**
 * Example of getting access to required models:
 *
 * var Model = require('../model');
 * var MovesModel = require('./moves.model');
 */


var UtilController = {
  /** CREATE **/

  /**
   * @desc a request to change the logging level
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
  changeLog: function(req, res, next) {},

};

module.exports = MovesController;
