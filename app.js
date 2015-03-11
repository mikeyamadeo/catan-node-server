'use strict';

var express = require('express');


/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();
require('./routes')(app);

/** @type {ExpressApplication} expose the express app */
module.exports = app;
