var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    _ = require('lodash');

var usernameValidator = function(username) {
    return username.length >= 3 && username.length <= 7;
};

var passwordValidator = function(password) {
    if (password.length < 5) return false;
    if (/^[a-z0-9_-]+$/i.test(password)) return true;
    return false
};

var UserSchema = new Schema({
    username : { type : String, unique : true, validate : usernameValidator,
                 require : true },
    password : { type : String, validate : passwordValidator, require : true }
});

UserSchema.methods.comparePasswords = function(password) {
    return password === this.password;
}

UserSchema.statics.findByUsername = function(username, callback) {
    return this.findOne({ username : username }, callback);
};

UserSchema.statics.addNewUser = function(username, password, callback) {
    var newUser = new User({
        username : username,
        password : password
    });
    return newUser.save(callback);
}

var connection = mongoose.createConnection("mongodb://localhost/catan");

autoIncrement.initialize(connection);
UserSchema.plugin(autoIncrement.plugin, 'User');

var User = mongoose.model('User', UserSchema);

module.exports = User
