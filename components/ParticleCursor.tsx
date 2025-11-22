import React, { useEffect, useRef } from 'react';
import { ParticleEffectType } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

const getParticleConfig = (effect: ParticleEffectType, isDark: boolean) => {
  switch(effect) {
    case 'soul': 
        return { colors: ['#3b82f6', '#60a5fa', '#93c5fd'], gravity: -0.5, drag: 0.98 };
    case 'void': 
        return { colors: ['#7e22ce', '#a855f7', '#d8b4fe'], gravity: 0, drag: 0.95 };
    case 'blood': 
        return { colors: ['#7f1d1d', '#b91c1c', '#ef4444'], gravity: 0.8, drag: 0.99 }; // Drips down
    case 'gold': 
        return { colors: ['#fbbf24', '#f59e0b', '#b45309', '#ffffff'], gravity: 0.2, drag: 0.95 };
    case 'fire':
    default:
        return isDark 
            ? { colors: ['#ff4500', '#ff8c00', '#ffd700', '#8a1c1c'], gravity: -0.8, drag: 0.96 } // Rises fast
            : { colors: ['#374151', '#6b7280', '#9ca3af'], gravity: -0.2, drag: 0.98 }; // Ash floats
  }
};

export const ParticleCursor: React.FC<{ effect: ParticleEffectType, isDark: boolean }> = ({ effect, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const lastPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Performance: Use 'lighter' for glowing fire effect in dark mode
      if (isDark && (effect === 'fire' || effect === 'soul' || effect === 'gold')) {
          ctx.globalCompositeOperation = 'lighter';
      } else {
          ctx.globalCompositeOperation = 'source-over';
      }

      const config = getParticleConfig(effect, isDark);
      
      // Spawn particles logic
      const dx = mouse.current.x - lastPos.current.x;
      const dy = mouse.current.y - lastPos.current.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      // Only spawn if moved significantly or strictly random chance to simulate idle burn
      if (dist > 2 || (effect === 'fire' && Math.random() > 0.9)) {
        // Limit spawn rate for performance
        const count = Math.min(3, Math.ceil(dist / 10)); 
        
        for(let i=0; i<count; i++) {
           // Interpolate position for smooth trail
           const t = Math.random();
           const spawnX = lastPos.current.x + (mouse.current.x - lastPos.current.x) * t;
           const spawnY = lastPos.current.y + (mouse.current.y - lastPos.current.y) * t;

           if (spawnX < 0) continue; // Don't spawn if mouse hasn't entered yet

           particles.current.push({
             x: spawnX + (Math.random() - 0.5) * 10,
             y: spawnY + (Math.random() - 0.5) * 10,
             vx: (Math.random() - 0.5) * 2,
             vy: (Math.random() - 0.5) * 2,
             life: 1.0,
             size: Math.random() * 4 + 2,
             color: config.colors[Math.floor(Math.random() * config.colors.length)]
           });
        }
      }
      
      lastPos.current = { ...mouse.current };

      // Update & Draw
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        
        p.life -= 0.02; // Fade speed
        p.x += p.vx;
        p.y += p.vy;
        p.vy += config.gravity * 0.2; // Gravity/Buoyancy
        p.vx *= config.drag;
        p.vy *= config.drag;
        p.size *= 0.95; // Shrink

        if (p.life <= 0 || p.size < 0.5) {
          particles.current.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Hard limit on particles to prevent lag
      if (particles.current.length > 100) {
          particles.current.splice(0, particles.current.length - 100);
      }
      
      rafRef.current = requestAnimationFrame(render);
    };
    
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [effect, isDark]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
};