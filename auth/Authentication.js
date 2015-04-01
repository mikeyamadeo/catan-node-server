var userModel = require('./../api/user/user.model.js');
var gamesModel = require('./../api/games/games.model.js');
var Cookies = require('cookies');

module.exports = {
    validateUser : function(req, res, next) {

        var cookies = new Cookies(req, res);
        if (cookies.get('catan.user')) {
            var userCookie = JSON.parse(decodeURI(cookies.get('catan.user')));
            var username = userCookie.name;
            var password = userCookie.password;
            var id = userCookie.playerID;
            userModel.validateUser(username, password, function(error, success){
                if (success == false) {
                    return res.status(403).send('Unauthorized');
                }
                req.user = {
                    name : username,
                    password : password,
                    id : id
                };
                return next();
            }); 
        } else {
            return res.status(403).send('Unauthorized');
        }
    },

    validateGame : function(req, res, next) {
        var cookies = req.cookies;
        if (cookies.get('catan.user') && cookies.get('catan.game')) {
            var userCookie = JSON.parse(decodeURI(cookies.get('catan.user')));
            var username = userCookie.name;
            var password = userCookie.password;
            var id = userCookie.playerID;
            var gameId = cookies.get('catan.game');
            gamesModel.isPlayerInGame(gameId, username, function(err, valid) {
                if (err || !valid) {
                    return res.status(403).send('Unauthorized');
                }
                req.user = {
                    name : username,
                    password : password,
                    id : id
                };
                req.game = gameId;
                console.log("going next " + req.url);
                return next();
            });
        } else {
            return res.status(403).send('Unauthorized'); 
        }
    }
};

