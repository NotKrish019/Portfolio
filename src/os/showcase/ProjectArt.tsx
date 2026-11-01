/**
 * Concept illustrations for each project (drawn in SVG, not screenshots).
 * They visualise what each system does in the same flat, pixel-ish style as the OS.
 */
const frame = { width: '100%', height: '100%', shapeRendering: 'crispEdges' as const };

function Jaldrishti({ accent }: { accent: string }) {
  // A stepwell (baoli) seen from above, with a segmentation mask over a damaged step.
  const steps = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 400 200" {...frame} role="img" aria-label="Illustration: stepwell with a segmentation mask over damaged steps">
      <rect width="400" height="200" fill="#efe6d2" />
      {steps.map((i) => (
        <rect key={i} x={70 + i * 16} y={14 + i * 12} width={260 - i * 32} height={172 - i * 24} fill={i % 2 ? '#d9c39a' : '#c9ad7f'} stroke="#7a5c33" />
      ))}
      <rect x="166" y="86" width="68" height="28" fill="#3d8fb0" />
      <rect x="170" y="92" width="20" height="2" fill="#bfe6f5" />
      <rect x="200" y="104" width="24" height="2" fill="#bfe6f5" />
      <path d="M96 40 L150 34 L162 62 L120 74 L92 64 Z" fill={accent} fillOpacity="0.35" stroke={accent} strokeWidth="2" strokeDasharray="6 3" />
      <path d="M104 46 l14 10 l8 -4 l12 12" stroke="#5a3d1c" strokeWidth="2" fill="none" />
      <rect x="92" y="18" width="66" height="14" fill={accent} />
      <text x="96" y="29" fontFamily="MSSans, Arial" fontSize="11" fill="#fff">damage</text>
      <rect x="270" y="150" width="114" height="36" fill="#fff" stroke="#000" />
      <text x="278" y="165" fontFamily="MSSans, Arial" fontSize="11">YOLOv8-Seg</text>
      <text x="278" y="179" fontFamily="MSSans, Arial" fontSize="11" fill="#555">mask → restore plan</text>
    </svg>
  );
}

function Drishti({ accent }: { accent: string }) {
  // Network flow graph with one flagged node and an evidence trail.
  const nodes: [number, number][] = [
    [60, 60], [60, 140], [150, 40], [150, 100], [150, 160], [250, 70], [250, 140], [330, 100],
  ];
  const edges: [number, number][] = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7]];
  const hot = new Set([3, 6, 7]);
  return (
    <svg viewBox="0 0 400 200" {...frame} role="img" aria-label="Illustration: network flow graph with a flagged threat path">
      <rect width="400" height="200" fill="#10181a" />
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={i * 20} y="0" width="1" height="200" fill="#1b2a2d" />
      ))}
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={hot.has(a) && hot.has(b) ? accent : '#3e6a6e'}
          strokeWidth={hot.has(a) && hot.has(b) ? 3 : 1.5}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <rect key={i} x={x - 7} y={y - 7} width="14" height="14" fill={hot.has(i) ? accent : '#6aa3a8'} stroke="#000" />
      ))}
      <rect x="296" y="14" width="92" height="44" fill="#c0c0c0" stroke="#000" />
      <rect x="296" y="14" width="92" height="12" fill={accent} />
      <text x="300" y="24" fontFamily="MSSans, Arial" fontSize="10" fill="#fff">ALERT</text>
      <text x="300" y="39" fontFamily="MSSans, Arial" fontSize="10">risk: HIGH</text>
      <text x="300" y="52" fontFamily="MSSans, Arial" fontSize="10">analyst review</text>
      <text x="12" y="190" fontFamily="VT323, monospace" fontSize="16" fill="#6aa3a8">8.85M flows ▸ ensemble ▸ evidence graph</text>
    </svg>
  );
}

function Back2u({ accent }: { accent: string }) {
  // Text query + photo, matched to the same physical item.
  return (
    <svg viewBox="0 0 400 200" {...frame} role="img" aria-label="Illustration: text and image query matched to the same lost item">
      <rect width="400" height="200" fill="#e9f1ea" />
      <rect x="16" y="28" width="130" height="34" fill="#fff" stroke="#000" />
      <text x="24" y="49" fontFamily="MSSans, Arial" fontSize="11">"blue bottle, dent"</text>
      <rect x="16" y="88" width="130" height="92" fill="#fff" stroke="#000" />
      <rect x="66" y="100" width="30" height="70" fill="#2b5ea8" stroke="#000" />
      <rect x="72" y="94" width="18" height="8" fill="#000" />
      <path d="M66 130 l8 6 l-8 4" fill="#e9f1ea" />
      <line x1="146" y1="45" x2="220" y2="100" stroke="#000" strokeDasharray="4 3" />
      <line x1="146" y1="134" x2="220" y2="100" stroke="#000" strokeDasharray="4 3" />
      <rect x="220" y="78" width="40" height="44" fill="#c0c0c0" stroke="#000" />
      <text x="226" y="104" fontFamily="MSSans, Arial" fontSize="10">rank</text>
      <line x1="260" y1="100" x2="282" y2="100" stroke="#000" strokeWidth="2" />
      <rect x="282" y="36" width="102" height="128" fill="#fff" stroke={accent} strokeWidth="3" />
      <rect x="318" y="56" width="30" height="70" fill="#2b5ea8" stroke="#000" />
      <rect x="324" y="50" width="18" height="8" fill="#000" />
      <path d="M318 86 l8 6 l-8 4" fill="#fff" />
      <rect x="282" y="138" width="102" height="26" fill={accent} />
      <text x="292" y="155" fontFamily="MSSans, Arial" fontSize="11" fill="#fff">same item ✓</text>
    </svg>
  );
}

export function ProjectArt({ id, accent }: { id: string; accent: string }) {
  const art = id === 'jaldrishti' ? <Jaldrishti accent={accent} /> : id === 'drishti' ? <Drishti accent={accent} /> : <Back2u accent={accent} />;
  return (
    <figure className="m-0 mb-8 mt-6 max-w-[640px]">
      <div className="aspect-[2/1] w-full border-2 border-black p-1">{art}</div>
      <figcaption className="mt-2 text-center">
        <p className="!text-[15px] italic text-[#555]">Concept illustration</p>
      </figcaption>
    </figure>
  );
}
