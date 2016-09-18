var express = require('express');
var bodyParser = require('body-parser');
var csvParse = require('csv-parse');
var Q = require('q');

var basicAuth = require('basic-auth');
var auth = require('./auth');
var Participant = require('../models/participant');

var router = express.Router();

router.use(function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  auth.authenticate(user.name, user.pass).then(function() {
    next();
  })
  .fail(function() {
    return unauthorized(res);
  });
});

router.get('/', function (req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

router.post('/participants', bodyParser.urlencoded({extended: false, limit: '1mb'}), function (req, res) {

  parseCSV(req.body.data)
  .then(function (rows) {
    if (req.body.replace === 'true') {
      console.log('delete everything');
      return Participant.remove({}).exec().then(function (response) {
        console.log(response.result);
        return rows;
      });
    }
    return Q(rows);
  }).then(function (rows) {
    console.log('insert everything');
    console.log(rows[0]);
    return Participant.insertMany(rows).then(function (response) {
      console.log(response.result);
      return rows;
    });
  }).then(function (rows) {
    var result = {
      operation: ((req.body.replace === 'true') ? 'update' : 'add'),
      status: 'success',
      rows: rows.length
    };
    console.log(result);
    res.send(result).end();
    return result;
  }).catch(function (err) {
    console.error(err);
    return res.status(500).json(err).end();
  }).done();

  function parseCSV(csv) {
    var deferred = Q.defer();
    csvParse(csv, {
      delimiter: ';',
      escape: '\\',
      columns: true
    }, function (err, output) {
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve(output);
    });

    return deferred.promise;
  }
});

module.exports = router;
