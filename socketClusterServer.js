var socketClusterServer = require('socketcluster-server');

module.exports = function (httpServer) {
  var scServer = socketClusterServer.attach(httpServer);

  scServer.on('connection', function (socket) {

    socket.on('ping', function (data, res) {
      res(null, 'pong');
    });
  });

  scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function (req, next) {
    next('Unauthorized');
  });

  return scServer;
};
