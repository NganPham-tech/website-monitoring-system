const jwt = require('jsonwebtoken');
const infraService = require('../services/infraService');
const logStreamService = require('../services/logStreamService');

// ─── GET /api/infrastructure/macro-stats ─────────────────────────────────────

exports.getMacroStats = async (req, res) => {
    const data = await infraService.getMacroStats();
    res.status(200).json({ success: true, data });
};

// ─── GET /api/infrastructure/nodes ───────────────────────────────────────────

exports.getNodes = async (req, res) => {
    const data = await infraService.getNodes();
    res.status(200).json({ success: true, data });
};

// ─── POST /api/infrastructure/nodes/deploy ────────────────────────────────────

exports.deployNode = async (req, res) => {
    const { region } = req.body;
    if (!region || typeof region !== 'string' || region.trim() === '') {
        return res.status(400).json({ success: false, message: 'Trường "region" là bắt buộc.' });
    }

    const result = await infraService.deployNode(region.trim());

    res.status(202).json({
        success: true,
        message: result.message,
        data: { nodeId: result.nodeId, region: result.region },
    });
};

// ─── GET /api/infrastructure/logs/stream (SSE) ───────────────────────────────
//
// This endpoint is intentionally NOT protected by the standard authMiddleware +
// adminMiddleware stack because EventSource (browser API) cannot attach custom
// headers. Instead we perform JWT verification manually from the query string.
//

exports.streamLogs = (req, res) => {
    // ── Manual auth: token supplied as ?token=<jwt> ───────────────────────────
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    } catch {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
    }

    if (decoded.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden: Admin access required.' });
    }

    // ── SSE handshake ─────────────────────────────────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering if behind proxy
    res.flushHeaders();

    // Send a heartbeat comment immediately so the browser marks the connection open
    res.write(': connected\n\n');

    // ── Register in log stream pool ───────────────────────────────────────────
    logStreamService.addClient(res);

    // ── Clean up on disconnect ────────────────────────────────────────────────
    req.on('close', () => {
        logStreamService.removeClient(res);
    });
};
