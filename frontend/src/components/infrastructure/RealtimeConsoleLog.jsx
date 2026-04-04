import React, { useEffect, useRef } from 'react';
import { useRealtimeLogs } from '../../hooks/useRealtimeLogs';

// ─── Log level → color mapping ────────────────────────────────────────────────

const LEVEL_COLORS = {
    INFO: 'text-green-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400',
    DEBUG: 'text-blue-400',
};

// Parse the level from a raw log line, e.g. "[20:55:10] [INFO] [Worker] ..."
const extractLevel = (raw) => {
    const m = raw.match(/\[(INFO|WARN|ERROR|DEBUG)\]/);
    return m ? m[1] : 'INFO';
};

// ─── Component ────────────────────────────────────────────────────────────────

const RealtimeConsoleLog = () => {
    const { logs, paused, pause, resume, clear } = useRealtimeLogs();
    const scrollRef = useRef(null);

    // Auto-scroll to bottom whenever new lines arrive and we are not paused.
    useEffect(() => {
        if (!paused && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs.length, paused]);

    return (
        <div className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 overflow-hidden">
            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
                {/* macOS-style traffic-light dots + paused badge */}
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    {paused && (
                        <span className="ml-3 text-xs text-orange-500 font-semibold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                            PAUSED — {'{'}buffering{'}'}
                        </span>
                    )}
                </div>

                {/* Controls — order from design: resume · pause · clear */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={resume}
                        disabled={!paused}
                        className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 px-5 py-1.5 text-xl font-normal font-['Segoe_UI'] text-black hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        resume
                    </button>
                    <button
                        onClick={pause}
                        disabled={paused}
                        className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 px-5 py-1.5 text-xl font-normal font-['Segoe_UI'] text-black hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        pause
                    </button>
                    <button
                        onClick={clear}
                        className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 px-5 py-1.5 text-xl font-normal font-['Segoe_UI'] text-black hover:bg-gray-50 transition"
                    >
                        clear
                    </button>
                </div>
            </div>

            {/* ── Terminal body ─────────────────────────────────────────────── */}
            <div
                ref={scrollRef}
                className="bg-gray-950 h-[641px] overflow-y-auto p-4 space-y-px"
            >
                {logs.length === 0 && (
                    <div className="text-gray-600 text-sm font-mono">
                        Đang kết nối tới log stream...
                    </div>
                )}
                {logs.map((entry) => {
                    const level = extractLevel(entry.raw);
                    const color = LEVEL_COLORS[level] ?? 'text-gray-300';
                    return (
                        <div
                            key={entry.id}
                            className={`font-mono text-base leading-relaxed whitespace-pre-wrap break-all ${color}`}
                        >
                            {entry.raw}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RealtimeConsoleLog;
