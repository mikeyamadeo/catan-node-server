'use strict';

var http = require('http');
var express = require('express');
var port = 8085;

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();
require('./routes')(app);

var server = http.createServer(app);

server.listen(port);
/** @type {ExpressApplication} expose the express app */
module.exports = app;