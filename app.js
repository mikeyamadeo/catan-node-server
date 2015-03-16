'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    port = 1337;

/////////////////////////////////
// Application Initialization  //
/////////////////////////////////
var app = express();

/////////////////////////////////
// Application Middleware      //
/////////////////////////////////
app.use(bodyParser.json({ inflate : true }));
require('./routes')(app);

app.listen(port);
module.exports = app;
