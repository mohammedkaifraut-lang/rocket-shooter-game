import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, Eye, EyeOff, Award, Lightbulb, CheckCircle2, BookmarkCheck, Code2 } from 'lucide-react';
import { VIVA_QUESTIONS } from '../data/projectGuide';

export function VivaPrepView() {
  const [activeTab, setActiveTab] = useState<'all' | 'flashcards'>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  const toggleMastered = (id: number) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const currentCard = VIVA_QUESTIONS[cardIndex];

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Viva Voce Preparation & Faculty Q&A
            </h2>
            <p className="text-xs text-slate-400">
              The 5 most probable questions your professor or external examiner will ask, with concise answers and scoring keywords.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'all' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All 5 Questions
          </button>
          <button
            onClick={() => { setActiveTab('flashcards'); setRevealed(false); }}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === 'flashcards' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flashcard Quiz Mode
          </button>
        </div>
      </div>

      {/* 60-Second Elevator Pitch Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40 rounded-xl p-4 text-xs">
        <div className="flex items-center gap-2 text-blue-300 font-bold mb-1">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Your 60-Second Opening Pitch for the Teacher
        </div>
        <p className="text-slate-300 leading-relaxed italic">
          "Good morning/afternoon, Professor. I built <strong>Rocket Shooter</strong>, a 2D space arcade game using Python, Pygame, and SQLite. The project showcases core Object-Oriented principles: a base <code>GameObject</code> with inheritance into <code>Player</code>, <code>Bullet</code>, and <code>Enemy</code>; multi-level inheritance with <code>BossEnemy</code>; and runtime polymorphism via overridden <code>update()</code> methods. Game state and physics are isolated inside a <code>Game</code> class, and player high scores are persisted locally using SQLite3 prepared queries."
        </p>
      </div>

      {activeTab === 'flashcards' ? (
        /* Flashcard Quiz Mode */
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative min-h-[360px] flex flex-col justify-between">
            {/* Header / Counter */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono">Question {cardIndex + 1} of {VIVA_QUESTIONS.length}</span>
              <button
                onClick={() => toggleMastered(currentCard.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
                  masteredIds.includes(currentCard.id)
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                {masteredIds.includes(currentCard.id) ? 'Mastered' : 'Mark as Mastered'}
              </button>
            </div>

            {/* Question Text */}
            <div className="my-6">
              <span className="text-xs uppercase font-mono text-amber-400 font-semibold tracking-wider block mb-2">
                Examiner Asks:
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                "{currentCard.question}"
              </h3>
            </div>

            {/* Answer Reveal Section */}
            {revealed ? (
              <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl text-xs space-y-3 animate-in fade-in duration-200">
                <div>
                  <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider mb-1">
                    Your Short & Clear Answer:
                  </span>
                  <p className="text-white text-sm font-medium leading-relaxed bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-800/40">
                    "{currentCard.shortAnswer}"
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Teacher-Level Detail:</span>
                  <p className="text-slate-300 leading-relaxed mt-0.5">{currentCard.detailedTeacherNotes}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-slate-400">Keywords to say:</span>
                  {currentCard.keyPhrases.map((phrase, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-950/60 border border-blue-800/50 text-blue-300 rounded text-[10px] font-mono">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div
                onClick={() => setRevealed(true)}
                className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 p-8 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition"
              >
                <Eye className="w-6 h-6 text-amber-400" />
                <span className="text-sm font-semibold text-slate-200">Click to Reveal Ideal Answer</span>
                <span className="text-xs text-slate-500">Test yourself before looking!</span>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
              <button
                disabled={cardIndex === 0}
                onClick={() => { setCardIndex((i) => i - 1); setRevealed(false); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => setRevealed(!revealed)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {revealed ? 'Hide Answer' : 'Show Answer'}
              </button>

              <button
                disabled={cardIndex === VIVA_QUESTIONS.length - 1}
                onClick={() => { setCardIndex((i) => i + 1); setRevealed(false); }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs text-slate-200 flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Questionnaire View */
        <div className="space-y-4">
          {VIVA_QUESTIONS.map((item, idx) => {
            const isMastered = masteredIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`bg-slate-950 border rounded-xl p-5 shadow-lg transition ${
                  isMastered ? 'border-emerald-600/60 bg-emerald-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">
                        {item.question}
                      </h3>
                      <p className="text-xs font-mono text-emerald-400 mt-2 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900/50">
                        <strong className="text-emerald-300">Short Viva Answer: </strong>
                        {item.shortAnswer}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMastered(item.id)}
                    title={isMastered ? 'Marked as mastered' : 'Mark as mastered'}
                    className={`p-2 rounded-lg border transition ${
                      isMastered
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3.5 pl-10 text-xs text-slate-300 space-y-2">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Extended Teacher Explanation:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{item.detailedTeacherNotes}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 mr-1">High-Scoring Buzzwords:</span>
                    {item.keyPhrases.map((phrase, pIdx) => (
                      <span key={pIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[10px] font-mono">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bonus Faculty Live Modification Scenarios */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          Bonus: "Live Code Modification" Requests Teachers Often Make
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          During practical evaluations, teachers often test whether you wrote the code yourself by asking you to make quick 1-line changes. Here is how to answer immediately:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
            <span className="text-amber-400 font-bold block mb-1">"Make the boss require 10 hits instead of 5"</span>
            <div className="text-slate-400 text-[11px]">Go to <code className="text-white">BossEnemy.__init__()</code> and change:</div>
            <div className="text-emerald-400 text-[11px] mt-1">self.max_hp = 10<br />self.hp = 10</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
            <span className="text-amber-400 font-bold block mb-1">"Make the player rocket faster"</span>
            <div className="text-slate-400 text-[11px]">Go to <code className="text-white">Player.__init__()</code> and change:</div>
            <div className="text-emerald-400 text-[11px] mt-1">self.speed = 10  # was 6</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
            <span className="text-amber-400 font-bold block mb-1">"Fetch top 10 scores instead of top 5"</span>
            <div className="text-slate-400 text-[11px]">In <code className="text-white">draw_game_over()</code>, call:</div>
            <div className="text-emerald-400 text-[11px] mt-1">game.db.get_top_scores(10)</div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
            <span className="text-amber-400 font-bold block mb-1">"Give player 5 lives instead of 3"</span>
            <div className="text-slate-400 text-[11px]">In <code className="text-white">Game.reset()</code>, change:</div>
            <div className="text-emerald-400 text-[11px] mt-1">self.lives = 5  # was 3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
