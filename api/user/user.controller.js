'use strict'

var model = require('./user.model'),
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
        var body = req.body;
        model.validateUser(body.username, body.password, function(err, valid) {
            if (err) return callback(err);
            if (valid) {
                console.log("Logged in");
            } else {
                console.log("Invalid Crudentials");
            }
            res.send("Login needs to be implemented");
            /**
             * Authentication:
             * - none required
             * - sets user cookie
             *
             * Request type: POST
             * 
             * Schema:
             * {
             *    "username": "string",
             *    "password": "string"
             *  }
             * POST CONDITIONS:
             * Logs in a user
             */
            });
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
        /**
         * Authentication:
         * - none required
         * - sets user cookie
         *
         * Request type: POST
         * Schema:
         * {
         *    "username": "string",
         *    "password": "string"
         *  }
         *
         * PRE CONDITIONS: 
         * Verify that username is available
         * Verify that password is legit
         *
         * POST CONDITIONS:
         * Logs in user
         */
    }
}

module.exports = UserController;
