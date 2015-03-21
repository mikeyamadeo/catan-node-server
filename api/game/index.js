'use strict';

var express = require('express');

var ctrl = require('./game.controller');

var router = express.Router();

router.get('/model',        ctrl.model);
router.get('/commands',     ctrl.getCommands);
router.get('/listAI',       ctrl.listAI);
router.post('/reset',      	ctrl.reset);
router.post('/commands',    ctrl.postCommands);
router.post('/addAI',  			ctrl.addAI);

module.exports = router;
