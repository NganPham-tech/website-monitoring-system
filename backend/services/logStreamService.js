/**
 * logStreamService.js
 *
 * Manages a pool of SSE (Server-Sent Events) client connections and broadcasts
 * real-time system log lines to all connected Super Admin clients.
 *
 * Design goals:
 *  - Zero memory leaks: the generator interval only runs while clients are
 *    connected; it is cleared automatically when the last client disconnects.
 *  - Each log line is JSON-encoded so the frontend can apply colour-coding by
 *    level without parsing regex.
 *  - Easily swappable: replace _generateMockLog() with a real Message Queue
 *    consumer (Kafka / RabbitMQ) without touching the client-management logic.
 */

// ─── Worker / log metadata ────────────────────────────────────────────────────

const WORKERS = [
    'Golang-Worker-US',
    'Golang-Worker-SG',
    'Golang-Worker-EU',
    'Node-Monitor-SG',
    'Golang-Worker-JP',
];

const LOG_TEMPLATES = [
    { level: 'INFO', msg: 'Batch ping completed successfully. Processed {n} URLs in {t}s.' },
    { level: 'INFO', msg: 'Health check passed. All {n} endpoints responding within SLA.' },
    { level: 'INFO', msg: 'Queue drained. Memory usage: {m}MB / 4096MB.' },
    { level: 'INFO', msg: 'Worker reconnected after network blip. Queue recovered ({n} jobs).' },
    { level: 'INFO', msg: 'SSL certificate renewal completed for monitor #{n}.' },
    { level: 'INFO', msg: 'Scheduled maintenance window started. Suppressing alerts for {n} monitors.' },
    { level: 'INFO', msg: 'Incident auto-resolved. Monitor #{n} transitioned back to UP.' },
    { level: 'WARN', msg: 'Latency spike detected on endpoint group #{n}. p99={t}ms. Retrying...' },
    { level: 'WARN', msg: 'Autoscale trigger: CPU at {p}%. Requesting additional worker slot.' },
    { level: 'WARN', msg: 'Worker {w} response time elevated ({t}ms). Investigating...' },
    { level: 'ERROR', msg: 'Connection timeout to monitor #{n}. Flagging as DOWN. Retry in {t}s.' },
    { level: 'ERROR', msg: 'Worker {w} lost heartbeat. Failover initiated to secondary node.' },
];

/** Fill placeholder tokens with random numbers */
const fillTemplate = (msg) =>
    msg
        .replace('{n}', Math.floor(Math.random() * 50_000))
        .replace('{t}', (Math.random() * 10 + 0.5).toFixed(1))
        .replace('{m}', Math.floor(Math.random() * 3000 + 512))
        .replace('{p}', Math.floor(Math.random() * 40 + 60))
        .replace('{w}', WORKERS[Math.floor(Math.random() * WORKERS.length)]);

const _generateMockLog = () => {
    const worker = WORKERS[Math.floor(Math.random() * WORKERS.length)];
    const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
    const ts = new Date().toTimeString().slice(0, 8);

    return {
        raw: `[${ts}] [${tpl.level}] [${worker}] ${fillTemplate(tpl.msg)}`,
        level: tpl.level,
    };
};

// ─── SSE write helper ─────────────────────────────────────────────────────────

/**
 * Write a single SSE "data" frame to a response stream.
 * Each message is JSON-encoded to carry structured metadata (level, etc.).
 */
const _writeEvent = (res, payload) => {
    try {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
    } catch { /* client already gone */ }
};

// ─── Client pool ──────────────────────────────────────────────────────────────

/** @type {Set<import('express').Response>} */
const _clients = new Set();

/** @type {NodeJS.Timeout | null} */
let _intervalId = null;

const LOG_INTERVAL_MS = 1_500; // emit one log line every 1.5 s

const _startGenerator = () => {
    if (_intervalId !== null) return; // already running
    _intervalId = setInterval(() => {
        if (_clients.size === 0) {
            // Safety valve: stop if pool is accidentally empty
            _stopGenerator();
            return;
        }
        const payload = _generateMockLog();
        for (const res of _clients) {
            _writeEvent(res, payload);
        }
    }, LOG_INTERVAL_MS);
};

const _stopGenerator = () => {
    if (_intervalId === null) return;
    clearInterval(_intervalId);
    _intervalId = null;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Register a new SSE client response object.
 * The caller is responsible for having already set the SSE headers.
 *
 * @param {import('express').Response} res
 */
exports.addClient = (res) => {
    _clients.add(res);
    if (_clients.size === 1) {
        _startGenerator();
    }
};

/**
 * Deregister an SSE client (called on req 'close' event).
 *
 * @param {import('express').Response} res
 */
exports.removeClient = (res) => {
    _clients.delete(res);
    if (_clients.size === 0) {
        _stopGenerator();
    }
};

/** Expose current client count (useful for health checks / monitoring). */
exports.clientCount = () => _clients.size;
