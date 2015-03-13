'use strict'

var UserModel = require('./user.model'),
    auth = require('../../auth');

var UserController = {
	/**
   * @desc a request for logging in a user
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
    login : function(req, res, next) {
        console.log(req.body);
        res.send("Login");
    },
	
	/**
   * @desc request to register new user
   * @arg {object} req - http request object
   * @arg {object} res - http response object
   * @arg {function} next - next command
   */
    register : function(req, res, next) {
        console.log(req.body);
        res.send("Register");
    }
}

module.exports = UserController;
