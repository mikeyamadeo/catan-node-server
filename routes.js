'use strict';

var auth = require('./auth/Authentication.js');
var HttpError = require('http-error').HttpError;
var movesVerifier = require('./api/moves/moves.verification.js');

var auth = require('./auth/Authentication');

module.exports = function(app) {
  ///////////////////////////
  // Authentication Routes //
  ///////////////////////////
  app.use('/games/join', auth.validateUser);
  app.use('/moves', auth.validateUser);
  app.use('/moves', auth.validateGame);
  app.use('/game', auth.validateUser);
  app.use('/game', auth.validateGame);

  //app.use('/moves', movesVerifier.validateGameFull);
  /////////////////////////
  // Define routes here //
  /////////////////////////
  app.use('/docs/api', require('./docs/api'));
  app.use('/moves', require('./api/moves'));
  app.use('/user', require('./api/user'));
  app.use('/games', require('./api/games'));
  app.use('/game', require('./api/game'));
  app.use('/util', require('./api/util'));

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
    console.log(err);
    /** Only log the stack trace if error status code is greater than 404 */
    res.status(err.code || err.status || 500).json({
      error: "I'm a jerk for not working"

    });
  });
};
