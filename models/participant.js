var mongoose = require('mongoose');
var Passing = require('./passing.js');

var schema = mongoose.Schema({
  bib: Number,
  name: String,
  category: String,
  categoryId: Number,
  chip: String
});

schema.statics.aggregateQuery = function (query, cb) {
  this.aggregate([
    {$match: query},
    {$lookup: {
      from: 'passings',
      localField: 'chip',
      foreignField: 'chip',
      as: 'laps'
    }}
  ], function (err, aggregate) {
    if (err) {
      return cb(err);
    }
    aggregate = aggregate.map(function (data) {
      data.numlaps = Passing.getLaps(data.laps);
      data.lastPassing = data.numlaps ? data.laps[0].time : null;
      return data;
    }).sort(function (a, b) {
      if (a.numlaps < b.numlaps) {
        return 1;
      } else if (a.numlaps > b.numlaps) {
        return -1;
      } else {
        if (a.numlaps > 0) {
          return a.lastPassing.valueOf() - b.lastPassing.valueOf();
        } else {
          return a.bib - b.bib;
        }
      }
    });
    return cb(null, aggregate);
  });
};

module.exports = mongoose.model('Participant', schema);
