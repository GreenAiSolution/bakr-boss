// shop.js — the carousel on the home page. Pieces and prices come from the shop list in bakr.js.
(function () {
  const track = document.getElementById('shopTrack');
  if (!track) return;
  const shop = window.BAKR_SHOP, esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const pad = (n) => String(n).padStart(2, '0');
  const group = (p) => window.BAKR_GALLERY.find((g) => g.key === p.in);

  track.innerHTML = shop.map((p, i) => {
    const face = p.photo
      ? '<img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy">'
      : '<svg viewBox="0 0 120 120" aria-hidden="true">' + p.art + '</svg>';
    return '<li class="card"><a href="piece.html?id=' + p.id + '">' +
      '<div class="card-face">' + face + '<span class="plate-num">' + group(p).name + ' · ' + pad(i + 1) + '</span><span class="card-view">View piece <i aria-hidden="true">→</i></span></div>' +
      '<div class="card-foot"><div><h3>' + esc(p.name) + '</h3><p>' + esc(p.metal) + '</p></div><strong>' + window.bakrPrice(p.price) + '</strong></div>' +
      '</a></li>';
  }).join('');
  document.getElementById('shopFine').hidden = !BAKR.samplePrices;

  const cards = track.children, count = document.getElementById('shopCount');
  const prev = document.getElementById('shopPrev'), next = document.getElementById('shopNext');
  const stepSize = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
  const update = () => {
    const at = Math.min(cards.length - 1, Math.round(track.scrollLeft / stepSize()));
    count.textContent = pad(at + 1) + ' / ' + pad(cards.length);
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft > track.scrollWidth - track.clientWidth - 4;
  };
  const move = (dir) => track.scrollBy({ left: dir * stepSize(), behavior: 'smooth' });
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
