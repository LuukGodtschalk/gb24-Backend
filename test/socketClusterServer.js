var should = require('should');

describe('socketClusterServer', function () {
  var socketClusterClient = require('socketcluster-client');
  var httpServer = require('http').createServer();
  var instance = require('../socketClusterServer')(httpServer);
  var options = {
    hostname: '127.0.0.1',
    port: 83495
  };

  before(function (done) {
    httpServer.listen(options.port, done);
  });

  after(function () {
    httpServer.close();
  });

  var socket;
  beforeEach(function (done) {
    socket = socketClusterClient.connect(options);

    socket.once('connect', function () {
      done();
    });
  });

  afterEach(function () {
    socket.disconnect();
  });

  it('accepts connections', function (done) {
    socket.state.should.equal(socket.OPEN);
    done();
  });

  it('responds to pongs', function (done) {
    socket.emit('ping', {}, function (err) {
      done(err);
    });
  });

  it('receives data from subscriptions', function (done) {
    var testData = 'Chimichanga';
    var channel = socket.subscribe('testChannel');
    channel.watch(function (data) {
      data.should.equal(testData);
      done();
    });
    channel.on('subscribe', function () {
      instance.exchange.publish('testChannel', testData);
    });
  });

  it('blocks external publications', function (done) {
    socket.publish('external_channel', {foo: 'bar'}, function (err) {
      err.should.not.equal(undefined);
      done();
    });
  });
});
