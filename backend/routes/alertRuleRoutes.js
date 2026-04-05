const express = require('express');
const router = express.Router();
const alertRuleController = require('../controllers/alertRuleController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả endpoints đều yêu cầu Authentication
router.use(authMiddleware);

// GET /api/alert-rules: Retrieve current alert configuration for logged in user
router.get('/', alertRuleController.getSettings);

// PUT /api/alert-rules: Update the alert configuration
router.put('/', alertRuleController.updateSettings);

module.exports = router;
