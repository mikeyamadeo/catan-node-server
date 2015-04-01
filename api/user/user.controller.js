'use strict'

var model = require('./user.model'),
    Cookies = require('cookies'),
    auth = require('../../auth'),
    _ = require('lodash');

var UserController = {
	/**
   * @desc a request for logging in a user
   * @method login
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
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
    login : function(req, res, next) {
        console.login("tried to login")
        var body = req.body;
        model.validateUser(body.username, body.password, function(err, user) {
            if (err) return callback(err);
            if (user) {
                var cookies = new Cookies(req, res);
                var encodedCookie = encodeURI(JSON.stringify({
                    name : user.username,
                    password : user.password,
                    playerID : user._id
                }));
                cookies.set('catan.user', encodedCookie);
                return res.send("Success");
            } else {
                return res.send("login failed");
            }
        });
    },
	/**
   * @desc request to register new user
   * @method register
   * @param {object} req - http request object
   * @param {object} res - http response object
   * @param {function} next - next command
   */
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
    register : function(req, res, next) {
        console.log("Tried to register");
        var body = req.body;
        model.addUser(body.username, body.password, function(err, user) {
            if (err) console.log(err);
            if (user) {
                var cleanUser = {
                    name : user.username,
                    password : user.password,
                    id : user._id
                };
                var cookies = new Cookies(req, res);
                var encodedUser = encodeURI(JSON.stringify(cleanUser));
                cookies.set('catan.user', encodedUser);
                return res.send("Success");
            } else {
                return res.status(403).send("Register failed");
            }
        });
    }
};

module.exports = UserController;
