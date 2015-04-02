var _ = require('lodash');

module.exports = {
	locationIsEqual: function(loc1, loc2) {
		return (loc1.x === loc2.x && loc1.y === loc2.y);
	},
	getPlayerFromPlayers: function(players, index) {
		return players[index];
	},
	addToPlayersResources: function(type, amount, resources) {
		resources[type] += amount;
	},
	resourceIsAvailable: function(bank, type, amount) {
		return bank[type] >= amount;
	},
	fillArrayWithValue: function(n, value) {
		var n = (n >= 0) ? n : 0;
    var arr = Array.apply(null, Array(n));
    return arr.map(function (x, i) { return value });
    },
    addToResourceChanges: function(type, amount, playerIndex, resourceChangeArray) {
        resourceChangeArray[playerIndex].resourceMap[type] += amount;
    }, 
    countResources : function(resources) {
        var total = 0;
        _.forOwn(resources, function(value, key) {
            if (!isNaN(value)) {
                total += value;
            }
        });
        return total;
    }
}
