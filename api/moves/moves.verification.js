var movesModel = require('./moves.model');
var gamesModel = require('./../games/games.model');
var gameModel = require('./../game/game.model');

module.exports = {

    validatePlayersTurn : function(req, res, next) {

        movesModel.currentPlayer(req.game, function (err, currPlayer) {
            if (err) {
                console.log(err); 
                return res.status(500).send();
            }
            if (!currPlayer === undefined || currPlayer === null) {
                console.log(currPlayer);
                console.log("currentPlayer returned undefined"); 
                return res.status(500).send();
            }
            if (currPlayer !== req.body.playerIndex) {
                console.log(currPlayer, req.body.playerIndex);
                return res.status(403).send("Not this player's turn");
            }
            return next();
        });
    },

    validateGameFull : function (req, res, next) {
        console.log("verifying game full");
        gamesModel.isGameAvailable(req.game, function (err, result) {
            if (err) {
                console.log(err); 
                return res.status(500).send();
            }
            if (result === true) {
                return res.status(403).send("This game is not full");
            }
            return next();
        });
    }
    
};
