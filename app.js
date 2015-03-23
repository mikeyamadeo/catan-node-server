'use strict';

var express = require('express'),
    bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();

/////////////////////////////////
// Swagger Imp Initialization  //
/////////////////////////////////
/*var swagger = require('swagger-node-express').createNew(app);
var swaggerModels = require('./swagger/models');
swagger.addModels(swaggerModels);
require('./swagger/specs')(swagger);
swagger.configureSwaggerPaths('http://localhost/swagger', '0.1');*/

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
