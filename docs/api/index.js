'use strict'

var express = require('express'),
    router = express.Router(),
    controller = require('./controller.js');

router.get('/data/util', controller.util);
router.get('/data/user', controller.user);
router.get('/data/game', controller.moves);
router.get('/data/games', controller.games);
router.get('/data/moves', controller.game);
router.get('/data', controller.data);
router.get('/view*', controller.view);

module.exports = router;
