'use strict'

var UserModel = require('./user.model'),
    auth = require('../../auth');

var UserController = {
	/**
   * @desc a request for logging in a user
   * @method login
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
    login : function(req, res, next) {
        console.log(req.body);
        res.send("Login");
    },
	
	/**
   * @desc request to register new user
   * @method register
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
    register : function(req, res, next) {
        console.log(req.body);
        res.send("Register");
    }
}

module.exports = UserController;
