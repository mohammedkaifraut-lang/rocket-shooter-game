import React, { useState } from 'react';
import { Network, GitFork, ArrowDown, CheckCircle2, BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { OOP_CONCEPTS } from '../data/projectGuide';

export function OopVisualizer() {
  const [selectedConcept, setSelectedConcept] = useState<string>('polymorphism');
  const [selectedNode, setSelectedNode] = useState<string>('boss');

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              OOP Architecture & Inheritance Diagram
            </h2>
            <p className="text-xs text-slate-400">
              Visual map of all Object-Oriented Programming concepts used in rocket_shooter.py.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Tree Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-xl overflow-x-auto">
        <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-6 flex items-center gap-2">
          <GitFork className="w-4 h-4 text-purple-400" />
          Class Inheritance Tree (Click any box to inspect)
        </h3>

        <div className="flex flex-col items-center min-w-[620px]">
          {/* Base Class */}
          <div
            onClick={() => setSelectedNode('gameobject')}
            className={`cursor-pointer p-4 rounded-xl border-2 transition text-center w-72 shadow-lg ${
              selectedNode === 'gameobject'
                ? 'bg-blue-950/80 border-blue-400 text-white shadow-blue-900/40 ring-2 ring-blue-500/50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
            }`}
          >
            <div className="text-[11px] font-mono uppercase text-blue-400 tracking-wider font-semibold">
              BASE / PARENT CLASS
            </div>
            <div className="font-bold text-base mt-0.5">GameObject</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              attrs: x, y, width, height, color<br />
              methods: get_rect(), draw()
            </div>
          </div>

          {/* Connector down */}
          <div className="h-8 w-0.5 bg-slate-700 flex items-center justify-center relative">
            <ArrowDown className="w-4 h-4 text-slate-500 absolute -bottom-2" />
          </div>

          {/* Branch Line */}
          <div className="w-[500px] h-0.5 bg-slate-700 mt-2 relative">
            {/* 3 drops */}
            <div className="absolute left-10 top-0 h-6 w-0.5 bg-slate-700"></div>
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-6 w-0.5 bg-slate-700"></div>
            <div className="absolute right-10 top-0 h-6 w-0.5 bg-slate-700"></div>
          </div>

          {/* Row of 3 child classes */}
          <div className="flex justify-between w-[580px] mt-6">
            {/* Player */}
            <div
              onClick={() => setSelectedNode('player')}
              className={`cursor-pointer p-3 rounded-xl border-2 transition text-center w-40 ${
                selectedNode === 'player'
                  ? 'bg-cyan-950/80 border-cyan-400 text-white ring-2 ring-cyan-500/50'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Child Class</div>
              <div className="font-bold text-sm">Player</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                inherits GameObject<br />
                method: move()
              </div>
            </div>

            {/* Bullet */}
            <div
              onClick={() => setSelectedNode('bullet')}
              className={`cursor-pointer p-3 rounded-xl border-2 transition text-center w-40 ${
                selectedNode === 'bullet'
                  ? 'bg-yellow-950/80 border-yellow-400 text-white ring-2 ring-yellow-500/50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-yellow-400 font-bold uppercase">Child Class</div>
              <div className="font-bold text-sm">Bullet</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                inherits GameObject<br />
                method: update()
              </div>
            </div>

            {/* Enemy */}
            <div
              onClick={() => setSelectedNode('enemy')}
              className={`cursor-pointer p-3 rounded-xl border-2 transition text-center w-40 ${
                selectedNode === 'enemy'
                  ? 'bg-rose-950/80 border-rose-400 text-white ring-2 ring-rose-500/50'
                  : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Child Class</div>
              <div className="font-bold text-sm">Enemy</div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                inherits GameObject<br />
                method: update()
              </div>
            </div>
          </div>

          {/* Multi-level branch from Enemy to BossEnemy */}
          <div className="w-[580px] flex justify-end pr-[55px] mt-2">
            <div className="h-8 w-0.5 bg-purple-500 flex items-center justify-center relative">
              <ArrowDown className="w-4 h-4 text-purple-400 absolute -bottom-2" />
            </div>
          </div>

          {/* BossEnemy */}
          <div className="w-[580px] flex justify-end pr-0 mt-3">
            <div
              onClick={() => setSelectedNode('boss')}
              className={`cursor-pointer p-3.5 rounded-xl border-2 transition text-center w-52 shadow-xl ${
                selectedNode === 'boss'
                  ? 'bg-purple-950/90 border-purple-400 text-white ring-2 ring-purple-500/60'
                  : 'bg-slate-900 border-purple-700 text-slate-200 hover:border-purple-400'
              }`}
            >
              <div className="text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                ★ Multi-Level Inheritance
              </div>
              <div className="font-bold text-sm text-purple-200">BossEnemy</div>
              <div className="text-[10px] text-purple-300/80 mt-1 font-mono">
                inherits Enemy (hp=5)<br />
                overrides: update(), draw()
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Details Box */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Inspection: {selectedNode.toUpperCase()} Class
          </div>
          {selectedNode === 'gameobject' && (
            <p className="text-slate-300">
              The foundational abstract entity. Defines spatial properties (x, y, width, height) and drawing logic. Every visible item in the game inherits from this class, satisfying the DRY principle.
            </p>
          )}
          {selectedNode === 'player' && (
            <p className="text-slate-300">
              Single inheritance child of GameObject. Adds <code className="text-cyan-300">speed = 6</code> and a bounded <code className="text-cyan-300">move(dx, screen_width)</code> method that keeps the rocket strictly inside the screen frame.
            </p>
          )}
          {selectedNode === 'bullet' && (
            <p className="text-slate-300">
              Single inheritance child of GameObject. Fired from the rocket tip. Has <code className="text-yellow-300">update()</code> which shifts y upwards by speed 8 until it hits an enemy or goes off-screen.
            </p>
          )}
          {selectedNode === 'enemy' && (
            <p className="text-slate-300">
              Single inheritance child of GameObject. Standard hazard that falls vertically downward at varying speed based on current level.
            </p>
          )}
          {selectedNode === 'boss' && (
            <p className="text-purple-300">
              <strong>Multi-Level Inheritance + Polymorphism:</strong> Inherits from <code className="text-purple-200">Enemy</code>, which itself inherited from <code className="text-purple-200">GameObject</code>. BossEnemy adds 5 HP, health bar rendering, and overrides <code className="text-purple-200">update()</code> to zig-zag horizontally while moving downward.
            </p>
          )}
        </div>
      </div>

      {/* Polymorphism Demonstration Deep-Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-pink-500/10 border border-pink-500/30 rounded-lg text-pink-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Polymorphism in Action (Method Overriding)</h3>
            <p className="text-xs text-slate-400">
              Notice how both classes share the exact same method signature <code className="text-amber-400">def update(self)</code>, but execute completely different behaviors:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Enemy update */}
          <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/60">
            <div className="flex items-center justify-between text-rose-400 font-bold mb-2 pb-2 border-b border-rose-950">
              <span>Enemy.update() [Parent]</span>
              <span className="text-[10px] px-2 py-0.5 bg-rose-950 rounded text-rose-300">Straight Down</span>
            </div>
            <pre className="text-slate-300 leading-relaxed">
{`class Enemy(GameObject):
    def update(self):
        # Regular enemy only falls vertically
        self.y += self.speed`}
            </pre>
            <p className="text-[11px] text-slate-400 mt-3 font-sans">
              Simple vertical movement. Reaches the bottom unless shot down.
            </p>
          </div>

          {/* BossEnemy update */}
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/60">
            <div className="flex items-center justify-between text-purple-300 font-bold mb-2 pb-2 border-b border-purple-950">
              <span>BossEnemy.update() [Child Override]</span>
              <span className="text-[10px] px-2 py-0.5 bg-purple-950 rounded text-purple-200">Zig-Zag & Bounce</span>
            </div>
            <pre className="text-slate-300 leading-relaxed">
{`class BossEnemy(Enemy):
    def update(self):
        # Boss moves down AND bounces sideways
        self.y += self.speed
        self.x += self.dx

        if self.x <= 0 or self.x >= 600 - self.width:
            self.dx *= -1  # Bounces off walls!`}
            </pre>
            <p className="text-[11px] text-slate-400 mt-3 font-sans">
              Overrides update(). Same function name, yet dynamically executes complex zig-zag physics.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive OOP Concepts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          OOP Concept Breakdown for your College Viva
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {OOP_CONCEPTS.map((concept) => (
            <button
              key={concept.id}
              onClick={() => setSelectedConcept(concept.id)}
              className={`text-left p-3.5 rounded-xl border transition ${
                selectedConcept === concept.id
                  ? 'bg-slate-800 border-blue-500 shadow-md'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{concept.name}</span>
                {selectedConcept === concept.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{concept.shortDesc}</p>
            </button>
          ))}
        </div>

        {/* Selected Concept Deep Dive Card */}
        {(() => {
          const item = OOP_CONCEPTS.find((c) => c.id === selectedConcept) || OOP_CONCEPTS[0];
          return (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <h4 className="font-bold text-sm text-cyan-400">{item.name}</h4>
                <span className="text-[11px] text-slate-400">Concept Deep Dive</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Explanation for Teacher:</span>
                  <p className="text-slate-200 mt-0.5">{item.teacherExplanation}</p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Where in rocket_shooter.py:</span>
                  <p className="text-slate-300 mt-0.5 font-mono text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                    {item.whereInCode}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Exact Code Excerpt:</span>
                  <pre className="mt-1 p-3 bg-slate-900 rounded border border-slate-800 font-mono text-emerald-300 overflow-x-auto">
                    {item.codeSnippet}
                  </pre>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
