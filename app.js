'use strict';

var express = require('express'),
    bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();

/////////////////////////////////
// Database Initialization     //
/////////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/catan');

/////////////////////////////////
// Application Middleware      //
/////////////////////////////////
app.use(bodyParser.json({ inflate : true }));
app.use(cookieParser());
require('./routes')(app);

module.exports = app;
