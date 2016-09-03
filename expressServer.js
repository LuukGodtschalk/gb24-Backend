var express = require('express');
var morgan = require('morgan');
var Q = require('q');

var webroot = '../www/';

module.exports = function (resolver) {

  var app = express();

  app.use(morgan('dev'));

  app.use('/api', function (req, res) {
    var event = req.path;
    if (event.indexOf('/') === 0){
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
