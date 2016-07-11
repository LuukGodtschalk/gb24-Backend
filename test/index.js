var should = require('should');
process.env.NODE_ENV = 'test';
var lapdata = require('../models/db');

describe('models', function() {
  describe('Participant', function() {
    var Participant = require('../models/participant');
    before(function(done) {
      Participant.remove({}, done);
    });
    describe('#create()', function() {
      it('creates a participant', function(done) {
        var p = {
          bib: 123,
          name: 'Test user',
          category: 'Twelve',
          chip: 'DF234234'
        }
        Participant.create(p, function(err, doc) {
          should.ifError(err);
          doc.should.have.properties(p);
          done();
        });
      });
    });
    describe('#find()', function() {
      function testFind(query, properties, done) {
        Participant.find(query, function(err, docs) {
          should.ifError(err);
          docs.should.matchEach(function(doc) {
            doc.should.have.properties(query);
            doc.should.have.properties(properties);
          });
          done();
        });
      }
      it('finds a participant by id', function(done) {
        testFind({bib: 123}, {category: 'Twelve'}, done);
      });
    });
    describe('#aggregate()', function() {
      it('gives an overview of all participants', function(done) {
        Participant.aggregateQuery({}, function(err, participants) {
          should.ifError(err);
          participants.should.be.an.Array();
          participants.length.should.be.above(0);
          participants.should.matchEach(function(participant) {
            participant.bib.should.be.a.Number();
            participant.name.should.be.a.String();
            participant.numlaps.should.be.a.Number();
          });
          done();
        });
      });
    });
  });

  describe('Passing', function() {
    var Passing = require('../models/passing');
    before(function(done) {
      Passing.remove({}, done);
    });
    describe('#create()', function() {
      it('creates a passing', function(done) {
        var p = {
          chip: 'TST23235',
          time: new Date()
        }
        Passing.create(p, function(err, doc) {
          should.ifError(err);
          doc.should.have.properties(p);
          done();
        });
      });
    });
    describe('#getLaps()', function() {
      it('counts the number of laps from an array of passings', function() {
        Passing.getLaps([]).should.equal(0);
        var passings = [
          {device: 1, reader: 1},
          {device: 1, reader: 2}
        ];
        Passing.getLaps(passings).should.equal(2);
      });
    });
  });
});
