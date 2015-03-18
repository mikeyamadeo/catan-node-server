var model = require('User.Model');

var authenticate = {
	//logic
	var route = extract(req.baseUrl);

  	if (req = "user")

	else if (route = "games") {
		validateUser()
	} else {
		validateUser()
		validateGame()
	}

}

var validateUser = function() {

	var user = model.getUser(req.cookies.name);
	if (user.)

}

var extract = function(Url) {
	var parts = Url.split("/");
	return parts[parts.size - 1];
} 

module.exports = authenticate;