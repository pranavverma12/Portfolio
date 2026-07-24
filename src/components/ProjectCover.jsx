import { useMemo, useId } from 'react';
import { seededRng } from '../lib/hash';

const VW = 400;
const VH = 250;

const rd = (n) => Math.round(n * 100) / 100;

function networkPaths(rand) {
  const nodes = Array.from({ length: 9 }, () => ({
    x: rd(30 + rand() * (VW - 60)),
    y: rd(30 + rand() * (VH - 60)),
  }));
  const lines = [];
  nodes.forEach((_, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.hypot(dx, dy) < 145) lines.push([i, j]);
    }
  });
  return { nodes, lines };
}

function flowNodes(rand) {
  const n = 5;
  return Array.from({ length: n }, (_, i) => ({
    x: rd(30 + (i * (VW - 60)) / (n - 1)),
    y: rd(VH / 2 + (rand() - 0.5) * 90),
  }));
}

function scatterDots(rand) {
  return Array.from({ length: 46 }, () => ({
    x: rd(20 + rand() * (VW - 40)),
    y: rd(20 + rand() * (VH - 40)),
    r: rd(1.6 + rand() * 3.2),
  }));
}

/**
 * Procedurally generated cover art, seeded off the project id so each card
 * gets a distinct but stable composition. Themed to the site accent.
 */
export default function ProjectCover({ kind = 'network', seed = 'x', tone = '#ff014f' }) {
  const uid = useId().replace(/:/g, '');
  const rand = useMemo(() => seededRng(seed), [seed]);

  const content = useMemo(() => {
    const c = tone;
    switch (kind) {
      case 'flow': {
        const nodes = flowNodes(rand);
        const d = nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ');
        return (
          <g>
            <path
              d={d}
              fill="none"
              stroke={c}
              strokeOpacity={0.45}
              strokeWidth={1.5}
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {nodes.map((n, i) => (
              <rect
                key={i}
                x={rd(n.x - 9)}
                y={rd(n.y - 9)}
                width={18}
                height={18}
                rx={5}
                fill="none"
                stroke={c}
                strokeOpacity={0.85}
                strokeWidth={1.4}
              />
            ))}
          </g>
        );
      }
      case 'scatter': {
        const dots = scatterDots(rand);
        const sorted = [...dots].sort((a, b) => a.x - b.x);
        const d = sorted
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${rd(VH - (p.x / VW) * 60 - 60 + (i % 5) * 4)}`)
          .join(' ');
        return (
          <g>
            <path d={d} fill="none" stroke={c} strokeOpacity={0.38} strokeWidth={1.5} />
            {dots.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={c} fillOpacity={0.4 + (i % 4) * 0.12} />
            ))}
          </g>
        );
      }
      case 'orbit': {
        const rings = [46, 76, 108];
        const dots = rings.map((r, i) => {
          const a = rand() * Math.PI * 2;
          return {
            x: rd(VW / 2 + Math.cos(a) * r),
            y: rd(VH / 2 + Math.sin(a) * r * 0.55),
            size: 3 + i,
          };
        });
        return (
          <g>
            {rings.map((r, i) => (
              <ellipse
                key={i}
                cx={VW / 2}
                cy={VH / 2}
                rx={r}
                ry={rd(r * 0.55)}
                fill="none"
                stroke={c}
                strokeOpacity={0.26}
                strokeWidth={1}
              />
            ))}
            <circle cx={VW / 2} cy={VH / 2} r={7} fill={c} fillOpacity={0.95} />
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={d.size} fill={c} fillOpacity={0.9} />
            ))}
          </g>
        );
      }
      case 'radial': {
        const spokes = 14;
        return (
          <g>
            {Array.from({ length: spokes }, (_, i) => {
              const a = (i / spokes) * Math.PI * 2;
              const len = 40 + rand() * 70;
              return (
                <line
                  key={i}
                  x1={VW / 2}
                  y1={VH / 2}
                  x2={rd(VW / 2 + Math.cos(a) * len)}
                  y2={rd(VH / 2 + Math.sin(a) * len * 0.6)}
                  stroke={c}
                  strokeOpacity={0.34}
                  strokeWidth={1}
                />
              );
            })}
            <circle cx={VW / 2} cy={VH / 2} r={5} fill={c} />
          </g>
        );
      }
      case 'network':
      default: {
        const { nodes, lines } = networkPaths(rand);
        return (
          <g>
            {lines.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                stroke={c}
                strokeOpacity={0.3}
                strokeWidth={1}
              />
            ))}
            {nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={i % 3 === 0 ? 4.5 : 2.6}
                fill={c}
                fillOpacity={i % 3 === 0 ? 0.95 : 0.6}
              />
            ))}
          </g>
        );
      }
    }
  }, [kind, rand, tone]);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* soft light pooling behind the geometry, so covers read as lit objects */}
        <radialGradient id={`glow-${uid}`} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor={tone} stopOpacity="0.18" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width={VW} height={VH} fill={`url(#glow-${uid})`} />
      <g filter={`url(#blur-${uid})`} opacity="0.5">
        {content}
      </g>
      {content}
    </svg>
  );
}
