var should = require('should');

var socketio = require('socket.io');
var socketioClient = require('socket.io-client');
var Q = require('q');

describe('eventController', function () {

  var port = 3489;
  var io = socketio();
  var ioClient;

  before(function () {
    io.listen(port);
  });

  after(function () {
    io.close();
  });

  function promiseResolver(event) {
    return Q.promise(function (resolve, reject) {
      if (event === 'invalid_event') {
        return reject(new Error('Invalid event'));
      }
      return resolve('data_' + event);
    });
  }

  function directResolver(event) {
    if (event === 'invalid_event') {
      return new Error('Invalid event');
    }
    return 'data_' + event;
  }

  var resolve = directResolver;
  var EventController = require('../eventController');
  var instance = new EventController(resolve);
  instance.bindIo(io);

  function useResolver(resolver) {
    resolve = resolver;
    instance.setResolver(resolver);
  }

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

  beforeEach(function (done) {
    ioClient = socketioClient('http://localhost:' + port);
    ioClient.once('connect', done);
  });

  afterEach(function () {
    ioClient.close();
  });

  it('allows clients to subscribe to events', function (done) {
    subscribe(ioClient, 'testevent').then(function (ack) {
      ack.event.should.equal('testevent');
      ack.data.should.equal(resolve('testevent'));
      done();
    }).done();
  });

  it('distributes updates', function (done) {
    ioClient.once('update', function (update) {
      update.event.should.equal('updateEvent');
      update.data.should.equal(resolve('updateEvent'));
      done();
    });
    subscribe(ioClient, 'updateEvent').then(function () {
      instance.update('updateEvent');
    }).done();
  });

  it('handles errors', function () {
    return subscribe(ioClient, 'invalid_event').should.be.rejectedWith('Invalid event');
  });

  it('allows clients to unsubscribe', function (done) {
    var eventName = 'unsubscribeEvent';
    subscribe(ioClient, eventName).then(function (ack) {
      ioClient.once('update', function (update) {
        throw new Error('Received update after unsubscribing');
      });
      return unsubscribe(ioClient, eventName);
    }).then(function (ack) {
      ack.event.should.equal(eventName);
      instance.update(eventName);
      return ack;
    }).delay(100).then(function () {
      done();
    }).done();
  });

});
