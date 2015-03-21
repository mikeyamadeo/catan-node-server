'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    swagger = require('swagger-node-express');

var cookieParser = require('cookie-parser');

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();

/////////////////////////////////
// Swagger Imp Initialization  //
/////////////////////////////////
swagger.setAppHandler(app);
//var swaggerModels = require('./swagger/models');
//swagger.addModels(swaggerModels);

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
