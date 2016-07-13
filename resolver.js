var Q = require('q');
var Participant = require('./models/participant');

module.exports = function resolve(event) {
  return Q.promise(function (resolve, reject) {
    var parts = event.split('/');
    if (parts[0] === 'participants') {
      var query = {};
      if (parts[1] !== undefined) {
        query = {bib: parts[1]};
      }
      Participant.aggregateQuery(query, function (err, docs) {
        if (err) {
          return reject(new Error(err));
        }
        if (docs.length === 0) {
          return reject(new Error('No participant found'));
        }
        return resolve(docs[0]);
      });
    } else {
      return reject(new Error('Invalid event'));
    }
  });
};
