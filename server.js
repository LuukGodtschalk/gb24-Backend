var server = require('./index.js');

var port = process.env.PORT || 80;

server.listen(port, function() {
  console.log('Listening on port ' + port);
});
