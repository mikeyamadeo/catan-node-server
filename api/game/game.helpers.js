module.exports = {
	locationIsEqual: function(loc1, loc2) {
		return (loc1.x === loc2.x && loc1.y === loc2.y);
	},
	getPlayerFromPlayers: function(players, id) {
		var index = -1;
		players.some(function(player, i) {
			index = i;
			return (player.id === id);
		});

		return players[index];
	},
	addToPlayersResources: function(type, amount, resources) {
		resources[type] += amount;
	}
}