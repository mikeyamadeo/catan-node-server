var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : String,
    password : String
});

var User = mongoose.model('User', UserSchema);

UserSchema.methods.comparePasswords = function(password) {
    return password === this.password;
}

UserSchema.statics.findByUsername = function(username, callback) {
    return this.find({ username : username }, callback);
};

UserSchema.statics.addNewUser = function(username, password, callback) {
    var newUser = new User({
        username : username,
        password : password
    });
    return newUser.save(callback);
}

module.exports = User
