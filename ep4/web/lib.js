// Core helpers: easing, keyframes, color, camera/parallax. Everything is a pure function of time.
const FPS = 60, W = 1080, H = 1920;
const INK = '#2a2233';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const E = {
  lin: t => t,
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  elastic: t => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1,
  sine: t => -(Math.cos(Math.PI * t) - 1) / 2,
};
// ramp from a to b over [t0,t1] with easing
const ramp = (t, t0, t1, a, b, e = E.inOut) => lerp(a, b, e(inv(t0, t1, t)));
// keyframes: [[t,v],[t,v],...] numeric
function kf(t, keys, e = E.inOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
      const ee = keys[i][2] || e;
      return lerp(v0, v1, ee(inv(t0, t1, t)));
    }
  }
  return keys[keys.length - 1][1];
}
// a pulse 0->1->0 centred at c with half-width w
const pulse = (t, c, w) => { const x = Math.abs(t - c) / w; return x >= 1 ? 0 : E.sine(1 - x); };

// deterministic random
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// colors
function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function rgb2hex(c) { return '#' + c.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join(''); }
const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => lerp(v, B[i], clamp(t)))); };

// auto blink: returns 0..1 closure amount
function autoBlink(t, seed = 0) {
  const period = 2.7 + (seed % 5) * 0.37;
  const ph = ((t + seed * 0.71) % period + period) % period;
  return ph < 0.14 ? Math.sin(ph / 0.14 * Math.PI) : 0;
}

// camera transform for a layer of depth d (0 = infinitely far, 1 = action plane, >1 foreground)
function layerT(cam, d) {
  const z = 1 + (cam.z - 1) * d;
  const r = (cam.r || 0) * Math.min(d, 1);
  return `translate(540 960) rotate(${r.toFixed(3)}) scale(${z.toFixed(4)}) translate(${(-540 - cam.x * d).toFixed(2)} ${(-960 - cam.y * d).toFixed(2)})`;
}

const f2 = n => (+n).toFixed(1);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
