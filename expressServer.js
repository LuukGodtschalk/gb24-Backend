var express = require('express');
var morgan = require('morgan');
var Q = require('q');
var log = require('./logger');

var webroot = '../gb24-Frontend/src/www/';

module.exports = function (resolver) {

  var app = express();

  app.use(morgan('combined', {stream: require('fs').createWriteStream('./access.log', {flags: 'a'})}));
  app.use(function(req, res, next) {
    log.info({req: req}, 'express_request');
    next();
  });
  app.use('/admin', require('./admin'));

  app.use('/api', function (req, res) {
    var event = req.path;
    if (event.indexOf('/') === 0) {
      event = event.substring(1);
    }
    Q.when(resolver(event), function (data) {
      res.json(data);
    }).fail(function (err) {
      res.status(400).send({error: err});
    });
  });

  app.use(express.static(webroot));

  return app;
};
