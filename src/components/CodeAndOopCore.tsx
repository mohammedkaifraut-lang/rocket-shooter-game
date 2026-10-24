import React, { useState, useMemo } from 'react';
import {
  FileCode2,
  GitFork,
  Cpu,
  Layers,
  Copy,
  Check,
  Search,
  ArrowDown,
  Sparkles,
  Database as DbIcon,
  ShieldAlert,
  Zap,
  Code
} from 'lucide-react';
import { ROCKET_SHOOTER_PYTHON_CODE } from '../data/pythonCode';
import { OOP_CONCEPTS } from '../data/projectGuide';

export function CodeAndOopCore() {
  // Main sub-view switcher: 'inheritance' | 'system-core' | 'full-code'
  const [activeSection, setActiveSection] = useState<'inheritance' | 'system-core' | 'full-code'>('inheritance');
  const [selectedNode, setSelectedNode] = useState<string>('boss');
  const [codeFilter, setCodeFilter] = useState<'all' | 'backend' | 'frontend' | 'database'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Filter code for code viewer
  const displayCode = useMemo(() => {
    let raw = ROCKET_SHOOTER_PYTHON_CODE;
    if (codeFilter === 'database') {
      const match = raw.match(/# --- DATABASE CLASS ---[\s\S]*?(?=# --- OOP HIERARCHY ---)/);
      return match ? match[0].trim() : raw;
    }
    if (codeFilter === 'backend') {
      const match = raw.match(/# \[BACKEND SECTION\][\s\S]*?(?=# \[FRONTEND SECTION\])/);
      return match ? match[0].trim() : raw;
    }
    if (codeFilter === 'frontend') {
      const match = raw.match(/# \[FRONTEND SECTION\][\s\S]*/);
      return match ? match[0].trim() : raw;
    }
    return raw;
  }, [codeFilter]);

  const lines = useMemo(() => displayCode.split('\n'), [displayCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2 flex flex-col gap-4">
      {/* Mobile-First Header with Quick Action Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shrink-0">
              <GitFork className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                Code & Architecture Core
              </h2>
              <p className="text-xs text-slate-400">
                Single unified module: Inheritance Core, System Core, and Python Source Code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Python Code'}</span>
            </button>
          </div>
        </div>

        {/* 3 Mobile-First Section Switchers */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSection('inheritance')}
            className={`py-2 px-1 sm:px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center ${
              activeSection === 'inheritance'
                ? 'bg-purple-600 text-white shadow font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">1. Inheritance Core</span>
          </button>

          <button
            onClick={() => setActiveSection('system-core')}
            className={`py-2 px-1 sm:px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center ${
              activeSection === 'system-core'
                ? 'bg-blue-600 text-white shadow font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">2. System Core</span>
          </button>

          <button
            onClick={() => setActiveSection('full-code')}
            className={`py-2 px-1 sm:px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-center ${
              activeSection === 'full-code'
                ? 'bg-cyan-600 text-white shadow font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">3. Full Source Code</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: INHERITANCE CORE */}
      {activeSection === 'inheritance' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          {/* Visual Inheritance Tree Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-400 flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                OOP Inheritance Core (Tap any class to inspect)
              </span>
              <span className="text-[11px] text-slate-400">Single & Multi-Level</span>
            </div>

            {/* Tree Container with horizontal scroll on small screens */}
            <div className="overflow-x-auto pb-4 pt-1 flex justify-center">
              <div className="flex flex-col items-center min-w-[540px]">
                {/* 1. Base Class: GameObject */}
                <div
                  onClick={() => setSelectedNode('gameobject')}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl border-2 transition text-center w-64 sm:w-72 shadow-lg ${
                    selectedNode === 'gameobject'
                      ? 'bg-blue-950/80 border-blue-400 text-white ring-2 ring-blue-500/40'
                      : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase text-blue-400 tracking-wider font-bold">
                    BASE / PARENT CLASS
                  </div>
                  <div className="font-bold text-sm sm:text-base mt-0.5">GameObject</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    attrs: x, y, width, height, color<br />
                    methods: get_rect(), draw(screen)
                  </div>
                </div>

                {/* Connector */}
                <div className="h-6 w-0.5 bg-slate-700 relative">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-500 absolute -bottom-1.5 -left-1.5" />
                </div>

                {/* Branch Line */}
                <div className="w-[440px] sm:w-[480px] h-0.5 bg-slate-700 mt-1 relative">
                  <div className="absolute left-6 top-0 h-5 w-0.5 bg-slate-700"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 h-5 w-0.5 bg-slate-700"></div>
                  <div className="absolute right-6 top-0 h-5 w-0.5 bg-slate-700"></div>
                </div>

                {/* Child Classes */}
                <div className="flex justify-between w-[480px] sm:w-[520px] mt-5">
                  {/* Player */}
                  <div
                    onClick={() => setSelectedNode('player')}
                    className={`cursor-pointer p-2.5 sm:p-3 rounded-xl border-2 transition text-center w-36 sm:w-40 ${
                      selectedNode === 'player'
                        ? 'bg-cyan-950/80 border-cyan-400 text-white ring-2 ring-cyan-500/40'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-cyan-400 font-bold uppercase">Child Class</div>
                    <div className="font-bold text-xs sm:text-sm">Player</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      inherits GameObject<br />
                      speed = 6, move()
                    </div>
                  </div>

                  {/* Bullet */}
                  <div
                    onClick={() => setSelectedNode('bullet')}
                    className={`cursor-pointer p-2.5 sm:p-3 rounded-xl border-2 transition text-center w-36 sm:w-40 ${
                      selectedNode === 'bullet'
                        ? 'bg-yellow-950/80 border-yellow-400 text-white ring-2 ring-yellow-500/40'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-yellow-400 font-bold uppercase">Child Class</div>
                    <div className="font-bold text-xs sm:text-sm">Bullet</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      inherits GameObject<br />
                      speed = 8, update()
                    </div>
                  </div>

                  {/* Enemy */}
                  <div
                    onClick={() => setSelectedNode('enemy')}
                    className={`cursor-pointer p-2.5 sm:p-3 rounded-xl border-2 transition text-center w-36 sm:w-40 ${
                      selectedNode === 'enemy'
                        ? 'bg-rose-950/80 border-rose-400 text-white ring-2 ring-rose-500/40'
                        : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-rose-400 font-bold uppercase">Child Class</div>
                    <div className="font-bold text-xs sm:text-sm">Enemy</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      inherits GameObject<br />
                      update() [downward]
                    </div>
                  </div>
                </div>

                {/* Multi-Level Branch to BossEnemy */}
                <div className="w-[480px] sm:w-[520px] flex justify-end pr-14 mt-1">
                  <div className="h-6 w-0.5 bg-purple-500 relative">
                    <ArrowDown className="w-3.5 h-3.5 text-purple-400 absolute -bottom-1.5 -left-1.5" />
                  </div>
                </div>

                {/* BossEnemy Box */}
                <div className="w-[480px] sm:w-[520px] flex justify-end pr-1 mt-2">
                  <div
                    onClick={() => setSelectedNode('boss')}
                    className={`cursor-pointer p-3 sm:p-3.5 rounded-xl border-2 transition text-center w-48 sm:w-52 shadow-xl ${
                      selectedNode === 'boss'
                        ? 'bg-purple-950/90 border-purple-400 text-white ring-2 ring-purple-500/50'
                        : 'bg-slate-900 border-purple-700 text-slate-200 hover:border-purple-400'
                    }`}
                  >
                    <div className="text-[9px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                      ★ Multi-Level Inheritance
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-purple-200">BossEnemy</div>
                    <div className="text-[10px] text-purple-300/80 mt-0.5 font-mono">
                      inherits Enemy (hp = 5)<br />
                      overrides: update(), draw()
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Class Inspector Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div className="font-bold text-white mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Active Class Inspector: <span className="text-cyan-400">{selectedNode.toUpperCase()}</span>
              </div>
              {selectedNode === 'gameobject' && (
                <p className="text-slate-300">
                  <strong>Base Entity:</strong> Stores core rectangle properties <code className="text-cyan-300">(x, y, width, height, color)</code>. Implements <code className="text-cyan-300">get_rect()</code> for collision math and <code className="text-cyan-300">draw()</code> for rendering.
                </p>
              )}
              {selectedNode === 'player' && (
                <p className="text-slate-300">
                  <strong>Single Inheritance:</strong> Inherits from <code className="text-cyan-300">GameObject</code>. Adds horizontal motion speed <code className="text-cyan-300">speed = 6</code> and a bounded <code className="text-cyan-300">move(direction, screen_width)</code> method.
                </p>
              )}
              {selectedNode === 'bullet' && (
                <p className="text-slate-300">
                  <strong>Single Inheritance:</strong> Inherits from <code className="text-yellow-300">GameObject</code>. Fired upward by decrementing <code className="text-yellow-300">self.y -= self.speed</code> in its <code className="text-yellow-300">update()</code> method.
                </p>
              )}
              {selectedNode === 'enemy' && (
                <p className="text-slate-300">
                  <strong>Single Inheritance:</strong> Inherits from <code className="text-rose-300">GameObject</code>. Moves straight down every frame in its <code className="text-rose-300">update()</code> method.
                </p>
              )}
              {selectedNode === 'boss' && (
                <p className="text-purple-300">
                  <strong>Multi-Level Inheritance + Polymorphism:</strong> Inherits from <code className="text-purple-200">Enemy</code> (which inherited from <code className="text-purple-200">GameObject</code>). Adds <code className="text-purple-200">hp = 5</code>, health bar drawing, and overrides <code className="text-purple-200">update()</code> to zig-zag horizontally while moving downward.
                </p>
              )}
            </div>
          </div>

          {/* Polymorphism Demonstration Cards (Side-by-side or stacked on mobile) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-pink-400 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              Polymorphism: Overridden update() Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/60">
                <div className="flex items-center justify-between text-rose-400 font-bold mb-2 pb-1.5 border-b border-rose-950">
                  <span>Enemy.update()</span>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-950 rounded text-rose-300">Parent</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`class Enemy(GameObject):
    def update(self):
        # Falls straight down
        self.y += self.speed`}
                </pre>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-purple-900/60">
                <div className="flex items-center justify-between text-purple-300 font-bold mb-2 pb-1.5 border-b border-purple-950">
                  <span>BossEnemy.update()</span>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-950 rounded text-purple-200">Child Override</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`class BossEnemy(Enemy):
    def update(self):
        # Falls down + bounces sideways
        self.y += self.speed
        self.x += self.dx
        if self.x <= 0 or self.x >= 600 - self.width:
            self.dx *= -1`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: WHOLE SYSTEM CORE (GAME ENGINE & DATABASE) */}
      {activeSection === 'system-core' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-150">
          {/* Game Class Orchestrator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Game Class (Engine Core)</h3>
                <span className="text-[11px] text-blue-400 font-mono">Central State Machine & Rules</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Level Up Rule</span>
                <span className="font-mono text-cyan-300 font-bold text-sm">score // 10 + 1</span>
                <p className="text-[10px] text-slate-500 mt-1">Enemies speed up every 10 points.</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Boss Spawn Rule</span>
                <span className="font-mono text-purple-300 font-bold text-sm">Every 20 points</span>
                <p className="text-[10px] text-slate-500 mt-1">Requires 5 hits, moves horizontally.</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Collision Math</span>
                <span className="font-mono text-emerald-300 font-bold text-sm">colliderect()</span>
                <p className="text-[10px] text-slate-500 mt-1">AABB bounding box intersection.</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px] block">30s Challenge Rule</span>
                <span className="font-mono text-amber-300 font-bold text-sm">30.0s Countdown</span>
                <p className="text-[10px] text-slate-500 mt-1">Enemies passing down do NOT end the game!</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="text-blue-400 font-semibold mb-1"># 30-Second Challenge Loop in Game.update(dt):</div>
              <div>1. self.time_left -= dt &rarr; triggers game over ONLY at 0.0s</div>
              <div>2. level = (self.score // 10) + 1 &rarr; speed scaling</div>
              <div>3. check_boss_spawn() every 20 enemies shot (+5 kills)</div>
              <div>4. enemy.update() &rarr; falls off bottom cleanly without ending game</div>
              <div>5. handle_collisions() &rarr; counts total enemies shot in 30s</div>
            </div>
          </div>

          {/* Database Class Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800 mb-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                <DbIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Database Class (SQLite Core)</h3>
                <span className="text-[11px] text-amber-400 font-mono">scores.db &bull; Table 'high_scores'</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">CREATE TABLE Schema</span>
                <pre className="text-slate-300 overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS high_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT,
    score INTEGER
)`}
                </pre>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">Top 5 Scores Query</span>
                <pre className="text-slate-300 overflow-x-auto">
{`SELECT player_name, score 
FROM high_scores 
ORDER BY score DESC 
LIMIT 5`}
                </pre>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              <strong>Encapsulation Note:</strong> The Game class only calls <code className="text-amber-300">self.db.save_score(...)</code> and <code className="text-amber-300">self.db.get_top_scores(5)</code>. Raw SQLite connections, commits, and cursor methods are cleanly encapsulated.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: FULL PYTHON SOURCE CODE */}
      {activeSection === 'full-code' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-150">
          {/* Sub-Filters and Search for Code */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setCodeFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                  codeFilter === 'all' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Code
              </button>
              <button
                onClick={() => setCodeFilter('backend')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                  codeFilter === 'backend' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Backend (OOP)
              </button>
              <button
                onClick={() => setCodeFilter('frontend')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                  codeFilter === 'frontend' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Frontend (Pygame)
              </button>
              <button
                onClick={() => setCodeFilter('database')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                  codeFilter === 'database' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Database
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
            <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 text-xs font-semibold">rocket_shooter.py</span>
              <span className="text-[11px] text-slate-500">{lines.length} lines</span>
            </div>

            <div className="max-h-[580px] overflow-y-auto p-3 sm:p-4 select-text">
              <pre className="text-slate-300 leading-relaxed font-mono">
                {lines.map((line, idx) => {
                  const isMatch = searchQuery.trim() && line.toLowerCase().includes(searchQuery.toLowerCase());
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
                      <span className="table-cell pr-4 sm:pr-6 text-right select-none text-slate-600 text-[10px] sm:text-[11px] w-10 sm:w-12">
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
      )}
    </div>
  );
}
