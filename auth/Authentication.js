var userModel = require('./../api/user/user.model.js');
var gamesModel = require('./../api/games/games.model.js');

module.exports = {
    validateUser : function(req, res, next) {
        var cookies = req.cookies;
        console.log(cookies);
        if (cookies['catan.user']) {
            var username = cookies['catan.user'].name;
            var password = cookies['catan.user'].password;
            var id = cookies['catan.user'].id;
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
        var username = cookies['catan.user'].name;
        var password = cookies['catan.user'].password;
        var id = cookies['catan.user'].id;
        var gameId = cookies['catan.game'];
        gamesModel.isPlayerInGame(id, username, function(err, valid) {
            if (err || !valid) {
                res.status(403).send('Unauthorized');
            }
            req.user = {
                name : username,
                password : password,
                id : id
            };
            req.game = gameId;
            return next();
        }); 
    }
};

