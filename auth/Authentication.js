var model = require('./../api/user/user.model.js');
var model = require('./../api/games/games.model.js');

var authenticate = function(req, res){
	//logic
	var route = extract(req.baseUrl);

  	if (route = "user") {

  	} else if (route = "games") {
		validateUser()
	} else {
		validateUser()
		//validateGame()
	}

}

var validateUser = function() {

	model.validateUser(req.cookies.name, req.cookies.password, function(error, success){
		if (success == false) {
			res.status(403).send('Unauthorized');
		}
	});
}

var validateGame = function() {
	model.
}

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

var extract = function(Url) {
	var parts = Url.split("/");
	return parts[parts.length - 1];
} 

//build register cookie maker function
//build login cookie maker function

module.exports.authenticate = authenticate;