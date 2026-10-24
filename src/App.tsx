/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayableGame } from './components/PlayableGame';
import { CodeAndOopCore } from './components/CodeAndOopCore';
import { GuideView } from './components/GuideView';
import {
  Gamepad2,
  GitFork,
  BookOpen,
  Rocket
} from 'lucide-react';

export default function App() {
  // Exactly 3 clean modules
  const [activeTab, setActiveTab] = useState<'game' | 'code-oop' | 'guide'>('game');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Mobile-First Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-slate-950 shrink-0">
              <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                  Rocket Shooter
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold hidden xs:inline">
                  Pygame
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Python OOP & SQLite Mini Project
              </p>
            </div>
          </div>
        </div>

        {/* 3 Mobile-First Main Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-2 sm:px-6">
          <nav className="grid grid-cols-3 gap-1 pb-1 text-xs">
            {/* Tab 1 */}
            <button
              onClick={() => setActiveTab('game')}
              className={`py-2 px-1 rounded-t-xl font-bold flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${
                activeTab === 'game'
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/80 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">1. Playable Game</span>
            </button>

            {/* Tab 2 (Merged Modules 2 & 3: Code + OOP Core) */}
            <button
              onClick={() => setActiveTab('code-oop')}
              className={`py-2 px-1 rounded-t-xl font-bold flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${
                activeTab === 'code-oop'
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/80 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GitFork className="w-4 h-4 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">2. Code & Architecture</span>
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-2 px-1 rounded-t-xl font-bold flex flex-col xs:flex-row items-center justify-center gap-1 sm:gap-2 border-b-2 transition ${
                activeTab === 'guide'
                  ? 'border-cyan-400 text-cyan-300 bg-slate-800/80 shadow-sm'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate text-[11px] sm:text-xs">3. Setup & How to Run</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 py-3 sm:py-6">
        {activeTab === 'game' && <PlayableGame />}
        {activeTab === 'code-oop' && <CodeAndOopCore />}
        {activeTab === 'guide' && <GuideView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <span>Rocket Shooter &bull; Python, Pygame & SQLite</span>
          <span className="text-slate-400">Mobile-First 3-Module Architecture</span>
        </div>
      </footer>
    </div>
  );
}
