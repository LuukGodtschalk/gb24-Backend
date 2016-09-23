//require stuff
var socketio = require('socket.io');
var EventController = require('./eventController');
var log = require('./logger');
var toolkit = require('Toolkit-server');
var lapController = require('./lapController');

//Open the db connection
var lapdata = require('./models/db');

//create eventController
var resolver = require('./resolver');
var eventController = new EventController(resolver);

//set options
var port = process.env.PORT || 8080;
var toolkit_port = process.env.TOOLKIT_PORT || 2424;

//initialize web server
var expressServer = require('./expressServer')(resolver, eventController);
var httpServer = require('http').createServer(expressServer);

//bind socket.io server
var io = socketio(httpServer);
eventController.bindIo(io);

setInterval(function () {
  eventController.update('rand');
}, 1000);

//initialize csvReader and Toolkit client
var toolkitServer = toolkit();

//initialize lapController and bind to csvReader and Toolkit client
lapController(toolkitServer);

//bind lapController to webserver and model

//Start Toolkit client
toolkitServer.listen(toolkit_port, function () {
  log.info('Toolkit listening on port ' + toolkit_port);
});

//Start server
httpServer.listen(port, function () {
  log.info('Listening on port ' + port);
});
