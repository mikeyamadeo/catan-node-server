'use strict'

var command = require('../game/game.command.mongoose');

var MovesCommand = {
    addCommand: function(gameId, params) {
    	command.findOne({id:gameId}, function(err, state) {
            if (err) {
                console.error(err);
            }
            if (state) {
            	console.log(state)
        		state.addCommand({type:params.type, command: params});
                state.save();
            }
        });

    }
}

module.exports = MovesCommand;  
