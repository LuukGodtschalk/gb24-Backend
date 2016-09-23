var Q = require('q');
var Passing = require('./models/passing');
var Participant = require('./models/participant');
var log = require('./logger');

module.exports = function (server, eventController) {
  server.on('passing', function (passing) {
    log.info({passing: passing}, 'Received passing');
    var doc = {
      chip: passing.chip,
      time: passing.time,
      lap: passing.lap,
      device: passing.device,
      reader: passing.reader,
      source: 'toolkit'
    };
    Passing.create(doc).then(function () {
      return Participant.findOne({chip: doc.chip}).exec();
    }).then(function (participant) {
      eventController.update('participants/' + participant.bib);
      eventController.update('ranking/' + participant.categoryId);
    }).catch(function (err) {
      log.error({err: err}, 'Failed to insert passing');
    }).done();
  });

  server.on('protocolError', function (msg) {
    log.warn({message: msg}, 'protocolError');
  });
  return;
};
