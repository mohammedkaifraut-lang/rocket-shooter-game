import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Search, FileCode2, Layers, Cpu, Monitor } from 'lucide-react';
import { ROCKET_SHOOTER_PYTHON_CODE } from '../data/pythonCode';

export function CodeViewer() {
  const [filter, setFilter] = useState<'all' | 'backend' | 'frontend' | 'database'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const displayCode = useMemo(() => {
    let raw = ROCKET_SHOOTER_PYTHON_CODE;
    if (filter === 'database') {
      const match = raw.match(/# --- DATABASE CLASS ---[\s\S]*?(?=# --- OOP HIERARCHY ---)/);
      return match ? match[0].trim() : raw;
    }
    if (filter === 'backend') {
      const match = raw.match(/# \[BACKEND SECTION\][\s\S]*?(?=# \[FRONTEND SECTION\])/);
      return match ? match[0].trim() : raw;
    }
    if (filter === 'frontend') {
      const match = raw.match(/# \[FRONTEND SECTION\][\s\S]*/);
      return match ? match[0].trim() : raw;
    }
    return raw;
  }, [filter]);

  const lines = useMemo(() => {
    return displayCode.split('\n');
  }, [displayCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([ROCKET_SHOOTER_PYTHON_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rocket_shooter.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-4">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              rocket_shooter.py
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Single File • Ready to Run
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean, beginner-friendly Pygame code with OOP inheritance, polymorphism & SQLite.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download .py File
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Complete File (All)
          </button>
          <button
            onClick={() => setFilter('backend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              filter === 'backend'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Backend (Logic & OOP)
          </button>
          <button
            onClick={() => setFilter('frontend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              filter === 'frontend'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Frontend (Pygame Display)
          </button>
          <button
            onClick={() => setFilter('database')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              filter === 'database'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Database Class (SQLite)
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search code (e.g. update, boss)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Code Editor Styled Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Fake window titlebar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="text-slate-400 text-xs ml-2">rocket_shooter.py — Python 3</span>
          </div>
          <span className="text-[11px] text-slate-500">{lines.length} lines</span>
        </div>

        {/* Code Content */}
        <div className="max-h-[640px] overflow-y-auto p-4 select-text">
          <pre className="text-slate-300 leading-relaxed font-mono">
            {lines.map((line, idx) => {
              const isMatch = searchQuery.trim() && line.toLowerCase().includes(searchQuery.toLowerCase());
              // Light syntax highlighting simulation via regex
              let lineClass = 'text-slate-300';
              if (line.trim().startsWith('#')) {
                lineClass = 'text-emerald-400/90 italic';
              } else if (line.trim().startsWith('class ') || line.trim().startsWith('def ')) {
                lineClass = 'text-blue-400 font-semibold';
              } else if (line.trim().startsWith('import ') || line.trim().startsWith('from ')) {
                lineClass = 'text-pink-400';
              } else if (line.trim().startsWith('super()')) {
                lineClass = 'text-amber-300';
              }

              return (
                <div
                  key={idx}
                  className={`table-row hover:bg-slate-900/60 transition ${
                    isMatch ? 'bg-amber-500/20 text-amber-200 font-semibold' : ''
                  }`}
                >
                  <span className="table-cell pr-6 text-right select-none text-slate-600 text-[11px] w-12">
                    {idx + 1}
                  </span>
                  <span className={`table-cell whitespace-pre ${lineClass}`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
