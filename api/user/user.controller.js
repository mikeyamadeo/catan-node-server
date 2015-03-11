'use strict'

var UserModel = require('./user.model'),
    auth = require('../../auth');

var UserController = {
    login : function(req, res, next) {
        console.log(req.body);
        res.send("Login");
    },

    register : function(req, res, next) {
        console.log(req.body);
        res.send("Register");
    }
}

module.exports = UserController;
