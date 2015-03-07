'use strict';

var express = require('express');

var controller = require('./moves.controller');

var router = express.Router();

router.post('/Road_Building', controller.roadBuilding);


module.exports = router;