import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Import routes and models
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import trainRoutes from './routes/trains.js';
import bookingRoutes from './routes/bookings.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(morgan('combined'));
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CORS_ORIGIN
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make `io` available to all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Railway Reservation API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Ensure admin user exists (only credential that can be admin)
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '10051100';

async function ensureAdminExists() {
  // Demote any user with admin role who is not the official admin
  await User.updateMany(
    { role: 'admin', email: { $ne: ADMIN_EMAIL } },
    { $set: { role: 'passenger' } }
  );

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const admin = new User({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone: '0000000000',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created (admin@gmail.com)');
  } else if (existingAdmin.role !== 'admin') {
    // Ensure admin@gmail.com always has admin role
    await User.findByIdAndUpdate(existingAdmin._id, { role: 'admin' });
  }
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await ensureAdminExists();
    server.listen(PORT, () => {
      console.log(`Server with WebSocket support running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });