//require stuff

//set options
var port = process.env.PORT || 8080;

//initialize web server
var connectServer = require('./connectServer')();
var httpServer = require('http').createServer(connectServer);

var serveStatic = require('serve-static');
connectServer.use(serveStatic('www/', {maxAge: '1 hour'}));

//bind socketClusterServer
var scServer = require('./socketClusterServer')(httpServer);

//initialize csvReader and Toolkit client

//initialize lapController and bind to csvReader and Toolkit client

//bind lapController to webserver and model

//Start Toolkit client

//Start server
httpServer.listen(port, function () {
  console.log('Listening on port ' + port);
});
