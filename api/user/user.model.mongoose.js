var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username : { type : String, unique : true },
    password : String
});

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

var User = mongoose.model('User', UserSchema);

module.exports = User
