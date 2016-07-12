var socketClusterServer = require('socketcluster-server');

module.exports = function (httpServer) {
  var scServer = socketClusterServer.attach(httpServer);

  scServer.on('connection', function () {
    console.log('scServer connection');
  });

  return scServer;
};
