'use strict'

var model = require('./user.model.mongoose');

var UserModel = {
    /**
    * @desc retrieves a specified user from the database
    * @method getUser
    * @param {string} username - name of user to retrieve
    * @param {function} callback - callback(err, user)
    */
    getUser : function(username, callback) {
        model.findByUsername(username, function(err, user) {
            if (err) callback(err);
            return callback(null, user);
        }); 
    },
    /**
    * @desc adds a user to the database
    * @method addUser
    * @param {string} username - username of new user
    * @param {string} password - password of new user
    * @param {function} callback - callback(err, boolean)
    */
    addUser : function(username, password, callback) {
        model.addNewUser(username, password, function(err, added) {
            if (err) callback(err);
            return callback(null, added);
        });
    },
    /**
    * @desc determines if the given username corresponds with the given password
    * @method validateUser
    * @param {string} username - username of user
    * @param {string} password - password of user
    * @param {function} callback - callback(err, boolean)
    */
    validateUser : function(username, password, callback) {
        model.findByUsername(username, function(err, user) {
            if (err) callback(err);
            if (user) {
                return callback(null, user.comparePasswords(password));
            } else {
                return callback(null, false);
            }
        });
    }    
};

module.exports = UserModel

