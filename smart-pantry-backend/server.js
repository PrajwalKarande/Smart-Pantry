require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./src/config/database');
const { syncDatabase } = require('./src/models');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const pantryRoutes = require('./src/routes/pantryRoutes');
const mealRoutes = require('./src/routes/mealRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// ═══════════════════════════════════════════
//  MIDDLEWARE
// ═══════════════════════════════════════════

// CORS — Allow React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ═══════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Smart Pantry API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/pantry',     pantryRoutes);
app.use('/api/meals',      mealRoutes);
app.use('/api/categories', categoryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler (must be LAST middleware)
app.use(errorHandler);

// ═══════════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════════

async function startServer() {
  try {
    // 1. Connect to PostgreSQL
    await testConnection();

    // 2. Sync database tables
    await syncDatabase();

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log(`🚀 Smart Pantry API running on port ${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`💚 Health:   http://localhost:${PORT}/api/health`);
      console.log('═══════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();