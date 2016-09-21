//require stuff
var socketio = require('socket.io');
var EventController = require('./eventController');
var log = require('./logger');

//Open the db connection
var lapdata = require('./models/db');

//create eventController
var resolver = require('./resolver');
var eventController = new EventController(resolver);

//set options
var port = process.env.PORT || 8080;

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

//initialize lapController and bind to csvReader and Toolkit client

//bind lapController to webserver and model

//Start Toolkit client

//Start server
httpServer.listen(port, function () {
  log.info('Listening on port ' + port);
});
