(function () {
  const { GemView, CUTS } = window.BakrGem;
  const $ = (id) => document.getElementById(id);

  // ---- the ring lying on the wordmark. The chips under it change the cut, nothing more. ----
  const narrow = () => window.innerWidth < 900;
  const hero = new GemView($('heroGem'), { ground: 'paper', cx: narrow() ? 0.6 : 0.665, cy: 0.56, radius: narrow() ? 0.12 : 0.15, angle: -24 });
  window.addEventListener('resize', () => { hero.o.cx = narrow() ? 0.6 : 0.665; hero.o.radius = narrow() ? 0.12 : 0.15; });

  const cuts = $('cuts');
  const press = (key) => cuts.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.key === key)));
  CUTS.forEach((cut) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.key = cut.key;
    b.textContent = cut.name;
    b.addEventListener('click', () => { hero.set({ cut }); press(cut.key); });
    cuts.appendChild(b);
  });
  press(CUTS[0].key);

  // ---- arriving from a gallery page: index.html?piece=rings&about=Signet#start ----
  const q = new URLSearchParams(location.search);
  const from = (window.BAKR_GALLERY || []).find((g) => g.key === q.get('piece'));
  const about = (q.get('about') || '').trim().slice(0, 60);
  const reserve = (q.get('reserve') || '').trim().slice(0, 120);   // set by the purchase page
  const form = $('form');
  if (from) form.elements.piece.value = from.option;
  if (reserve) { $('carried').hidden = false; $('carriedLabel').textContent = 'You are reserving'; $('carriedText').textContent = reserve; }
  else if (from && about) { $('carried').hidden = false; $('carriedText').textContent = about + ' · ' + from.name; }

  // ---- inquiry: writes the message and emails it to Boston (BAKR.email) through formsubmit.co.
  // If the send fails, the written message shows with "Open in email" / "Copy" so nothing is lost. ----
  const sendBtn = form.querySelector('button[type=submit]');
  const fallback = (text, name, note) => {
    $('messageText').textContent = text;
    $('message').hidden = false;
    $('formNote').textContent = note;
    if (BAKR.email) { const m = $('mail'); m.hidden = false; m.href = 'mailto:' + BAKR.email + '?subject=' + encodeURIComponent('A piece for ' + name) + '&body=' + encodeURIComponent(text); }
    if (BAKR.instagram) { const d = $('dm'); d.hidden = false; d.href = 'https://ig.me/m/' + BAKR.instagram; }
    $('message').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form), name = (f.get('name') || '').trim(), reach = (f.get('reach') || '').trim();
    if (!name || !reach) { $('formNote').textContent = 'Add your name and a way to reach you.'; return; }
    if (f.get('_honey')) return;   // bots fill the hidden field, people never see it
    const lines = ['Hi Boston,', '', 'I would like to talk about ' + f.get('piece').toLowerCase() + '.'];
    if (reserve) lines.push('I would like to reserve: ' + reserve + '.');
    else if (from && about) lines.push('I was looking at "' + about + '" on the ' + from.name.toLowerCase() + ' page.');
    if ((f.get('by') || '').trim()) lines.push('Needed by: ' + f.get('by').trim());
    if ((f.get('idea') || '').trim()) lines.push('', f.get('idea').trim());
    lines.push('', name, reach);
    const text = lines.join('\n');
    if (!BAKR.email) { fallback(text, name, ''); return; }

    sendBtn.disabled = true; sendBtn.textContent = 'Sending…'; $('formNote').textContent = '';
    const body = {
      _subject: 'New piece: ' + f.get('piece') + ' for ' + name,
      _template: 'box',
      Name: name,
      'How to reach them': reach,
      Piece: f.get('piece'),
      'Needed by': (f.get('by') || '').trim() || 'No date given',
      'Looking at': reserve || (from && about ? about + ' (' + from.name + ')' : 'Nothing picked'),
      Idea: (f.get('idea') || '').trim() || 'Left blank',
    };
    if (/^\S+@\S+\.\S+$/.test(reach)) body._replyto = reach;   // Boston can just hit reply
    try {
      const r = await fetch('https://formsubmit.co/ajax/' + BAKR.email, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'send failed');
      form.reset();
      $('message').hidden = true;
      $('formNote').textContent = 'Sent. Boston has your idea and will get back to you.';
    } catch (err) {
      fallback(text, name, 'That did not send. Your message is below, email it or copy it.');
    }
    sendBtn.disabled = false; sendBtn.textContent = 'Send to Boston';
  });
  $('copy').addEventListener('click', async () => {
    const text = $('messageText').textContent;
    try { await navigator.clipboard.writeText(text); }
    catch (err) { const r = document.createRange(); r.selectNodeContents($('messageText')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); }
    $('copy').textContent = 'Copied';
    setTimeout(() => { $('copy').textContent = 'Copy message'; }, 1800);
  });
})();
