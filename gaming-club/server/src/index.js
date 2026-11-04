import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initSocket } from './config/socket.js';
import { setupSocketHandlers } from './socket/socketHandler.js';
import { syncLiveStationStatuses } from './services/collisionService.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Route imports
import stationRoutes from './routes/stationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.io initialization
const io = initSocket(server, CLIENT_URL);
setupSocketHandlers(io);

// Middlewares
app.use(cors({
  origin: true, // Allow frontend origin dynamically
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CyberClub Booking Engine API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/stations', stationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/admin', adminRoutes);

// Unified Error Handler
app.use(errorHandler);

// Background worker to auto-expire past reservations every 30 seconds
setInterval(async () => {
  try {
    await syncLiveStationStatuses();
  } catch (err) {
    console.error('[Auto Sync Error]:', err.message);
  }
}, 30000);

server.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 CyberClub Server is running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📡 WebSocket ready on port ${PORT}`);
  console.log(`=======================================================`);

  // Initial sync on startup
  try {
    await syncLiveStationStatuses();
    console.log(`✅ Initial station live status synchronized successfully.`);
  } catch (e) {
    console.warn(`[Startup Notice] DB sync pending migration: ${e.message}`);
  }
});
