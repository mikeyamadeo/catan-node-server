'use strict';

var express = require('express'),
    bodyParser = require('body-parser');

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();

/////////////////////////////////
// Database Initialization     //
/////////////////////////////////
var mongoose = requires('mongoose');
mongoose.connect('mongodb://localhost/catan');

/////////////////////////////////
// Application Middleware      //
/////////////////////////////////
app.use(bodyParser.json({ inflate : true }));
require('./routes')(app);

module.exports = app;
