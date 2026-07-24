import { techEntry } from '../lib/techIcons';

/**
 * A brand glyph for a technology. Falls back to a tinted monogram when
 * simple-icons has no mark for that brand.
 */
export default function TechIcon({ name, size = 16, className = '' }) {
  const { icon: IconCmp, color, mono } = techEntry(name);

  if (IconCmp) {
    return <IconCmp size={size} color={color} className={className} aria-hidden="true" />;
  }

  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[5px] font-bold leading-none ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(7, size * (mono.length > 2 ? 0.32 : 0.44)),
        color,
        background: `${color}22`,
        boxShadow: `inset 0 0 0 1px ${color}55`,
      }}
    >
      {mono}
    </span>
  );
}

/** A full pill: glyph + label, tinted to the brand colour. */
export function TechPill({ name, size = 15, className = '' }) {
  const { color } = techEntry(name);
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium ${className}`}
      style={{
        color: '#d7dde6',
        background: `linear-gradient(180deg, ${color}1c, ${color}0d)`,
        boxShadow: `inset 0 0 0 1px ${color}3d`,
      }}
    >
      <TechIcon name={name} size={size} />
      {name}
    </span>
  );
}
