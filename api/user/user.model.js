'use strict'

var UserModel = {
    /**
    * @desc retrieves a specified user from the database
    * @method getUser
    * @param {string} username - name of user to retrieve
    * @param {function} callback - callback
    */
    getUser : function(username, callback) {},
    /**
    * @desc adds a user to the database
    * @method addUser
    * @param {string} username - username of new user
    * @param {string} password - password of new user
    * @param {function} callback - callback
    */
    addUser : function(username, password, callback) {}
};

module.exports = UserModel

