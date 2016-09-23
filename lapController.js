var Passing = require('./models/passing');
var log = require('./logger');

module.exports = function (server) {
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
    Passing.create(doc).fail(function (err) {
      log.error({err: err}, 'Failed to insert passing');
    }).done();
  });
  return;
};
