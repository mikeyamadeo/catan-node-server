'use strict';

var express = require('express');

var ctrl = require('./util.ctrl');

var router = express.Router();

router.post('/changeLogLevel',        util.sendChat);


module.exports = router;