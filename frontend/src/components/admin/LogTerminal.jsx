import React, { memo, useRef, useEffect } from 'react';
import { useSystemLogs, useClearSystemLogs } from '../../hooks/useAdmin';
import { RefreshCw, Download, Trash2, Loader2 } from 'lucide-react';

const LogTerminal = () => {
  const { data: logs, isLoading, refetch, isFetching } = useSystemLogs();
  const clearLogsMut = useClearSystemLogs();
  const terminalEndRef = useRef(null);

  // Auto-scroll to bottom like a real terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleDownload = () => {
    if (!logs) return;
    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_audit_${new Date().toISOString().slice(0,10)}.log`;
    a.click();
  };

  const parseLogLine = (logString) => {
    // Basic parser for "[2026-01-25 14:29:45] [INFO] message..."
    const match = logString.match(/^(\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\])\s(\[.*?\])\s(.*)/);
    if (match) {
      const typeColor = match[2].includes('ERROR') ? 'text-red-400' : match[2].includes('WARN') ? 'text-yellow-400' : 'text-sky-400';
      return (
        <div className="font-mono text-sm leading-6 break-words">
          <span className="text-zinc-500">{match[1]}</span>{' '}
          <span className={typeColor}>{match[2]}</span>{' '}
          <span className="text-neutral-300">{match[3]}</span>
        </div>
      );
    }
    return <div className="font-mono text-sm leading-6 text-neutral-300 break-words">{logString}</div>;
  };

  return (
    <div className="w-full bg-stone-900 rounded-xl overflow-hidden mt-8 flex flex-col">
      {/* Terminal Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-700">
        <h2 className="text-2xl font-normal font-inter text-white">System Log</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => refetch()} 
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-black text-xs font-normal font-inter rounded hover:bg-slate-300 transition"
          >
            <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-black text-xs font-normal font-inter rounded hover:bg-slate-300 transition"
          >
            <Download className="w-3 h-3" /> Download Logs
          </button>
          <button 
            onClick={() => clearLogsMut.mutate()}
            disabled={clearLogsMut.isLoading}
            className="flex items-center gap-2 px-4 py-1.5 bg-red-500 text-white text-xs font-bold font-inter rounded hover:bg-red-600 transition disabled:opacity-50"
          >
            {clearLogsMut.isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Trash2 className="w-3 h-3" />} Clear Log
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar bg-black/20">
        {isLoading ? (
          <div className="flex justify-center items-center h-full text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-zinc-500 font-mono text-sm">No recent logs found.</div>
        ) : (
          <div className="flex flex-col">
            {logs.map((log, i) => React.cloneElement(parseLogLine(log), { key: i }))}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(LogTerminal);
