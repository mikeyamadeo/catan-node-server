'use strict';

var HttpError = require('http-error').HttpError;

// var auth = require('./auth/auth.middleware');

module.exports = function(app) {
  ///////////////////////////
  // Authentication Routes //
  ///////////////////////////
  // app.use(auth.authenticate());
  // app.use('/auth', require('./auth'));

  /////////////////////////
  // Define routes here //
  /////////////////////////
  app.use('/moves', require('./api/moves'));
  app.use('/user', require('./api/user'));

  /////////////////////////
  // Application Routes //
  /////////////////////////
  app.get('/', function(req, res) {
    res.send('The application is alive homie!');
  });

  /////////////////////
  // Catch-all Route //
  /////////////////////
  app.all('*', function(req, res, next) {
    /** Pass to error handling */
    next(new HttpError('invalid endpoint', 404));
  });

  //////////////////////////////
  // Application Error Catch //
  //////////////////////////////
  // jshint unused: false
  app.use(function(err, req, res, done) {
    /** @type {HttpError} fallback to a 404 Not Found */
    if (!err) err = new HttpError('invalid endpoint', 404);

    /** Only log the stack trace if error status code is greater than 404 */
    res.status(err.code || err.status || 500).json({
      error: "I'm a jerk for not working"

    });
  });
};
