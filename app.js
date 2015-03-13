'use strict';

var express = require('express'),
    bodyParser = require('body-parser');

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();

/////////////////////////////////
// Application Middleware      //
/////////////////////////////////
app.use(bodyParser.json({ inflate : true }));
require('./routes')(app);

module.exports = app;
