const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Shield all routes underneath with verification and admin check
router.use(authMiddleware);
router.use(adminMiddleware);

// Infrastructure Stats
router.get('/stats', adminController.getStats);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser); // using PUT (or PATCH)

// System Configuration
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.updateSettings);

// Server Health
router.get('/health', adminController.getServerHealth);

// System Logs
router.get('/logs', adminController.getLogs);
router.get('/logs/download', adminController.streamLogs);
router.delete('/logs', adminController.clearLogs);

module.exports = router;
