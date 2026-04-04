const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const {
    getMacroStats,
    getNodes,
    deployNode,
    streamLogs,
} = require('../controllers/infraController');

// All HTTP endpoints require a valid JWT (authMiddleware) AND admin role (adminMiddleware).
// The SSE stream endpoint handles its own auth via query-param token (see infraController).

router.get('/macro-stats', authMiddleware, adminMiddleware, getMacroStats);
router.get('/nodes', authMiddleware, adminMiddleware, getNodes);
router.post('/nodes/deploy', authMiddleware, adminMiddleware, deployNode);

// SSE endpoint — auth is performed inside the controller
router.get('/logs/stream', streamLogs);

module.exports = router;
