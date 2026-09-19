// piece.js — the purchase page: piece.html?id=signet. Everything shown comes from the shop list in bakr.js.
(function () {
  const $ = (id) => document.getElementById(id);
  const shop = window.BAKR_SHOP, id = new URLSearchParams(location.search).get('id');
  const p = shop.find((x) => x.id === id) || shop[0];
  const g = window.BAKR_GALLERY.find((x) => x.key === p.in);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const face = (x) => x.photo
    ? '<img src="' + esc(x.photo) + '" alt="' + esc(x.name) + '">'
    : '<svg viewBox="0 0 120 120" aria-hidden="true">' + x.art + '</svg>';

  document.title = p.name + ' — BAKR';
  $('crumb').innerHTML = '<a href="index.html#shop">← From the bench</a>';
  $('kind').innerHTML = '<a href="' + g.file + '">' + g.name + '</a> · Made to order';
  $('face').innerHTML = face(p);
  $('name').textContent = p.name;
  $('price').textContent = window.bakrPrice(p.price);
  $('sample').hidden = !BAKR.samplePrices;
  $('metalLine').textContent = p.metal;
  $('note').textContent = p.note;
  $('sizeField').hidden = p.in !== 'rings';

  // choices: they travel with the order, they do not change the price
  let metal = 'Yellow gold';
  const metals = $('metals');
  ['Yellow gold', 'White gold', 'Rose gold'].forEach((m) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = m; b.setAttribute('aria-pressed', String(m === metal));
    b.addEventListener('click', () => { metal = m; metals.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); link(); });
    metals.appendChild(b);
  });

  const buy = $('buy');
  function link() {
    if (p.pay) { buy.href = p.pay; buy.textContent = 'Buy now · ' + window.bakrPrice(p.price); return; }
    const size = p.in === 'rings' && $('size').value ? ', size ' + $('size').value : '';
    const what = p.name + ', ' + metal.toLowerCase() + size + ' (' + window.bakrPrice(p.price) + ')';
    buy.href = 'index.html?piece=' + p.in + '&reserve=' + encodeURIComponent(what) + '#start';
    buy.textContent = 'Reserve this piece';
  }
  $('size').addEventListener('change', link);
  link();
  $('payNote').textContent = p.pay
    ? 'Secure checkout. Boston confirms your size and details before he starts.'
    : 'No payment is taken here. Boston confirms the details and the price with you before any work begins.';

  $('more').innerHTML = shop.filter((x) => x !== p).sort((a, b) => (b.in === p.in) - (a.in === p.in)).slice(0, 3).map((x) =>
    '<li class="plate reveal"><a href="piece.html?id=' + x.id + '"><div class="plate-face">' + face(x) + '</div>' +
    '<h3>' + esc(x.name) + '</h3><p>' + esc(x.metal) + '</p><span class="plate-price">' + window.bakrPrice(x.price) + '</span></a></li>').join('');
})();
