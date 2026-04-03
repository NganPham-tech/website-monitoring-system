require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const passport = require('../backend/config/passport');
const errorHandler = require('../backend/middlewares/errorHandler');
const authRoutes = require('../backend/routes/authRoutes');
const monitorRoutes = require('../backend/routes/monitorRoutes');

const app = express();

// ================== SECURITY MIDDLEWARES ==================
app.use(helmet()); 
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Cho phép nhận gửi cookies (cần thiết cho auth qua HttpOnly cookie)
  })
);

// ================== PARSERS MIDDLEWARES ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Để server có thể đọc parse cookies từ browser gửi lên

// ================== INIT PASSPORT ==================
app.use(passport.initialize());

// ================== ROUTES DEFINITION ==================
app.use('/api/auth', authRoutes);
app.use('/api/monitors', monitorRoutes);

// Fallback 404 Route
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

// ================== GLOBAL ERROR HANDLER ==================
app.use(errorHandler);

module.exports = app;
