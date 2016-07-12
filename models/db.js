var mongoose = require('mongoose');
var database = process.env.NODE_ENV === 'test' ? 'test' : 'lapdata';
mongoose.connect('mongodb://localhost/' + database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to database \'' + database + '\'');
});
