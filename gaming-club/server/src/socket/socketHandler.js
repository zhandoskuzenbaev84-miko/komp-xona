export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    // Client joins floor plan room
    socket.on('join:hall', (hallType) => {
      socket.join(`hall:${hallType}`);
      console.log(`[Socket] Client ${socket.id} joined hall:${hallType}`);
    });

    socket.on('leave:hall', (hallType) => {
      socket.leave(`hall:${hallType}`);
    });

    // Client requests live heartbeat sync
    socket.on('request:sync', () => {
      socket.emit('sync:ack', { timestamp: new Date() });
    });
  });
};
