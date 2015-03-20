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
   * @method changeLog
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
  changeLog: function(req, res, next) {},

};

module.exports = UtilController;
