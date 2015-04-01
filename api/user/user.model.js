'use strict'

var model = require('./user.model.mongoose');

var UserModel = {
    /**
    * @desc retrieves a specified user from the database
    * @method getUserByUsername
    * @param {string} username - name of user to retrieve
    * @param {function} callback - callback(err, user)
    */
    getUserByUsername : function(username, callback) {
        console.log("i'm here");
        model.findByUsername(username, function(err, user) {
            if (err) return callback(err);
            return callback(null, user);
        }); 
    },
    /**
    * @desc retrieves user from the database by id
    * @method getUserById
    * @param {number} id - id of the user to retrieve
    * @param {function} callback - callback(err, user)
    */
    getUserById : function(id, callback) {
        model.findById(id, function(err, user) {
            if (err) return callback(err);
            return callback(null, user);
        });
    },
    /**
    * @desc adds a user to the database
    * @method addUser
    * @param {string} username - username of new user
    * @param {string} password - password of new user
    * @param {function} callback - callback(err, user)
    */
    addUser : function(username, password, callback) {
        model.addNewUser(username, password, function(err, user) {
            console.log("Model error: ", err);
            if (err) return callback(err);
            return callback(null, user);
        });
    },
    /**
    * @desc determines if the given username corresponds with the given password
    * @method validateUser
    * @param {string} username - username of user
    * @param {string} password - password of user
    * @param {function} callback - callback(err, user)
    */
    validateUser : function(username, password, callback) {
        model.findByUsername(username, function(err, user) {
            if (err) return callback(err);
            if (user) {
                if (user.comparePasswords(password)) {
                    return callback(null, user);
                } else {
                    return callback(null, null);
                }
            } else {
                return callback(null, null);
            }
        });
    }
};

module.exports = UserModel

