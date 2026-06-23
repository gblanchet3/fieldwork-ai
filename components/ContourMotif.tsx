// Topographic contour motif — an ownable brand mark that nods to mountain-west
// Boise and the "Fieldwork" name. Pure SVG, scales free, never reads as stock.
// Nested rings are one base loop scaled around its center.

const BASE =
  "M300 64 C 392 60 470 96 512 178 C 548 248 560 330 520 404 C 484 470 410 524 322 540 C 240 556 150 528 102 458 C 58 394 52 300 84 226 C 116 152 198 70 300 64 Z";

const RINGS = [1, 0.85, 0.7, 0.56, 0.43, 0.31, 0.2, 0.11];

export default function ContourMotif({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <svg viewBox="0 0 600 600" fill="none" className="w-full h-auto">
        <g stroke="#D97B2A" strokeLinejoin="round">
          {RINGS.map((s, i) => (
            <path
              key={i}
              d={BASE}
              transform={`translate(300 300) scale(${s}) translate(-300 -300)`}
              strokeWidth={1.4 / s}
              opacity={0.1 + i * 0.022}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
