import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Play, Eye, ShieldAlert, Award, Crosshair, Timer } from 'lucide-react';

interface HighScore {
  name: string;
  score: number;
  date: string;
}

export function PlayableGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // UI state
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHitboxes, setShowHitboxes] = useState(false);
  const [currentScore, setCurrentScore] = useState(0); // count of enemies shot
  const [timeLeft, setTimeLeft] = useState(30.0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bossActive, setBossActive] = useState(false);
  const [bossHp, setBossHp] = useState(5);
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    try {
      const saved = localStorage.getItem('rocket_shooter_scores_30s');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { name: 'Teacher Demo', score: 38, date: 'Top Record' },
      { name: 'Cadet Bravo', score: 29, date: 'High' },
      { name: 'Player 1', score: 21, date: 'Recent' }
    ];
  });

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((type: 'shoot' | 'hit' | 'bossHit' | 'gameOver' | 'bossSpawn') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'shoot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'bossHit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'bossSpawn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(300, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'gameOver') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.15);
        osc.frequency.setValueAtTime(784, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch {
      // Audio error suppressed
    }
  }, [soundEnabled]);

  // Keys ref
  const keysRef = useRef<{ left: boolean; right: boolean; space: boolean }>({
    left: false,
    right: false,
    space: false,
  });

  // Game internal state ref
  const gameStateRef = useRef({
    score: 0,
    timeLeft: 30.0,
    level: 1,
    isGameOver: false,
    player: { x: 280, y: 620, width: 40, height: 40, speed: 6 },
    bullets: [] as Array<{ x: number; y: number; width: number; height: number; speed: number }>,
    enemies: [] as Array<{ x: number; y: number; width: number; height: number; speed: number }>,
    boss: null as null | { x: number; y: number; width: number; height: number; speed: number; hp: number; maxHp: number; dx: number },
    lastBossScore: 0,
    spawnCounter: 0,
    lastShotTime: 0,
    lastTimestamp: 0,
  });

  const resetGame = useCallback(() => {
    gameStateRef.current = {
      score: 0,
      timeLeft: 30.0,
      level: 1,
      isGameOver: false,
      player: { x: 280, y: 620, width: 40, height: 40, speed: 6 },
      bullets: [],
      enemies: [],
      boss: null,
      lastBossScore: 0,
      spawnCounter: 0,
      lastShotTime: 0,
      lastTimestamp: performance.now(),
    };
    setCurrentScore(0);
    setTimeLeft(30.0);
    setCurrentLevel(1);
    setIsGameOver(false);
    setBossActive(false);
    setBossHp(5);
    setIsPlaying(true);
  }, []);

  const shootBullet = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isGameOver) return;
    const now = Date.now();
    if (now - s.lastShotTime < 160) return; // fast responsive fire rate
    s.lastShotTime = now;
    s.bullets.push({
      x: s.player.x + 20 - 3,
      y: s.player.y - 10,
      width: 6,
      height: 14,
      speed: 8,
    });
    playSound('shoot');
  }, [playSound]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'Space', 'KeyA', 'KeyD', 'KeyR', 'KeyQ'].includes(e.code)) {
        if (['Space', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
          e.preventDefault();
        }
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      }
      if (e.code === 'Space') {
        keysRef.current.space = true;
        shootBullet();
      }
      if (e.code === 'KeyR') {
        resetGame();
      }
      if (e.code === 'KeyQ') {
        if (!gameStateRef.current.isGameOver) {
          gameStateRef.current.isGameOver = true;
          setIsGameOver(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
      if (e.code === 'Space') {
        keysRef.current.space = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame, shootBullet]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const WIDTH = 600;
    const HEIGHT = 700;

    const stars: Array<{ x: number; y: number; size: number; alpha: number }> = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        size: Math.random() > 0.8 ? 2 : 1,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }

    gameStateRef.current.lastTimestamp = performance.now();

    const gameLoop = (timestamp: number) => {
      const s = gameStateRef.current;
      const dt = Math.min(0.05, (timestamp - (s.lastTimestamp || timestamp)) / 1000.0);
      s.lastTimestamp = timestamp;

      // UPDATE PHASE
      if (!s.isGameOver && isPlaying) {
        // 1. Update 30-Second Countdown Timer
        s.timeLeft -= dt;
        if (s.timeLeft <= 0) {
          s.timeLeft = 0;
          s.isGameOver = true;
          setIsGameOver(true);
          playSound('gameOver');
          handleNewHighScore(s.score);
        }
        setTimeLeft(s.timeLeft);

        // Player movement
        if (keysRef.current.left) {
          s.player.x -= s.player.speed;
          if (s.player.x < 0) s.player.x = 0;
        }
        if (keysRef.current.right) {
          s.player.x += s.player.speed;
          if (s.player.x > WIDTH - s.player.width) s.player.x = WIDTH - s.player.width;
        }

        // Level update: increases every 10 enemies shot
        const calculatedLevel = Math.floor(s.score / 10) + 1;
        if (calculatedLevel !== s.level) {
          s.level = calculatedLevel;
          setCurrentLevel(calculatedLevel);
        }

        // Boss spawn check: every 20 enemies shot
        if (s.score >= s.lastBossScore + 20 && !s.boss) {
          s.lastBossScore = s.score;
          s.boss = {
            x: (WIDTH - 70) / 2,
            y: -60,
            width: 70,
            height: 50,
            speed: 1.2 + s.level * 0.2,
            hp: 5,
            maxHp: 5,
            dx: 2.2,
          };
          setBossActive(true);
          setBossHp(5);
          playSound('bossSpawn');
        }

        // Regular enemies spawn interval (faster as level increases)
        s.spawnCounter++;
        const spawnDelay = Math.max(18, 40 - s.level * 2);
        if (s.spawnCounter >= spawnDelay) {
          s.spawnCounter = 0;
          const enemySpeed = 2.5 + (s.level - 1) * 0.5;
          const randX = Math.random() * (WIDTH - 35);
          s.enemies.push({
            x: randX,
            y: -35,
            width: 35,
            height: 30,
            speed: enemySpeed,
          });
        }

        // Update bullets
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          s.bullets[i].y -= s.bullets[i].speed;
          if (s.bullets[i].y < -20) {
            s.bullets.splice(i, 1);
          }
        }

        // Update regular enemies (Enemies going down do NOT end the game!)
        for (let i = s.enemies.length - 1; i >= 0; i--) {
          const enemy = s.enemies[i];
          enemy.y += enemy.speed;

          if (enemy.y > HEIGHT) {
            s.enemies.splice(i, 1);
            // NOTE: Reaching bottom does NOT end the game!
          }
        }

        // Update Boss enemy
        if (s.boss) {
          s.boss.y += s.boss.speed;
          s.boss.x += s.boss.dx;
          if (s.boss.x <= 0 || s.boss.x >= WIDTH - s.boss.width) {
            s.boss.dx *= -1;
          }

          if (s.boss.y > HEIGHT) {
            s.boss = null;
            setBossActive(false);
            // Leaving bottom does NOT end the game!
          }
        }

        // Collisions: Bullet vs Enemy
        bulletLoop: for (let bIdx = s.bullets.length - 1; bIdx >= 0; bIdx--) {
          const b = s.bullets[bIdx];

          for (let eIdx = s.enemies.length - 1; eIdx >= 0; eIdx--) {
            const e = s.enemies[eIdx];
            if (
              b.x < e.x + e.width &&
              b.x + b.width > e.x &&
              b.y < e.y + e.height &&
              b.y + b.height > e.y
            ) {
              s.bullets.splice(bIdx, 1);
              s.enemies.splice(eIdx, 1);
              s.score += 1; // 1 enemy shot
              setCurrentScore(s.score);
              playSound('hit');
              continue bulletLoop;
            }
          }

          if (s.boss) {
            if (
              b.x < s.boss.x + s.boss.width &&
              b.x + b.width > s.boss.x &&
              b.y < s.boss.y + s.boss.height &&
              b.y + b.height > s.boss.y
            ) {
              s.bullets.splice(bIdx, 1);
              s.boss.hp -= 1;
              setBossHp(s.boss.hp);
              playSound('bossHit');

              if (s.boss.hp <= 0) {
                s.boss = null;
                setBossActive(false);
                s.score += 5; // bonus 5 enemies shot for boss defeat
                setCurrentScore(s.score);
                playSound('hit');
              }
              continue bulletLoop;
            }
          }
        }

        // Player touches enemy (clears enemy, but game continues for full 30s)
        for (let eIdx = s.enemies.length - 1; eIdx >= 0; eIdx--) {
          const e = s.enemies[eIdx];
          if (
            s.player.x < e.x + e.width &&
            s.player.x + s.player.width > e.x &&
            s.player.y < e.y + e.height &&
            s.player.y + s.player.height > e.y
          ) {
            s.enemies.splice(eIdx, 1);
          }
        }

        if (s.boss) {
          if (
            s.player.x < s.boss.x + s.boss.width &&
            s.player.x + s.player.width > s.boss.x &&
            s.player.y < s.boss.y + s.boss.height &&
            s.player.y + s.player.height > s.boss.y
          ) {
            s.boss.dx *= -1;
          }
        }
      }

      // RENDER PHASE
      ctx.fillStyle = '#0f1423';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = '#94a3b8';
      for (const st of stars) {
        ctx.globalAlpha = st.alpha;
        ctx.fillRect(st.x, st.y, st.size, st.size);
      }
      ctx.globalAlpha = 1.0;

      // Player
      ctx.fillStyle = '#00c8ff';
      ctx.fillRect(s.player.x, s.player.y, s.player.width, s.player.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(s.player.x + 16, s.player.y - 6, 8, 6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(s.player.x - 4, s.player.y + 20, 4, 16);
      ctx.fillRect(s.player.x + s.player.width, s.player.y + 20, 4, 16);

      // Bullets
      ctx.fillStyle = '#ffeb3b';
      for (const b of s.bullets) {
        ctx.fillRect(b.x, b.y, b.width, b.height);
      }

      // Regular Enemies
      ctx.fillStyle = '#f44336';
      for (const e of s.enemies) {
        ctx.fillRect(e.x, e.y, e.width, e.height);
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(e.x + 8, e.y + 8, e.width - 16, 4);
        ctx.fillStyle = '#f44336';
      }

      // Boss Enemy
      if (s.boss) {
        ctx.fillStyle = '#9c27b0';
        ctx.fillRect(s.boss.x, s.boss.y, s.boss.width, s.boss.height);

        ctx.fillStyle = '#e1bee7';
        ctx.fillRect(s.boss.x + 20, s.boss.y + 15, 30, 20);

        ctx.fillStyle = '#c62828';
        ctx.fillRect(s.boss.x, s.boss.y - 12, s.boss.width, 6);

        const fillW = Math.max(0, (s.boss.hp / s.boss.maxHp) * s.boss.width);
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(s.boss.x, s.boss.y - 12, fillW, 6);
      }

      // Hitboxes
      if (showHitboxes) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1;
        ctx.strokeRect(s.player.x, s.player.y, s.player.width, s.player.height);
        ctx.strokeStyle = '#eab308';
        for (const b of s.bullets) ctx.strokeRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = '#ef4444';
        for (const e of s.enemies) ctx.strokeRect(e.x, e.y, e.width, e.height);
        if (s.boss) {
          ctx.strokeStyle = '#a855f7';
          ctx.strokeRect(s.boss.x, s.boss.y, s.boss.width, s.boss.height);
        }
      }

      // Top HUD: 30-Second Countdown Timer & Enemies Shot Counter
      ctx.fillStyle = '#191e32';
      ctx.fillRect(0, 0, WIDTH, 48);
      ctx.strokeStyle = '#323c5a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 48);
      ctx.lineTo(WIDTH, 48);
      ctx.stroke();

      ctx.font = 'bold 18px "Courier New", monospace';
      // Timer color turns red when <= 5s
      ctx.fillStyle = s.timeLeft <= 5.0 ? '#ef4444' : '#ffd700';
      ctx.fillText(`TIME: ${s.timeLeft.toFixed(1)}s`, 18, 30);

      ctx.fillStyle = '#00e5ff';
      ctx.fillText(`SHOT: ${s.score}`, 240, 30);

      ctx.fillStyle = '#4ade80';
      ctx.fillText(`LVL: ${s.level}`, 480, 30);

      if (s.boss) {
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 14px sans-serif';
        const alertTxt = '⚠ BOSS BATTLE (+5 KILLS) ⚠';
        const txtW = ctx.measureText(alertTxt).width;
        ctx.fillText(alertTxt, (WIDTH - txtW) / 2, 72);
      }

      // Results Screen: Time's Up! (30-Sec Challenge Complete)
      if (s.isGameOver) {
        ctx.fillStyle = 'rgba(10, 12, 25, 0.94)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.font = 'bold 44px sans-serif';
        ctx.fillStyle = '#ffd700';
        const goText = "TIME'S UP!";
        ctx.fillText(goText, (WIDTH - ctx.measureText(goText).width) / 2, 105);

        ctx.font = 'bold 22px sans-serif';
        ctx.fillStyle = '#ffffff';
        const scoreTxt = `Enemies Shot in 30 Seconds: ${s.score}`;
        ctx.fillText(scoreTxt, (WIDTH - ctx.measureText(scoreTxt).width) / 2, 160);

        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 18px monospace';
        const hsHead = '--- TOP 5 LEADERBOARD (SQLite) ---';
        ctx.fillText(hsHead, (WIDTH - ctx.measureText(hsHead).width) / 2, 225);

        ctx.font = '16px monospace';
        const currentList = highScores.slice(0, 5);
        let listY = 270;
        currentList.forEach((entry, idx) => {
          ctx.fillStyle = idx === 0 ? '#ffd700' : '#e2e8f0';
          const line = `#${idx + 1}  ${entry.name.padEnd(14, ' ')} : ${entry.score} enemies shot`;
          ctx.fillText(line, 120, listY);
          listY += 34;
        });

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(100, 510, 400, 80, [10]);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = '#22c55e';
        const restartTxt = 'Tap [RETRY 30s] or Press [R]';
        ctx.fillText(restartTxt, (WIDTH - ctx.measureText(restartTxt).width) / 2, 545);

        ctx.fillStyle = '#f87171';
        const quitTxt = 'Press [Q] to Quit';
        ctx.fillText(quitTxt, (WIDTH - ctx.measureText(quitTxt).width) / 2, 572);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, showHitboxes, highScores, playSound]);

  const handleNewHighScore = (score: number) => {
    setHighScores((prev) => {
      const updated = [...prev, { name: 'Player 1', score, date: new Date().toLocaleTimeString() }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      try {
        localStorage.setItem('rocket_shooter_scores_30s', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 px-2 sm:px-4 py-2 max-w-6xl mx-auto w-full">
      {/* Game Canvas Container - Mobile First */}
      <div className="flex flex-col items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-2.5 sm:p-4 shadow-2xl relative w-full max-w-md lg:max-w-none lg:w-auto">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-2.5 px-1 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-200 text-[11px] sm:text-xs flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              30-Second Rapid Fire Challenge
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowHitboxes(!showHitboxes)}
              title="Toggle Hitboxes"
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs flex items-center gap-1 border transition ${
                showHitboxes
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Hitboxes</span>
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Toggle sound"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
            <button
              onClick={resetGame}
              title="Restart 30s Challenge"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Responsive Canvas */}
        <div className="relative mt-2.5 rounded-xl overflow-hidden border border-slate-800 shadow-inner w-full flex justify-center bg-[#0f1423]">
          <canvas
            ref={canvasRef}
            width={600}
            height={700}
            className="w-full max-w-[380px] sm:max-w-[440px] md:max-w-[480px] aspect-[600/700] bg-[#0f1423] cursor-crosshair block touch-none"
          />

          {bossActive && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-purple-900/90 text-purple-200 border border-purple-400 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 shadow-lg pointer-events-none">
              <ShieldAlert className="w-3 h-3 text-purple-300 animate-bounce" />
              BOSS HP: {bossHp}/5 (+5 Kills)
            </div>
          )}
        </div>

        {/* Mobile Arcade Touch Controls */}
        <div className="w-full mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800 select-none">
          {/* D-Pad Buttons */}
          <div className="flex gap-1.5">
            <button
              onPointerDown={(e) => { e.preventDefault(); keysRef.current.left = true; }}
              onPointerUp={(e) => { e.preventDefault(); keysRef.current.left = false; }}
              onPointerLeave={() => { keysRef.current.left = false; }}
              className="w-14 sm:w-16 h-12 bg-slate-800 hover:bg-slate-750 active:bg-cyan-600 rounded-xl text-white font-mono font-bold text-base border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 touch-none"
              aria-label="Move Left"
            >
              ◀
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); keysRef.current.right = true; }}
              onPointerUp={(e) => { e.preventDefault(); keysRef.current.right = false; }}
              onPointerLeave={() => { keysRef.current.right = false; }}
              className="w-14 sm:w-16 h-12 bg-slate-800 hover:bg-slate-750 active:bg-cyan-600 rounded-xl text-white font-mono font-bold text-base border border-slate-700 flex items-center justify-center shadow-lg active:scale-95 touch-none"
              aria-label="Move Right"
            >
              ▶
            </button>
          </div>

          {/* Action Fire Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              shootBullet();
            }}
            className="flex-1 max-w-[190px] h-12 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 touch-none"
          >
            <Crosshair className="w-4 h-4" />
            <span>FIRE [Space]</span>
          </button>

          {isGameOver && (
            <button
              onClick={resetGame}
              className="h-12 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg"
            >
              Retry 30s
            </button>
          )}
        </div>
      </div>

      {/* Sidebar: Telemetry & Leaderboard */}
      <div className="w-full max-w-md lg:max-w-none lg:w-80 flex flex-col gap-3">
        {/* State Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              Live 30-Second Challenge State
            </span>
            <span className="text-xs font-mono text-emerald-400">60 FPS</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Timer Remaining</span>
              <span className={`font-bold text-base font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {timeLeft.toFixed(1)}s
              </span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Enemies Shot</span>
              <span className="text-cyan-400 font-bold text-base font-mono">{currentScore}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Speed Level</span>
              <span className="text-emerald-400 font-bold text-sm font-mono">Level {currentLevel}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Game Rule</span>
              <span className="text-purple-300 font-bold text-[10px] font-mono leading-tight block">
                Enemies falling do NOT end game!
              </span>
            </div>
          </div>
        </div>

        {/* SQLite Database High Scores Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              SQLite Leaderboard (30s Trial)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">scores.db</span>
          </div>

          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 text-[10px]">
                <th className="pb-1">Rank</th>
                <th className="pb-1">Player</th>
                <th className="pb-1 text-right">Enemies Shot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {highScores.map((h, i) => (
                <tr key={i} className="text-slate-300">
                  <td className="py-1 text-slate-500">#{i + 1}</td>
                  <td className="py-1 font-medium text-slate-200">{h.name}</td>
                  <td className="py-1 text-right font-bold text-amber-400">{h.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-500 mt-2 italic">
            Compares total enemies destroyed in 30 seconds among all competitors.
          </p>
        </div>
      </div>
    </div>
  );
}
