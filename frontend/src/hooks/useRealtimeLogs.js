import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/api$/, '');

const LOG_WORKERS = [
    'Golang-Worker-US',
    'Golang-Worker-SG',
    'Golang-Worker-EU',
    'Node-Monitor-SG',
    'Golang-Worker-JP',
];

const LOG_LEVELS = ['INFO', 'INFO', 'INFO', 'INFO', 'WARN', 'ERROR'];

const LOG_MESSAGES = [
    'Batch ping completed successfully. Processed 12,000 URLs in 4.2s.',
    'Health check passed. All nodes responding within SLA.',
    'Queue drained. Memory usage: 1.2GB / 4GB.',
    'Latency spike detected on endpoint group #47. Retrying...',
    'Connection timeout to monitor #882. Flagging as DOWN.',
    'SSL certificate renewal completed for monitor #214.',
    'Autoscale trigger: CPU at 85%. Requesting additional worker.',
    'Incident resolved automatically. Monitor #519 back to UP.',
    'Scheduled maintenance window started. Suppressing alerts.',
    'Worker reconnected after network blip. Queue recovered.',
];

const generateMockLog = () => {
    const worker = LOG_WORKERS[Math.floor(Math.random() * LOG_WORKERS.length)];
    const level = LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)];
    const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
    const now = new Date();
    const time = now.toTimeString().slice(0, 8);
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        raw: `[${time}] [${level}] [${worker}] ${msg}`,
        level,
    };
};

const MAX_LINES = 500;
const MOCK_INTERVAL_MS = 2000;

/**
 * Custom hook that manages a real-time log stream via SSE, with a mock
 * fallback when the server endpoint is unavailable.
 *
 * Exposes: { logs, paused, pause, resume, clear }
 */
export function useRealtimeLogs() {
    const [logs, setLogs] = useState([]);
    const [paused, setPaused] = useState(false);

    // Use a ref so the SSE handler always reads the latest paused state
    // without needing to re-subscribe the EventSource.
    const pausedRef = useRef(false);
    const bufferRef = useRef([]);

    // Stable function — captured once, reads pausedRef to decide whether to
    // append immediately or buffer.
    const addLine = useCallback((entry) => {
        if (pausedRef.current) {
            bufferRef.current.push(entry);
        } else {
            setLogs((prev) => {
                const next = [...prev, entry];
                return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
            });
        }
    }, []);

    useEffect(() => {
        let es = null;
        let fallbackTimer = null;

        const startFallback = () => {
            // Seed a few lines immediately so the terminal isn't empty.
            const seed = Array.from({ length: 5 }, generateMockLog);
            setLogs(seed);
            fallbackTimer = setInterval(() => {
                addLine(generateMockLog());
            }, MOCK_INTERVAL_MS);
        };

        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            const token = user?.token ?? '';
            const qs = token ? `?token=${encodeURIComponent(token)}` : '';
            const sseUrl = `${BASE_URL}/api/infrastructure/logs/stream${qs}`;

            es = new EventSource(sseUrl, { withCredentials: true });

            es.onmessage = (event) => {
                let entry;
                try {
                    const parsed = JSON.parse(event.data);
                    entry = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        raw: parsed.raw ?? String(parsed),
                        level: parsed.level ?? 'INFO',
                    };
                } catch {
                    entry = {
                        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                        raw: event.data,
                        level: 'INFO',
                    };
                }
                addLine(entry);
            };

            es.onerror = () => {
                es.close();
                es = null;
                startFallback();
            };
        } catch {
            startFallback();
        }

        return () => {
            es?.close();
            clearInterval(fallbackTimer);
        };
    }, [addLine]); // addLine is stable — effect runs only on mount

    const pause = useCallback(() => {
        pausedRef.current = true;
        setPaused(true);
    }, []);

    const resume = useCallback(() => {
        pausedRef.current = false;
        setPaused(false);
        if (bufferRef.current.length > 0) {
            const flushed = bufferRef.current.splice(0);
            setLogs((prev) => {
                const next = [...prev, ...flushed];
                return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
            });
        }
    }, []);

    const clear = useCallback(() => {
        setLogs([]);
        bufferRef.current = [];
    }, []);

    return { logs, paused, pause, resume, clear };
}
