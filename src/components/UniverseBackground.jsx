import { useEffect, useRef } from 'react';

// Animated starfield + constellation lines drawn on a canvas, with a couple of
// CSS planets orbiting. Sits behind the hero ("Welcome to my universe").
export default function UniverseBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let stars = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      // Layout can still be settling on mount (fonts/images), which would give
      // us a zero-sized canvas — skip until we get real dimensions.
      if (rect.width < 1 || rect.height < 1) return;
      if (Math.round(rect.width) === Math.round(w) && Math.round(rect.height) === Math.round(h))
        return;

      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(140, Math.floor((w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        tw: Math.random() * Math.PI * 2, // twinkle phase
      }));
    };

    const draw = () => {
      if (w < 1 || h < 1) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // Constellation lines between nearby stars.
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.35;
            ctx.strokeStyle = `rgba(255, 90, 134, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Stars
      const t = Date.now() * 0.002;
      for (const s of stars) {
        if (!reduce) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(t + s.tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 236, 255, ${0.35 + twinkle * 0.55})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    // ResizeObserver keeps the canvas in sync as the hero settles and on resize.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* nebula tint */}
      <div className="absolute inset-0 bg-nebula-fade" />
      <div className="absolute inset-0 bg-radial-fade" />

      {/* constellation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Planets */}
      {/* large ringed planet, top-right */}
      <div className="absolute -right-10 top-16 h-40 w-40 opacity-80 sm:h-52 sm:w-52">
        <div className="animate-spin-slow absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 rotate-[24deg] rounded-[50%] border border-accent/25" />
          <div className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rotate-[24deg] rounded-[50%] border border-white/10" />
        </div>
        <div
          className="absolute inset-2 rounded-full blur-[1px]"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #ff7aa0 0%, #ff014f 38%, #5c0722 78%, #23040f 100%)',
            boxShadow: '0 0 60px -6px rgba(255,1,79,0.55)',
          }}
        />
      </div>

      {/* small purple moon — parked in the gap between the copy and the portrait */}
      <div
        className="absolute left-[54%] top-[58%] hidden h-14 w-14 rounded-full blur-[0.5px] opacity-80 sm:block"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, #b98cff 0%, #6f3bd6 45%, #2a1140 100%)',
          boxShadow: '0 0 40px -8px rgba(122,60,214,0.6)',
        }}
      />
    </div>
  );
}
