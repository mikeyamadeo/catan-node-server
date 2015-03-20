'use strict';

var express = require('express');

var ctrl = require('./games.controller');

var router = express.Router();

router.get('/list',        ctrl.list);
router.post('/create',      ctrl.create);
router.post('/join',       ctrl.join);
router.post('/save',      ctrl.save);
router.post('/load',      ctrl.load);


module.exports = router;
