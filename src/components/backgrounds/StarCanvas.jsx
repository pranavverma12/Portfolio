import { useEffect, useRef } from 'react';

/**
 * Reusable drifting starfield with optional constellation links.
 * Stars are distributed across `depths` parallax layers — nearer layers are
 * larger, brighter and drift faster, which is what sells the sense of volume.
 */
export default function StarCanvas({
  density = 9000, // lower = more stars
  link = true,
  linkDistance = 116,
  linkColor = '255, 90, 134',
  speed = 0.12,
  maxStars = 150,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let stars = [];
    let w = 0;
    let h = 0;

    const build = () => {
      const count = Math.min(maxStars, Math.floor((w * h) / density));
      stars = Array.from({ length: count }, () => {
        // depth 0 (far) → 1 (near)
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          depth,
          r: 0.4 + depth * 1.5,
          vx: (Math.random() - 0.5) * speed * (0.35 + depth),
          vy: (Math.random() - 0.5) * speed * (0.35 + depth),
          tw: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      if (Math.round(rect.width) === Math.round(w) && Math.round(rect.height) === Math.round(h)) return;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = () => {
      if (w < 1 || h < 1) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      if (link) {
        for (let i = 0; i < stars.length; i++) {
          const a = stars[i];
          for (let j = i + 1; j < stars.length; j++) {
            const b = stars[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < linkDistance) {
              // links fade with distance and with the pair's average depth
              const alpha = (1 - d / linkDistance) * 0.3 * (0.4 + (a.depth + b.depth) / 2);
              ctx.strokeStyle = `rgba(${linkColor}, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

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
        ctx.fillStyle = `rgba(231, 236, 255, ${(0.2 + twinkle * 0.5) * (0.35 + s.depth)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [density, link, linkDistance, linkColor, speed, maxStars]);

  return <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full ${className}`} />;
}
