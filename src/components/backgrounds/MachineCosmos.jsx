import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import StarCanvas from './StarCanvas';
import { useSectionProgress } from '../../lib/useSectionProgress';

/*
 * The conceit: the machines are drawn in the same visual language as the stars.
 * A robot, a laptop and a neural net are plotted as constellations — nodes and
 * joining lines — so the "you're in my universe" metaphor carries into a
 * section about engineering, instead of switching to a different vocabulary.
 */

const ROBOT = {
  box: 100,
  nodes: [
    [30, 22], [70, 22], [78, 34], [78, 62], [70, 74], [30, 74], [22, 62], [22, 34],
    [50, 22], [50, 8],
    [38, 62], [62, 62],
  ],
  edges: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [8, 9], [10, 11],
  ],
  bright: [[38, 44], [62, 44], [50, 6]], // eyes + antenna lamp
};

const LAPTOP = {
  box: 100,
  nodes: [
    [22, 16], [78, 16], [78, 54], [22, 54],
    [12, 54], [88, 54], [95, 68], [5, 68],
  ],
  edges: [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
  ],
  // faint "code lines" on the screen
  rules: [
    [30, 27, 62, 27],
    [30, 34, 54, 34],
    [30, 41, 66, 41],
  ],
  bright: [[22, 16], [78, 54]],
};

function buildNeuralNet() {
  const layers = [
    [[10, 28], [10, 50], [10, 72]],
    [[42, 16], [42, 38], [42, 60], [42, 82]],
    [[74, 30], [74, 52], [74, 74]],
    [[95, 50]],
  ];
  const nodes = layers.flat();
  const edges = [];
  let offset = 0;
  for (let l = 0; l < layers.length - 1; l++) {
    const aStart = offset;
    const bStart = offset + layers[l].length;
    for (let i = 0; i < layers[l].length; i++) {
      for (let j = 0; j < layers[l + 1].length; j++) {
        edges.push([aStart + i, bStart + j]);
      }
    }
    offset += layers[l].length;
  }
  return { box: 100, nodes, edges, bright: [[95, 50]] };
}

const NEURAL = buildNeuralNet();

/** One constellation figure: joined edges, node dots, and a travelling signal. */
function Figure({ shape, className = '', tone = '#ff5a86', opacity = 0.5, pulse = true, delay = 0 }) {
  const reduce = useReducedMotion();
  const edgePath = shape.edges
    .map(([a, b]) => {
      const [x1, y1] = shape.nodes[a];
      const [x2, y2] = shape.nodes[b];
      return `M${x1} ${y1}L${x2} ${y2}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${shape.box} ${shape.box}`} className={className} aria-hidden="true" style={{ opacity }}>
      {/* joining lines */}
      <path d={edgePath} stroke={tone} strokeOpacity={0.34} strokeWidth={0.5} fill="none" strokeLinecap="round" />

      {/* travelling signal along the same geometry */}
      {pulse && !reduce && (
        <motion.path
          d={edgePath}
          stroke={tone}
          strokeOpacity={0.9}
          strokeWidth={0.8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="5 190"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -195 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay }}
        />
      )}

      {/* faint screen rules (laptop only) */}
      {shape.rules?.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tone} strokeOpacity={0.22} strokeWidth={0.5} strokeLinecap="round" />
      ))}

      {/* vertex stars */}
      {shape.nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={0.9} fill="#e7ecff" fillOpacity={0.75} />
      ))}

      {/* accent stars — the "eyes", the output neuron */}
      {shape.bright?.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2.6} fill={tone} fillOpacity={0.16} />
          <motion.circle
            cx={x}
            cy={y}
            r={1.5}
            fill={tone}
            animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 + delay }}
          />
        </g>
      ))}
    </svg>
  );
}

export default function MachineCosmos() {
  const ref = useRef(null);
  const progress = useSectionProgress(ref);

  // Parallax — each layer travels a different distance for depth.
  const yFar = useTransform(progress, [0, 1], [30, -30]);
  const yMid = useTransform(progress, [0, 1], [60, -60]);
  const yNear = useTransform(progress, [0, 1], [100, -100]);
  const ringSpin = useTransform(progress, [0, 1], [0, 26]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* deep-space wash */}
      <div className="absolute inset-0 bg-nebula-fade" />

      {/* drifting dust */}
      <StarCanvas density={13000} maxStars={90} linkDistance={104} speed={0.08} />

      {/* orbital scaffolding, far layer */}
      <motion.svg
        style={{ y: yFar, rotate: ringSpin }}
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-[42%] h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.5]"
      >
        {[42, 62, 84].map((r, i) => (
          <ellipse
            key={r}
            cx="100"
            cy="100"
            rx={r}
            ry={r * 0.42}
            fill="none"
            stroke="#ff5a86"
            strokeOpacity={0.12 - i * 0.025}
            strokeWidth={0.4}
          />
        ))}
      </motion.svg>

      {/* --- machine constellations --- */}
      <motion.div style={{ y: yMid }} className="absolute left-[4%] top-[12%] w-[150px] sm:w-[190px]">
        <Figure shape={ROBOT} className="h-auto w-full" opacity={0.5} delay={0} />
      </motion.div>

      <motion.div style={{ y: yNear }} className="absolute right-[3%] top-[26%] hidden w-[230px] sm:block lg:w-[300px]">
        <Figure shape={NEURAL} className="h-auto w-full" opacity={0.42} delay={1.6} />
      </motion.div>

      <motion.div style={{ y: yMid }} className="absolute bottom-[10%] left-[10%] hidden w-[170px] md:block lg:w-[210px]">
        <Figure shape={LAPTOP} className="h-auto w-full" opacity={0.4} delay={3.1} />
      </motion.div>

      <motion.div style={{ y: yFar }} className="absolute bottom-[22%] right-[16%] w-[110px] opacity-70 sm:w-[130px]">
        <Figure shape={ROBOT} className="h-auto w-full" opacity={0.24} pulse={false} />
      </motion.div>

      {/* vignette — keeps the centre calm so copy always wins */}
      <div className="absolute inset-0 [background:radial-gradient(58%_46%_at_50%_45%,rgba(13,16,19,0.92)_0%,rgba(13,16,19,0.5)_55%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
    </div>
  );
}
