var mongoose = require('mongoose');
var Passing = require('./passing.js');

var schema = mongoose.Schema({
  bib: Number,
  name: String,
  category: String,
  chip: String
});

schema.statics.aggregateQuery = function (query, cb) {
  this.aggregate([
    {$match: query},
    {$lookup: {
      from: 'laps',
      localField: 'chip',
      foreignField: 'chip',
      as: 'laps'
    }},
    {$first: {}},
    {$sort: {'laps.time': 1}}
  ], function (err, aggregate) {
    if (err) {
      return cb(err);
    }
    aggregate = aggregate.map(function (data) {
      data.numlaps = Passing.getLaps(data.laps);
      data.lastPassing = data.numlaps ? data.laps[0].time : null;
      return data;
    });
    return cb(null, aggregate);
  });
};

module.exports = mongoose.model('Participant', schema);
