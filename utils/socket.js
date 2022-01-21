const ErrorResponse = require("./errorResponse");
let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      return new ErrorResponse(`Socket.io not initialized!`);
    }
    return io;
  },
};
