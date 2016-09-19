//require stuff
var socketio = require('socket.io');
var EventController = require('./eventController');
var log = require('./logger');

//Open the db connection
var lapdata = require('./models/db');

var resolver = require('./resolver');

//set options
var port = process.env.PORT || 8080;

//initialize web server
var expressServer = require('./expressServer')(resolver);
var httpServer = require('http').createServer(expressServer);

//bind socket.io server
var io = socketio(httpServer);
var eventController = new EventController(io, resolver);

setInterval(function () {
  eventController.update('rand');
}, 1000);

//initialize csvReader and Toolkit client

//initialize lapController and bind to csvReader and Toolkit client

//bind lapController to webserver and model

//Start Toolkit client

//Start server
httpServer.listen(port, function () {
  log.info('Listening on port ' + port);
});
