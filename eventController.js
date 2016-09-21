var Q = require('q');
var log = require('./logger');

function EventController(resolver) {

  this.resolve = resolver;
  return this;
}

EventController.prototype.bindIo = function (io) {
  var self = this;
  self.io = io;

  return io.on('connection', function (socket) {
    var socketLog = log.child({socket_id: socket.id});
    socketLog.info({req: socket.request}, 'socket_connect');
    socket.on('subscribe', function (event, ack) {
      Q.when(self.resolve(event), function (data) {
        if (data instanceof Error) throw data;
        socket.join(event);
        socketLog.info({eventName: event}, 'socket_subscribe');
        return ack({
          event: event,
          data: data
        });
      }).fail(function (err) {
        socketLog.error({eventName: event, err: err}, 'socket_subscribe_failed');
        return ack({
          event: event,
          error: err.message || 'Unknow error'
        });
      });
    });

    socket.on('unsubscribe', function (event, ack) {
      socketLog.info({eventName: event}, 'socket_unsubscribe');
      socket.leave(event);
      return ack({
        event: event
      });
    });
  });
};

EventController.prototype.getEvents = function () {
  var events = [];
  var rooms = this.io.sockets.adapter.rooms;
  if (rooms) {
    for (var room in rooms) {
      if (!rooms[room].hasOwnProperty(room)) {
        availableRooms.push(room);
      }
    }
  }
  return availableRooms;
};

EventController.prototype.update = function (event) {
  var self = this;
  return Q.when(self.resolve(event), function (data) {
    self.io.to(event).emit('update', {event: event, data: data});
  });
};

EventController.prototype.setResolver = function (resolver) {
  this.resolve = resolver;
};

module.exports = EventController;
