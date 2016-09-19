var mongoose = require('mongoose');
var log = require('../logger');

mongoose.Promise = require('q').Promise;
var database = process.env.NODE_ENV === 'test' ? 'test' : 'lapdata';
mongoose.connect('mongodb://localhost/' + database);

var db = mongoose.connection;
db.on('error', function(err) {
  log.error(err, 'mongoose_connection_error');
});
db.on('open', function() {
  log.info({database: database}, 'connected to mongodb');
});
