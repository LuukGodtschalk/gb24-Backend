var express = require('express');
var morgan = require('morgan');

module.exports = function (httpServer) {

  var app = express();

  app.use(morgan('dev'));

  app.use(express.static('www/'));

  return app;
};
