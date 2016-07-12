var connect = require('connect');
var morgan = require('morgan');

module.exports = function(httpServer) {

  var app = connect();

  app.use(morgan('dev'))

  return app;
}
