const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const { WEB_URL } = require('../config');

let io;

function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: WEB_URL,
      credentials: true
    }
  });

  const submissions = io.of('/submissions');

  submissions.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const payload = verifyAccessToken(token);
    if (!payload) return next(new Error('Invalid token'));
    socket.userId = payload.id;
    next();
  });

  submissions.on('connection', (socket) => {
    socket.join(socket.userId);
    socket.on('disconnect', () => {});
  });

  return io;
}

function emitToUser(userId, event, data) {
  if (!io) return;
  io.of('/submissions').to(userId).emit(event, data);
}

module.exports = { initSocketServer, emitToUser };
