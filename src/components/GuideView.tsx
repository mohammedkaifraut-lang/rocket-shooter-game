import React, { useState } from 'react';
import { Terminal, Copy, Check, Monitor, Cpu, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { FRONTEND_EXPLANATION, BACKEND_EXPLANATION, RUN_STEPS } from '../data/projectGuide';

export function GuideView() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Setup, Execution & Architecture Guide
            </h2>
            <p className="text-xs text-slate-400">
              Clear steps to install dependencies, run the game, and explain the architecture to your teacher.
            </p>
          </div>
        </div>
      </div>

      {/* Installation & Execution Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          How to Install and Run (Step-by-Step)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RUN_STEPS.map((step) => (
            <div key={step.step} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                  <span className="font-semibold text-xs text-white">{step.title}</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between my-2 text-cyan-300">
                  <span>{step.cmd}</span>
                  <button
                    onClick={() => handleCopy(step.cmd)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title="Copy command"
                  >
                    {copiedCmd === step.cmd ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-1">{step.note}</p>
            </div>
          ))}
        </div>

        {/* Quick note on virtual environments */}
        <div className="mt-4 p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl text-xs text-blue-300 flex items-start gap-2.5">
          <span className="font-bold text-blue-400 text-base leading-none">ℹ</span>
          <div>
            <strong>Optional (Best Practice):</strong> You can create a clean virtual environment first using:
            <code className="mx-1 px-1.5 py-0.5 bg-blue-900/50 rounded font-mono text-cyan-200">python -m venv venv</code>
            followed by
            <code className="mx-1 px-1.5 py-0.5 bg-blue-900/50 rounded font-mono text-cyan-200">source venv/bin/activate</code> (Mac/Linux) or
            <code className="mx-1 px-1.5 py-0.5 bg-blue-900/50 rounded font-mono text-cyan-200">venv\Scripts\activate</code> (Windows).
          </div>
        </div>
      </div>

      {/* Frontend vs Backend in Easy Words */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frontend Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{FRONTEND_EXPLANATION.title}</h3>
                <span className="text-[11px] text-cyan-400 font-mono">Window, Graphics & User Input</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              "{FRONTEND_EXPLANATION.summary}"
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              {FRONTEND_EXPLANATION.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Located in: <code>[FRONTEND SECTION]</code> in rocket_shooter.py
          </div>
        </div>

        {/* Backend Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-4">
              <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{BACKEND_EXPLANATION.title}</h3>
                <span className="text-[11px] text-purple-400 font-mono">Logic, Physics & SQLite Database</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium mb-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              "{BACKEND_EXPLANATION.summary}"
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              {BACKEND_EXPLANATION.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Located in: <code>[BACKEND SECTION]</code> in rocket_shooter.py
          </div>
        </div>
      </div>

      {/* Common Troubles & Quick Fixes */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Common Errors & 10-Second Fixes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">ModuleNotFoundError: 'pygame'</span>
            <p className="text-slate-400 text-[11px]">
              Pygame is not installed in your active Python environment.
            </p>
            <div className="mt-2 font-mono text-emerald-400 text-[11px] bg-slate-900 p-1.5 rounded">
              pip install pygame
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">'pip' is not recognized</span>
            <p className="text-slate-400 text-[11px]">
              Python was installed without checking "Add python.exe to PATH" on Windows.
            </p>
            <div className="mt-2 font-mono text-emerald-400 text-[11px] bg-slate-900 p-1.5 rounded">
              python -m pip install pygame
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-amber-500/40">
            <span className="text-amber-400 font-bold block mb-1">Python 3.14: Failed to build 'pygame'</span>
            <p className="text-slate-400 text-[11px]">
              Python 3.14 is a pre-release version without pre-compiled wheels for legacy pygame. Use pygame-ce instead!
            </p>
            <div className="mt-2 font-mono text-emerald-400 text-[11px] bg-slate-900 p-1.5 rounded flex items-center justify-between">
              <span>pip install pygame-ce</span>
            </div>
            <p className="text-[10px] text-cyan-300 mt-1">
              ✓ 100% compatible drop-in replacement (uses the same `import pygame`)
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">Database 'scores.db' missing?</span>
            <p className="text-slate-400 text-[11px]">
              Normal! The Database class automatically creates `scores.db` and the table on its first launch.
            </p>
            <div className="mt-2 font-mono text-cyan-300 text-[11px] bg-slate-900 p-1.5 rounded">
              CREATE TABLE IF NOT EXISTS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
