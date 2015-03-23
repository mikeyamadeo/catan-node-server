'use strict'

var userController = require('../api/user/user.controller.js');

module.exports = function(swagger) {
    var login = {
        'spec' : {
            'description' : "POST /user/login Validates the player's credentials, and logs them in to the server (i.e., sets their catan.user HTTP cookie)",
            'path' : 'user/login',
            'notes' : 'logs in a user',
            'summary' : 'logs in a user -- summary',
            'method' : 'POST'
        },
        'action' : function(req, res) {
            return userController.log(req, res);
        }
    };
    
    swagger.addPost(login);
t}
