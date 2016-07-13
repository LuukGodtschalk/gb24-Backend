var should = require('should');
var socketioClient = require('socket.io-client');
var Q = require('q');

describe('resolver', function () {

  var port = 8000;
  var ioClient;

  beforeEach(function (done) {
    ioClient = socketioClient('http://localhost:' + port);
    ioClient.on('connect', done);
  });

  function subscribe(ioClient, event) {
    var deferred = Q.defer();
    ioClient.emit('subscribe', event, function (ack) {
      if (ack.error) {
        deferred.reject(new Error(ack.error));
      } else {
        deferred.resolve(ack);
      }
    });
    return deferred.promise;
  }

  function unsubscribe(ioClient, event) {
    var deferred = Q.defer();
    ioClient.emit('unsubscribe', event, function (ack) {
      if (ack.error) {
        deferred.reject(new Error(ack.error));
      } else {
        deferred.resolve(ack);
      }
    });
    return deferred.promise;
  }

  it('maps participants', function (done) {
    subscribe(ioClient, 'participants').then(function (ack) {
      console.log(ack);
      done();
    }).done();
  });
});
