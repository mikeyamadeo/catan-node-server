'use strict'

var _ = require('lodash');

module.exports = {
    gameToModel : function(game) {
        game = _.omit(game._doc, '__v');
        return _.omit(game._doc, '_id');
    }
};
