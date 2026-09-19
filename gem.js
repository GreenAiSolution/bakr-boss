// gem.js — draws a ring from straight above, stone up, and lights it from the cursor.
// No libraries. Each facet is a real polygon with a real normal; the sparkle is the
// light direction sweeping across those normals.
(function () {
  const TAU = Math.PI * 2;

  // One stone per month (traditional birthstones). h = hue, s = saturation.
  const STONES = [
    { key: 'garnet', name: 'Garnet', month: 'January', h: 352, s: 78 },
    { key: 'amethyst', name: 'Amethyst', month: 'February', h: 276, s: 62 },
    { key: 'aquamarine', name: 'Aquamarine', month: 'March', h: 192, s: 48 },
    { key: 'diamond', name: 'Diamond', month: 'April', h: 214, s: 7 },
    { key: 'emerald', name: 'Emerald', month: 'May', h: 152, s: 80 },
    { key: 'alexandrite', name: 'Alexandrite', month: 'June', h: 172, s: 52 },
    { key: 'ruby', name: 'Ruby', month: 'July', h: 340, s: 88 },
    { key: 'peridot', name: 'Peridot', month: 'August', h: 78, s: 68 },
    { key: 'sapphire', name: 'Sapphire', month: 'September', h: 224, s: 84 },
    { key: 'tourmaline', name: 'Tourmaline', month: 'October', h: 326, s: 66 },
    { key: 'citrine', name: 'Citrine', month: 'November', h: 36, s: 86 },
    { key: 'tanzanite', name: 'Tanzanite', month: 'December', h: 250, s: 66 },
  ];

  const METALS = [
    { key: 'yellow', name: 'Yellow gold', stops: ['#5d4315', '#f3d58a', '#b98c34', '#fff1c4', '#8a6420'] },
    { key: 'white', name: 'White gold', stops: ['#4b4c4f', '#eeeeec', '#a3a5a8', '#ffffff', '#6d6f73'] },
    { key: 'rose', name: 'Rose gold', stops: ['#5e3325', '#f4c3ad', '#c08268', '#ffe6da', '#8b4f3b'] },
  ];

  // warp(x, y) bends the round template into the other outlines.
  const CUTS = [
    { key: 'round', name: 'Round brilliant', family: 'brilliant', size: 1, prongs: [45, 135, 225, 315], warp: (x, y) => [x, y] },
    { key: 'oval', name: 'Oval', family: 'brilliant', size: 1.14, prongs: [52, 128, 232, 308], warp: (x, y) => [x * 0.73, y] },
    {
      key: 'cushion', name: 'Cushion', family: 'brilliant', size: 1.02, prongs: [45, 135, 225, 315],
      warp: (x, y) => {
        const r = Math.hypot(x, y) || 1e-6, c = Math.abs(x / r), s = Math.abs(y / r);
        const k = 1 / Math.pow(Math.pow(c, 4) + Math.pow(s, 4), 0.25);
        return [x * k * 0.9, y * k * 0.9];
      },
    },
    {
      key: 'pear', name: 'Pear', family: 'brilliant', size: 1.16, prongs: [270, 28, 152],
      warp: (x, y) => { const t = Math.max(0, -y); return [x * 0.74 * (1 - 0.6 * t), y * (1 + 0.34 * t) + 0.12]; },
    },
    {
      key: 'marquise', name: 'Marquise', family: 'brilliant', size: 1.2, prongs: [270, 90, 20, 160, 200, 340],
      warp: (x, y) => [x * 0.5 * (1 - 0.42 * y * y), y * (1 + 0.16 * Math.abs(y))],
    },
    { key: 'emerald', name: 'Emerald cut', family: 'step', size: 1.12, a: 0.7, b: 1, c: 0.2 },
    { key: 'asscher', name: 'Asscher', family: 'step', size: 1, a: 0.94, b: 0.94, c: 0.3 },
  ];

  function hash(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

  function facet(pts, type, i) {
    // Newell's method — holds up when a kite is not perfectly flat.
    let nx = 0, ny = 0, nz = 0, cx = 0, cy = 0;
    for (let k = 0; k < pts.length; k++) {
      const p = pts[k], q = pts[(k + 1) % pts.length];
      nx += (p[1] - q[1]) * (p[2] + q[2]);
      ny += (p[2] - q[2]) * (p[0] + q[0]);
      nz += (p[0] - q[0]) * (p[1] + q[1]);
      cx += p[0]; cy += p[1];
    }
    if (nz < 0) { nx = -nx; ny = -ny; nz = -nz; }
    const l = Math.hypot(nx, ny, nz) || 1;
    return { p: pts, type, h: hash(i + type * 53), n: [nx / l, ny / l, nz / l], c: [cx / pts.length, cy / pts.length] };
  }

  function build(cut) {
    const crown = [], pav = [], prongs = [];
    let outline = [];
    if (cut.family === 'brilliant') {
      const n = 8, W = (p) => { const w = cut.warp(p[0], p[1]); return [w[0], w[1], p[2]]; };
      const P = (r, a, z) => W([r * Math.cos(a), r * Math.sin(a), z]);
      const step = TAU / n, off = -Math.PI / 2 + step / 2;
      const table = [];
      for (let k = 0; k < n; k++) {
        const a0 = off + k * step, a1 = a0 + step, am = a0 + step / 2, ap = a0 - step / 2;
        const T0 = P(0.52, a0, 0.3), T1 = P(0.52, a1, 0.3);
        const S = P(0.75, am, 0.17), Sp = P(0.75, ap, 0.17);
        const G0 = P(1, a0, 0), G1 = P(1, a1, 0), M = P(1, am, 0);
        table.push(T0);
        crown.push(facet([T0, S, T1], 1, k));
        crown.push(facet([T0, Sp, G0, S], 2, k));
        crown.push(facet([S, G0, M], 3, k));
        crown.push(facet([S, M, G1], 4, k));
        const C = P(0, 0, -0.86), L = P(0.3, am, -0.62), Lp = P(0.3, ap, -0.62);
        pav.push(facet([C, Lp, G0, L], 5, k));
        pav.push(facet([L, G0, M], 6, k));
        pav.push(facet([L, M, G1], 7, k));
      }
      crown.unshift(facet(table, 0, 0));
      for (let i = 0; i < 96; i++) { const a = (i / 96) * TAU; outline.push(P(1, a, 0)); }
      cut.prongs.forEach((deg) => prongs.push(P(0.985, (deg * Math.PI) / 180, 0)));
    } else {
      const { a, b, c } = cut;
      const ring = (s, z, cs) => {
        const A = a * s, B = b * s, Cc = c * (cs === undefined ? s : cs);
        return [[A - Cc, -B], [A, -B + Cc], [A, B - Cc], [A - Cc, B], [-A + Cc, B], [-A, B - Cc], [-A, -B + Cc], [-A + Cc, -B]].map((p) => [p[0], p[1], z]);
      };
      const cr = [ring(1, 0), ring(0.87, 0.1), ring(0.74, 0.18), ring(0.6, 0.24)];
      for (let r = 0; r < 3; r++) for (let k = 0; k < 8; k++) {
        crown.push(facet([cr[r][k], cr[r][(k + 1) % 8], cr[r + 1][(k + 1) % 8], cr[r + 1][k]], 1 + r, k));
      }
      crown.unshift(facet(cr[3], 0, 0));
      const pr = [ring(1, 0), ring(0.74, -0.3), ring(0.48, -0.55), ring(0.22, -0.74, 0.1)];
      for (let r = 0; r < 3; r++) for (let k = 0; k < 8; k++) {
        pav.push(facet([pr[r][k], pr[r][(k + 1) % 8], pr[r + 1][(k + 1) % 8], pr[r + 1][k]], 5 + r, k));
      }
      pav.push(facet(pr[3], 8, 0));
      outline = cr[0];
      [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach((q) => prongs.push([q[0] * (a - c * 0.5), q[1] * (b - c * 0.5), 0]));
    }
    return { crown, pav, outline, prongs, step: cut.family === 'step' };
  }

  function path(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  }

  function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  class GemView {
    // opts: cx, cy (0..1 of the canvas), radius (share of the short side), angle (deg), ground: 'paper' | 'velvet'
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.o = Object.assign({ cx: 0.5, cy: 0.5, radius: 0.3, angle: -18, ground: 'paper', band: 2.7 }, opts || {});
      this.state = { cut: CUTS[0], stone: STONES[3], metal: METALS[0] };
      this.geo = build(this.state.cut);
      this.light = [0.4, -0.5];
      this.target = null;
      this.lastMove = 0;
      this.visible = true;
      this.pop = 1;
      this.resize();
      window.addEventListener('resize', () => this.resize());
      if ('ResizeObserver' in window) new ResizeObserver(() => this.resize()).observe(canvas);
      window.addEventListener('pointermove', (e) => this.onPointer(e), { passive: true });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((en) => { this.visible = en[0].isIntersecting; }).observe(canvas);
      }
      const loop = (t) => { if (this.visible) this.frame(t); requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }

    set(next) {
      if (next.cut && next.cut !== this.state.cut) { this.state.cut = next.cut; this.geo = build(next.cut); this.pop = 0; }
      if (next.stone && next.stone !== this.state.stone) { this.state.stone = next.stone; this.pop = Math.min(this.pop, 0.4); }
      if (next.metal) this.state.metal = next.metal;
    }

    resize() {
      const r = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = Math.max(10, r.width); this.h = Math.max(10, r.height); this.dpr = dpr;
      this.canvas.width = Math.round(this.w * dpr);
      this.canvas.height = Math.round(this.h * dpr);
    }

    onPointer(e) {
      const r = this.canvas.getBoundingClientRect();
      const gx = r.left + r.width * this.o.cx, gy = r.top + r.height * this.o.cy;
      const k = Math.max(260, Math.min(window.innerWidth, window.innerHeight) * 0.55);
      this.target = [Math.max(-1, Math.min(1, (e.clientX - gx) / k)), Math.max(-1, Math.min(1, (e.clientY - gy) / k))];
      this.lastMove = performance.now();
    }

    tone(v, fire, f) {
      const st = this.state.stone;
      const l = 7 + 86 * Math.pow(v, 1.15);
      let h = st.h, s = st.s * (1 - 0.62 * v * v);
      if (fire > 0 && v > 0.72 && f.h > 0.62) { h = (f.h * 997) % 360; s = 70 * fire + s * (1 - fire); }
      return 'hsl(' + h.toFixed(0) + ',' + s.toFixed(0) + '%,' + l.toFixed(0) + '%)';
    }

    drawPavilion(L, phase) {
      const ctx = this.ctx, freq = this.geo.step ? 5.2 : 7.4;
      for (const f of this.geo.pav) {
        const d = f.n[0] * L[0] + f.n[1] * L[1];
        let v = 0.5 + 0.5 * Math.sin(d * freq + f.type * 1.9 + f.h * 0.9 + phase);
        v = smooth(0.28, 0.72, v) * (0.35 + 0.65 * smooth(-0.6, 0.9, d + 0.4));
        path(ctx, f.p);
        ctx.fillStyle = this.tone(v, 0.75, f);
        ctx.fill();
      }
    }

    drawBand(L) {
      const ctx = this.ctx, m = this.state.metal.stops, B = this.o.band;
      const hw0 = 0.2, hw1 = 0.3;
      const shape = () => {
        ctx.beginPath();
        ctx.moveTo(-B, -hw1 * 0.86);
        ctx.quadraticCurveTo(-B * 0.45, -hw1, 0, -hw0);
        ctx.quadraticCurveTo(B * 0.45, -hw1, B, -hw1 * 0.86);
        ctx.quadraticCurveTo(B + 0.16, 0, B, hw1 * 0.86);
        ctx.quadraticCurveTo(B * 0.45, hw1, 0, hw0);
        ctx.quadraticCurveTo(-B * 0.45, hw1, -B, hw1 * 0.86);
        ctx.quadraticCurveTo(-B - 0.16, 0, -B, -hw1 * 0.86);
        ctx.closePath();
      };
      const streak = Math.max(0.18, Math.min(0.82, 0.5 + L[1] * 0.3));
      const g = ctx.createLinearGradient(0, -hw1, 0, hw1);
      g.addColorStop(0, m[0]);
      g.addColorStop(Math.max(0.04, streak - 0.2), m[2]);
      g.addColorStop(streak, m[3]);
      g.addColorStop(Math.min(0.96, streak + 0.16), m[1]);
      g.addColorStop(Math.min(0.98, streak + 0.3), m[4]);
      g.addColorStop(1, m[0]);
      shape();
      if (this.o.ground === 'paper') {
        ctx.save();
        ctx.shadowColor = 'rgba(46,30,12,0.34)';
        ctx.shadowBlur = 26 * this.dpr;
        ctx.shadowOffsetX = -L[0] * 16 * this.dpr + 2;
        ctx.shadowOffsetY = -L[1] * 16 * this.dpr + 10 * this.dpr;
        ctx.fillStyle = g; ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = g; ctx.fill();
      // the shank curves down and away at both ends
      const e = ctx.createLinearGradient(-B - 0.16, 0, B + 0.16, 0);
      e.addColorStop(0, 'rgba(0,0,0,0.72)'); e.addColorStop(0.2, 'rgba(0,0,0,0.12)');
      e.addColorStop(0.5 + L[0] * 0.18, 'rgba(255,255,255,0.1)');
      e.addColorStop(0.8, 'rgba(0,0,0,0.12)'); e.addColorStop(1, 'rgba(0,0,0,0.72)');
      shape(); ctx.fillStyle = e; ctx.fill();
    }

    drawProng(p, L) {
      const ctx = this.ctx, m = this.state.metal.stops, r = 0.082;
      const g = ctx.createRadialGradient(p[0] + L[0] * r * 0.5, p[1] + L[1] * r * 0.5, r * 0.05, p[0], p[1], r);
      g.addColorStop(0, m[3]); g.addColorStop(0.45, m[1]); g.addColorStop(0.8, m[2]); g.addColorStop(1, m[0]);
      ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fillStyle = g; ctx.fill();
    }

    glint(x, y, size, alpha) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(x, y);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      g.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
      g.addColorStop(0.25, 'rgba(255,250,235,' + alpha * 0.45 + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      const t = size * 0.045;
      ctx.moveTo(0, -size); ctx.lineTo(t, -t); ctx.lineTo(size, 0); ctx.lineTo(t, t);
      ctx.lineTo(0, size); ctx.lineTo(-t, t); ctx.lineTo(-size, 0); ctx.lineTo(-t, -t);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    frame(t) {
      const ctx = this.ctx, o = this.o, dpr = this.dpr;
      // light: follow the cursor; left alone, it drifts in a slow circle
      const idle = !this.target || t - this.lastMove > 2600;
      const want = idle ? [Math.cos(t / 2300) * 0.62, Math.sin(t / 1700) * 0.55 - 0.1] : this.target;
      this.light[0] += (want[0] - this.light[0]) * (idle ? 0.03 : 0.12);
      this.light[1] += (want[1] - this.light[1]) * (idle ? 0.03 : 0.12);
      this.pop += (1 - this.pop) * 0.09;

      const ang = (o.angle * Math.PI) / 180, ca = Math.cos(-ang), sa = Math.sin(-ang);
      const lx = this.light[0] * ca - this.light[1] * sa, ly = this.light[0] * sa + this.light[1] * ca;
      const lz = 0.85, ll = Math.hypot(lx, ly, lz);
      const L = [lx / ll, ly / ll, lz / ll];

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, this.w, this.h);
      const R = Math.min(this.w, this.h) * o.radius;
      ctx.translate(this.w * o.cx, this.h * o.cy);
      ctx.rotate(ang);
      ctx.scale(R, R);

      this.drawBand(L);

      const S = this.state.cut.size * (0.9 + 0.1 * this.pop);
      ctx.save();
      ctx.scale(S, S);
      ctx.globalAlpha = Math.min(1, this.pop * 1.4);

      // seat under the stone
      path(ctx, this.geo.outline);
      ctx.save();
      ctx.shadowColor = o.ground === 'paper' ? 'rgba(30,18,6,0.5)' : 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 22 * dpr; ctx.shadowOffsetX = -L[0] * 12 * dpr; ctx.shadowOffsetY = (-L[1] * 12 + 8) * dpr;
      ctx.fillStyle = this.tone(0.05, 0, this.geo.pav[0]); ctx.fill();
      ctx.restore();

      ctx.save();
      path(ctx, this.geo.outline); ctx.clip();
      this.drawPavilion(L, 0);
      // through each crown facet the pavilion shows again, shifted — that is the broken-up look of a cut stone
      for (let i = 1; i < this.geo.crown.length; i++) {
        const f = this.geo.crown[i];
        ctx.save();
        path(ctx, f.p); ctx.clip();
        ctx.translate(f.c[0], f.c[1]);
        ctx.rotate((f.h - 0.5) * 0.7);
        ctx.scale(0.72, 0.72);
        ctx.translate(-f.c[0] + f.n[0] * 0.42, -f.c[1] + f.n[1] * 0.42);
        this.drawPavilion(L, 1.3 + f.h * 4);
        ctx.restore();
      }
      // crown: surface light on top of what shows through
      const glints = [];
      for (const f of this.geo.crown) {
        const nl = f.n[0] * L[0] + f.n[1] * L[1] + f.n[2] * L[2];
        const rz = 2 * nl * f.n[2] - L[2];
        const spec = Math.pow(Math.max(0, rz), f.type === 0 ? 60 : 26);
        path(ctx, f.p);
        if (spec > 0.02) { ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.85, spec * 0.9).toFixed(3) + ')'; ctx.fill(); }
        else if (nl < 0.62) { ctx.fillStyle = 'rgba(0,0,0,' + ((0.62 - nl) * 0.42).toFixed(3) + ')'; ctx.fill(); }
        ctx.lineWidth = 0.005; ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.stroke();
        if (spec > 0.55 && f.type !== 0) glints.push([f.c[0], f.c[1], spec]);
      }
      ctx.restore();

      path(ctx, this.geo.outline);
      ctx.lineWidth = 0.014; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.stroke();
      for (const p of this.geo.prongs) this.drawProng(p, L);
      for (const g of glints) this.glint(g[0], g[1], 0.22 + g[2] * 0.5, Math.min(1, g[2]));
      ctx.restore();
    }
  }

  // A date picks its own ring: month -> stone, day -> cut, year -> metal.
  function fromDate(d) {
    return {
      stone: STONES[d.getMonth()],
      cut: CUTS[(d.getDate() - 1) % CUTS.length],
      metal: METALS[d.getFullYear() % METALS.length],
    };
  }

  window.BakrGem = { GemView, STONES, CUTS, METALS, fromDate };
})();
