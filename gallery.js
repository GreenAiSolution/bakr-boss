// gallery.js — fills a gallery page (rings.html, chains.html, ...) from the list in bakr.js.
(function () {
  const all = window.BAKR_GALLERY, key = document.body.dataset.gallery;
  const at = all.findIndex((g) => g.key === key), g = all[at];
  if (!g) return;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const pad = (n) => String(n).padStart(2, '0');

  document.getElementById('plates').innerHTML = g.pieces.map((p, i) => {
    const href = 'index.html?piece=' + g.key + '&about=' + encodeURIComponent(p.name) + '#start';
    const face = p.photo
      ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<svg viewBox="0 0 120 120" aria-hidden="true">' + p.art + '</svg>';
    return '<li class="plate reveal' + (p.open ? ' plate-open' : '') + '">' +
      '<a href="' + href + '">' +
      '<div class="plate-face">' + face + '<span class="plate-num">' + g.code + ' · ' + pad(i + 1) + '</span></div>' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<p>' + esc(p.note) + '</p>' +
      '<span class="plate-go">' + (p.open ? 'Describe it to Boston' : 'Ask about this') + ' <i aria-hidden="true">→</i></span>' +
      '</a></li>';
  }).join('');

  const n = (at + 1) % all.length, next = all[n];
  document.getElementById('next').innerHTML =
    '<a class="row" href="' + next.file + '"><span class="num">' + pad(n + 1) + '</span><h3>' + next.name + '</h3>' +
    '<p>Next in the gallery</p><span class="row-arrow" aria-hidden="true">→</span></a>';
})();
