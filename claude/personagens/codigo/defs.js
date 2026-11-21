// SVG <defs> required by the character rig (fabric/skin textures, dress patterns, head clip).
// Insert DEFS once per <svg> before drawing characters.
function _pat() {
  const r = rng(99); let plaster = '', fabric = '', skin = '';
  for (let i = 0; i < 46; i++) plaster += `<ellipse cx="${(r() * 140).toFixed(1)}" cy="${(r() * 140).toFixed(1)}" rx="${(1 + r() * 4).toFixed(1)}" ry="${(0.8 + r() * 2).toFixed(1)}" fill="${r() < 0.6 ? '#2a2233' : '#ffffff'}" opacity="${(0.04 + r() * 0.07).toFixed(3)}"/>`;
  for (let i = 0; i < 8; i++) plaster += `<path d="M ${(r() * 140).toFixed(1)} ${(r() * 140).toFixed(1)} q ${(r() * 20 - 10).toFixed(1)} ${(r() * 10).toFixed(1)} ${(r() * 26 - 13).toFixed(1)} ${(r() * 14).toFixed(1)}" stroke="#2a2233" stroke-width="0.8" fill="none" opacity="0.07"/>`;
  for (let i = 0; i < 24; i++) fabric += `<circle cx="${(r() * 24).toFixed(1)}" cy="${(r() * 24).toFixed(1)}" r="0.55" fill="#2a2233" opacity="0.07"/>`;
  for (let i = 0; i < 30; i++) skin += `<circle cx="${(r() * 60).toFixed(1)}" cy="${(r() * 60).toFixed(1)}" r="${(0.4 + r() * 0.6).toFixed(1)}" fill="#8a4a3a" opacity="0.035"/>`;
  let wood = '', woodV = '';
  for (let i = 0; i < 6; i++) { const y = 6 + i * 11 + r() * 4; wood += `<path d="M 0 ${y.toFixed(1)} C 100 ${(y - 3).toFixed(1)} 200 ${(y + 4).toFixed(1)} 400 ${y.toFixed(1)}" stroke="#3a2010" stroke-width="1.4" fill="none" opacity="0.22"/>`; }
  for (let i = 0; i < 5; i++) { const x = 5 + i * 9 + r() * 3; woodV += `<path d="M ${x.toFixed(1)} 0 C ${(x + 3).toFixed(1)} 60 ${(x - 3).toFixed(1)} 120 ${x.toFixed(1)} 200" stroke="#2a1408" stroke-width="1.2" fill="none" opacity="0.25"/>`; }
  return `
 <pattern id="pPlaster" patternUnits="userSpaceOnUse" width="140" height="140">${plaster}</pattern>
 <pattern id="pFabric" patternUnits="userSpaceOnUse" width="24" height="24"><path d="M 0 0 L 24 24 M -6 18 L 6 30 M 18 -6 L 30 6" stroke="#2a2233" stroke-width="0.7" opacity="0.045"/>${fabric}</pattern>
 <pattern id="pSkin" patternUnits="userSpaceOnUse" width="60" height="60">${skin}</pattern>
 <pattern id="pStripes" patternUnits="userSpaceOnUse" width="60" height="60"><rect width="30" height="60" fill="#ffffff" opacity="0.07"/><circle cx="45" cy="15" r="2.4" fill="#a86a3a" opacity="0.14"/><circle cx="45" cy="45" r="2.4" fill="#a86a3a" opacity="0.14"/></pattern>
 <pattern id="pWood" patternUnits="userSpaceOnUse" width="400" height="70"><rect width="400" height="70" fill="none"/>${wood}<path d="M 0 69 H 400 M 160 0 V 70" stroke="#2a1408" stroke-width="2" opacity="0.3"/></pattern>
 <pattern id="pWoodV" patternUnits="userSpaceOnUse" width="48" height="200">${woodV}</pattern>
 <pattern id="pBrick" patternUnits="userSpaceOnUse" width="56" height="28"><path d="M 0 0 H 56 M 0 14 H 56 M 0 0 V 14 M 28 14 V 28" stroke="#2a1408" stroke-width="1.6" opacity="0.28"/><rect x="3" y="2" width="20" height="4" fill="#ffffff" opacity="0.08"/><rect x="31" y="16" width="20" height="4" fill="#ffffff" opacity="0.08"/></pattern>
 <pattern id="pTile" patternUnits="userSpaceOnUse" width="36" height="22"><path d="M 0 22 Q 9 10 18 22 Q 27 10 36 22" stroke="#2a1408" stroke-width="1.6" fill="none" opacity="0.32"/><path d="M -18 11 Q -9 -1 0 11 Q 9 -1 18 11 Q 27 -1 36 11" stroke="#2a1408" stroke-width="1.6" fill="none" opacity="0.32"/></pattern>
 <pattern id="pAsphalt" patternUnits="userSpaceOnUse" width="140" height="140">${plaster}${plaster.replace(/#2a2233/g, '#000000')}</pattern>
 <pattern id="pFlowers" patternUnits="userSpaceOnUse" width="56" height="56"><g transform="translate(14 14)"><circle r="6" cx="0" cy="-7" fill="#fff6e8"/><circle r="6" cx="7" cy="-2" fill="#fff6e8"/><circle r="6" cx="4" cy="6" fill="#fff6e8"/><circle r="6" cx="-4" cy="6" fill="#fff6e8"/><circle r="6" cx="-7" cy="-2" fill="#fff6e8"/><circle r="4" fill="#f2c230"/></g><g transform="translate(42 40) scale(0.8)"><circle r="6" cx="0" cy="-7" fill="#fff6e8"/><circle r="6" cx="7" cy="-2" fill="#fff6e8"/><circle r="6" cx="4" cy="6" fill="#fff6e8"/><circle r="6" cx="-4" cy="6" fill="#fff6e8"/><circle r="6" cx="-7" cy="-2" fill="#fff6e8"/><circle r="4" fill="#f2c230"/></g></pattern>
 <pattern id="pDots" patternUnits="userSpaceOnUse" width="34" height="34"><circle cx="8" cy="8" r="5" fill="#fff6e8" opacity="0.85"/><circle cx="25" cy="25" r="5" fill="#fff6e8" opacity="0.85"/></pattern>
 <pattern id="pStripeH" patternUnits="userSpaceOnUse" width="40" height="36"><rect y="0" width="40" height="14" fill="#fff6e8" opacity="0.85"/></pattern>
 <linearGradient id="gAO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1424" stop-opacity="0"/><stop offset="1" stop-color="#1b1424" stop-opacity="0.22"/></linearGradient>
 <clipPath id="clipHead"><circle cx="0" cy="-322" r="78"/></clipPath>`;
}
const DEFS = `<defs>${_pat()}
 <linearGradient id="gWallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.10"/><stop offset="1" stop-color="#2a2233" stop-opacity="0.14"/></linearGradient>
 <radialGradient id="gFace" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#c9a56a" stop-opacity="0.25"/></radialGradient>
 <radialGradient id="gVig" cx="0.5" cy="0.47" r="0.72"><stop offset="0.5" stop-color="#2a1a14" stop-opacity="0"/><stop offset="0.85" stop-color="#2a1a14" stop-opacity="0.28"/><stop offset="1" stop-color="#1a1010" stop-opacity="0.6"/></radialGradient>
 <linearGradient id="gGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2d0" stop-opacity="0.22"/><stop offset="0.45" stop-color="#fff2d0" stop-opacity="0"/></linearGradient>
</defs>`;
