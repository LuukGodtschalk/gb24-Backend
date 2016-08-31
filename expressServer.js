var express = require('express');
var morgan = require('morgan');

var webroot = '../www/';

module.exports = function (httpServer) {

  var app = express();

  app.use(morgan('dev'));

  app.use(express.static(webroot));

  return app;
};
