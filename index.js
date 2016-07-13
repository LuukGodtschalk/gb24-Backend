//require stuff
var socketio = require('socket.io');

//Open the db connection
var lapdata = require('./models/db');

//set options
var port = process.env.PORT || 8080;

//initialize web server
var expressServer = require('./expressServer')();
var httpServer = require('http').createServer(expressServer);

//bind socketClusterServer
var scServer = require('./socketClusterServer')(httpServer);

//bind socket.io server
var io = socketio(httpServer);

var resolver = require('./resolver');
var eventController = require('./eventController')(io, resolver);

//initialize csvReader and Toolkit client

//initialize lapController and bind to csvReader and Toolkit client

//bind lapController to webserver and model

//Start Toolkit client

//Start server
httpServer.listen(port, function () {
  console.log('Listening on port ' + port);
});
