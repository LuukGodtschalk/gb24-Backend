var mongoose = require('mongoose');

var schema = mongoose.Schema({
  chip: String,
  time: Date,
  lap: Number,
  device: String,
  reader: String,
  source: String
});

schema.statics.getLaps = function(passings) {
  //TODO: account for checkpoints
  return passings.length;
}

module.exports = mongoose.model('Passing', schema);
