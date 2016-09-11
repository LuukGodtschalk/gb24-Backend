var should = require('should');
var socketioClient = require('socket.io-client');
var Q = require('q');

describe('resolver', function () {

  var port = 80;
  var ioClient;

  before(function (done) {
    ioClient = socketioClient('http://localhost:' + port);
    ioClient.once('connect', done);
  });

  after(function () {
    ioClient.disconnect();
  });

  function getEventData(eventName) {
    var deferred = Q.defer();
    ioClient.emit('subscribe', eventName, function (ack) {
      if (ack.error) {
        deferred.reject(new Error(ack.error));
      } else {
        deferred.resolve(ack.data);
      }
    });
    return deferred.promise;
  }

  it('participants', function () {
    return getEventData('participants').then(function (data) {
      data.should.be.an.Array();
      data.length.should.be.greaterThan(2);
      console.log('    ' + data.length + ' participants in total');
      data.should.matchEach(function (participant) {
        participant.should.have.properties(['bib', 'name', 'category', 'categoryId']);
        participant.bib.should.be.a.Number().greaterThan(0);
        participant.name.should.be.a.String();
        participant.name.length.should.be.greaterThan(0);
        participant.category.should.be.a.String();
        participant.category.length.should.be.greaterThan(0);
        participant.categoryId.should.be.a.Number().greaterThan(0);
      });
    });
  });

  it('participants/:id', function () {
    return getEventData('participants/1').then(function (participant) {
      participant.should.be.an.Object();
      participant.should.have.properties(['bib', 'name', 'category', 'categoryId', 'laps', 'numlaps', 'lastPassing']);
      participant.bib.should.be.a.Number().greaterThan(0);
      participant.name.should.be.a.String();
      participant.name.length.should.be.greaterThan(0);
      participant.category.should.be.a.String();
      participant.category.length.should.be.greaterThan(0);
      participant.categoryId.should.be.a.Number().greaterThan(0);
      participant.laps.should.be.an.Array();
      participant.numlaps.should.be.a.Number().aboveOrEqual(0);
      participant.numlaps.should.equal(participant.laps.length);
    });
  });

  it('ranking/:id', function () {
    return getEventData('ranking/2').then(function (data) {
      data.should.be.an.Array();
      data.length.should.be.greaterThan(2);
      console.log('    ' + data.length + ' participants in ranking');
      data.should.matchEach(function (participant) {
        participant.should.have.properties(['bib', 'name', 'category', 'categoryId']);
        participant.bib.should.be.a.Number().greaterThan(0);
        participant.name.should.be.a.String();
        participant.name.length.should.be.greaterThan(0);
        participant.category.should.be.a.String();
        participant.category.length.should.be.greaterThan(0);
        participant.categoryId.should.be.a.Number().greaterThan(0);
      });
    });
  });

});
