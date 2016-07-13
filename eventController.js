var Q = require('q');

function EventController(io, resolver) {

  var self = this;
  self.resolve = resolver;
  self.io = io;

  io.on('connection', function (socket) {
    socket.on('subscribe', function (event, ack) {
      Q.when(self.resolve(event), function (data) {
        if (data instanceof Error) throw data;
        socket.join(event);
        return ack({
          event: event,
          data: data
        });
      }).fail(function (err) {
        return ack({
          event: event,
          error: err.message || 'Unknow error'
        });
      });
    });
  });

}

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
