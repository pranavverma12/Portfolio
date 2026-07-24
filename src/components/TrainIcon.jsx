// A small side-on locomotive that rides the rail.
export default function TrainIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 96 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="loco" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a86" />
          <stop offset="1" stopColor="#ff014f" />
        </linearGradient>
      </defs>
      {/* body */}
      <path
        d="M10 40 L10 20 Q10 12 18 12 L58 12 Q64 12 68 17 L82 34 Q86 39 86 44 L86 40 L10 40 Z"
        fill="url(#loco)"
        stroke="#2a0311"
        strokeWidth="1.5"
      />
      {/* cabin windows */}
      <rect x="18" y="18" width="12" height="10" rx="2" fill="#0d1013" opacity="0.85" />
      <rect x="34" y="18" width="12" height="10" rx="2" fill="#0d1013" opacity="0.85" />
      <rect x="52" y="20" width="10" height="9" rx="2" fill="#0d1013" opacity="0.85" />
      {/* chimney + smoke */}
      <rect x="20" y="4" width="7" height="9" rx="2" fill="url(#loco)" />
      <circle cx="24" cy="2" r="3" fill="#c4cfde" opacity="0.35" />
      <circle cx="16" cy="1" r="2" fill="#c4cfde" opacity="0.25" />
      {/* light */}
      <circle cx="83" cy="36" r="3.2" fill="#ffe08a" />
      {/* wheels */}
      <circle cx="26" cy="44" r="8" fill="#15181d" stroke="#ff5a86" strokeWidth="2.5" />
      <circle cx="52" cy="44" r="8" fill="#15181d" stroke="#ff5a86" strokeWidth="2.5" />
      <circle cx="74" cy="44" r="6" fill="#15181d" stroke="#ff5a86" strokeWidth="2.5" />
      <circle cx="26" cy="44" r="2" fill="#ff5a86" />
      <circle cx="52" cy="44" r="2" fill="#ff5a86" />
      <circle cx="74" cy="44" r="1.6" fill="#ff5a86" />
    </svg>
  );
}
