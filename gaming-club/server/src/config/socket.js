import { Server } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer, clientUrl) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: clientUrl || '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return ioInstance;
};

export const broadcastStationReserved = (data) => {
  if (ioInstance) {
    ioInstance.emit('station:reserved', data);
  }
};

export const broadcastStationReleased = (data) => {
  if (ioInstance) {
    ioInstance.emit('station:released', data);
  }
};

export const broadcastStationStatusUpdated = (data) => {
  if (ioInstance) {
    ioInstance.emit('station:status_updated', data);
  }
};

export const broadcastReservationCreated = (data) => {
  if (ioInstance) {
    ioInstance.emit('reservation:created', data);
  }
};

export const broadcastReservationCancelled = (data) => {
  if (ioInstance) {
    ioInstance.emit('reservation:cancelled', data);
  }
};
