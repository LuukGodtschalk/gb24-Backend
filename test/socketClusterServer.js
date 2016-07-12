var should = require('should');

describe('socketClusterServer', function(){
  var socketClusterClient = require('socketcluster-client');
  it('accepts connections', function(done) {
    var options = {
      hostname: '127.0.0.1',
      port: 8080
    }
    var socket = socketClusterClient.connect(options);
    //console.log(socket);
    socket.on('connect', function () {
        console.log('CONNECTED');
        done();
    });
  });
});
