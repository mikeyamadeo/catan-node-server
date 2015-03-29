'use strict';

var express = require('express'),
    cookies = require('cookies'),
    bodyParser = require('body-parser');

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();
app.use(cookies.express());

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
