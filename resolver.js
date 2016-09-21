var Q = require('q');
var Participant = require('./models/participant');
var log = require('./logger');

module.exports = function resolve(event) {
  return Q.promise(function (resolve, reject) {
    var parts = event.split('/');
    var query = {};
    if (parts[0] === 'participants') {
      if (parseInt(parts[1])) {
        query = {bib: parseInt(parts[1])};
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
        Participant.find({}).sort({bib: 1}).exec(function (err, docs) {
          if (err) {
            return reject(new Error(err));
          }
          return resolve(docs);
        });
      }
    } else if (parts[0] === 'ranking' && parseInt(parts[1])) {
      query = {categoryId: parseInt(parts[1])};
      Participant.aggregateQuery(query, function (err, docs) {
        if (err) {
          return reject(new Error(err));
        }
        for (var doc in docs) {
          delete docs[doc]['laps'];
        }
        return resolve(docs);
      });
    } else if (parts[0] === 'rand') {
      return resolve(Math.floor(Math.random() * 1000));
    } else {
      return reject(new Error('Invalid event'));
    }
  });
};
