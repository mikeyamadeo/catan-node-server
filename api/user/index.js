'use strict'

var express = require('express'),
    controller = require('./user.controller'),
    router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);

module.exports = router;
