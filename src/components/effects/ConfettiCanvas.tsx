import React, { useEffect, useRef } from 'react';

export interface ConfettiCanvasProps {
  active?: boolean;
  durationMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  decay: number;
}

const COLORS = [
  '#F14E13', // İşler Turuncu
  '#FBBF24', // Amber Altın
  '#22C55E', // Zümrüt Yeşil
  '#3B82F6', // Elektrik Mavi
  '#A855F7', // Mor Combo
  '#EC4899', // Pembe
  '#FFFFFF', // Beyaz
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  active = true,
  durationMs = 4500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = Math.min(180, Math.floor(width / 7));

    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      const startX = fromLeft ? width * 0.15 : width * 0.85;
      const startY = height * 0.8;

      particles.push({
        x: startX + (Math.random() - 0.5) * 80,
        y: startY + (Math.random() - 0.5) * 40,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 8 + 4) + (Math.random() - 0.5) * 6,
        vy: -(Math.random() * 14 + 10),
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.2,
        width: Math.random() * 8 + 6,
        height: Math.random() * 6 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 1,
        decay: Math.random() * 0.006 + 0.003,
      });
    }

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      for (const p of particles) {
        if (p.opacity <= 0.01) continue;
        aliveCount++;

        // Fizik: yerçekimi ve hava sürtünmesi
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Yerçekimi
        p.vx *= 0.985;
        p.angle += p.vAngle;

        if (elapsed > 1200) {
          p.opacity = Math.max(0, p.opacity - p.decay);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }

      if (aliveCount > 0 && elapsed < durationMs) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, durationMs]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};

export default ConfettiCanvas;
