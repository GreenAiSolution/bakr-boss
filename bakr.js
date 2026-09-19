// bakr.js — everything Boston fills in lives in this one file.

// ---- Boston's contact details. Fill these in and the form starts sending to him. ----
const BAKR = {
  email: 'bakr.jewelry@gmail.com', // the "Start a piece" form sends here (through formsubmit.co), and it shows in the footer
  instagram: '',   // e.g. 'bakr.jewelry'        -> "Open Instagram" appears, and the handle shows in the footer
  phone: '',       // e.g. '+1 555 010 0000'     -> shows in the footer
  samplePrices: true, // the shop pieces and prices below are SAMPLES. Once they are Boston's real ones, set this to false and the "sample" line disappears.
};

// ---- The gallery. One block per page, one line per piece. ----
// To show a real photo instead of the line drawing, drop the file in assets/ and add
//   photo: 'assets/signet-01.jpg'
// to that piece. To add a piece, copy a line. To remove one, delete the line.
(function () {
  // n small circles set around an oval, from angle a0 to a1 (degrees)
  function along(n, cx, cy, rx, ry, r, a0, a1) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / (a1 - a0 >= 360 ? n : n - 1)) * Math.PI) / 180;
      s += '<circle cx="' + (cx + rx * Math.cos(a)).toFixed(1) + '" cy="' + (cy + ry * Math.sin(a)).toFixed(1) + '" r="' + r + '"/>';
    }
    return s;
  }
  const band = '<ellipse cx="60" cy="74" rx="34" ry="30"/><ellipse cx="60" cy="74" rx="27" ry="23"/>';
  const chain = '<path d="M14 14c14 30 30 46 46 52 16-6 32-22 46-52"/><circle cx="60" cy="70" r="4"/>';
  const drop = (x) => '<path d="M' + x + ' 22v26"/><path d="M' + x + ' 48c-10 14-14 23-14 30a14 14 0 0 0 28 0c0-7-4-16-14-30z"/>';
  const stud = (x, dash) => '<g' + (dash ? ' stroke-dasharray="3 5"' : '') + '><circle cx="' + x + '" cy="60" r="15"/><path d="M' + x + ' 50l9 6v9l-9 6-9-6v-9z"/></g>';

  window.BAKR_GALLERY = [
    {
      key: 'rings', file: 'rings.html', name: 'Rings', one: 'a ring', option: 'A ring', code: 'R',
      pieces: [
        { name: 'Engagement', note: 'One stone, set for one person. The cut, the metal and the setting are chosen with you.', art: band + '<path d="M46 38h28l8 9-22 16-22-16z"/><path d="M38 47h44M52 38l-4 9 12 16 12-16-4-9"/>' },
        { name: 'Wedding bands', note: 'Made as a pair or on their own, to sit right against the ring you already wear.', art: '<ellipse cx="46" cy="62" rx="30" ry="34"/><ellipse cx="46" cy="62" rx="23" ry="27"/><ellipse cx="76" cy="62" rx="30" ry="34"/><ellipse cx="76" cy="62" rx="23" ry="27"/>' },
        { name: 'Signet', note: 'A flat face for an initial, a crest, or nothing at all.', art: band + '<rect x="38" y="30" width="44" height="26" rx="13"/><rect x="44" y="35" width="32" height="16" rx="8"/>' },
        { name: 'Eternity', note: 'Stones all the way round, or halfway, matched one by one.', art: '<ellipse cx="60" cy="62" rx="40" ry="36"/><ellipse cx="60" cy="62" rx="28" ry="24"/>' + along(9, 60, 62, 34, 30, 4.2, 190, 350) },
        { name: 'Stacking', note: 'Thin bands made to be worn together, and added to over the years.', art: '<ellipse cx="60" cy="42" rx="38" ry="13"/><ellipse cx="60" cy="60" rx="38" ry="13"/><ellipse cx="60" cy="78" rx="38" ry="13"/><path d="M60 22l7 7-7 7-7-7z"/>' },
        { name: 'The one in your head', note: 'Not on this page? Good. Describe it, and Boston will draw it with you.', art: '<g stroke-dasharray="3 5">' + band + '</g><path d="M46 38h28l8 9-22 16-22-16z"/>', open: true },
      ],
    },
    {
      key: 'chains', file: 'chains.html', name: 'Chains', one: 'a chain', option: 'A chain', code: 'C',
      pieces: [
        { name: 'Cuban', note: 'Tight, flat links with real weight to them.', art: [16, 38, 60, 82, 104].map((x) => '<ellipse cx="' + x + '" cy="60" rx="16" ry="9" transform="rotate(-28 ' + x + ' 60)"/>').join('') },
        { name: 'Rope', note: 'Twisted strands that catch the light from every side.', art: '<rect x="8" y="49" width="104" height="22" rx="11"/><path d="M20 71l12-22M34 71l12-22M48 71l12-22M62 71l12-22M76 71l12-22M90 71l12-22"/>' },
        { name: 'Figaro', note: 'Three short links, one long. A rhythm you can see from across the room.', art: '<rect x="6" y="52" width="30" height="16" rx="8"/><circle cx="42" cy="60" r="6"/><circle cx="52" cy="60" r="6"/><circle cx="62" cy="60" r="6"/><rect x="68" y="52" width="30" height="16" rx="8"/><circle cx="104" cy="60" r="6"/><circle cx="114" cy="60" r="6"/>' },
        { name: 'Box', note: 'Square links, clean lines. The quiet one that carries a pendant well.', art: [8, 27, 46, 65, 84, 103].map((x) => '<rect x="' + x + '" y="54" width="12" height="12" rx="1.5"/>').join('') + '<path d="M20 60h7M39 60h7M58 60h7M77 60h7M96 60h7"/>' },
        { name: 'Tennis chain', note: 'A full line of stones, each one set by hand.', art: [11, 25, 39, 53, 67, 81, 95, 109].map((x) => '<circle cx="' + x + '" cy="60" r="7"/><circle cx="' + x + '" cy="60" r="2.6"/>').join('') },
        { name: 'Your length, your weight', note: 'Any link, any length, any thickness. Tell Boston how you want it to sit.', art: '<g stroke-dasharray="3 5"><rect x="12" y="48" width="36" height="22" rx="11"/><rect x="64" y="48" width="36" height="22" rx="11"/></g><rect x="38" y="52" width="36" height="14" rx="7"/>', open: true },
      ],
    },
    {
      key: 'pendants', file: 'pendants.html', name: 'Pendants', one: 'a pendant', option: 'A pendant', code: 'P',
      pieces: [
        { name: 'Single stone', note: 'One stone on a fine chain. Nothing else in the way.', art: chain + '<path d="M60 74l-14 18 14 18 14-18z"/><path d="M46 92h28"/>' },
        { name: 'Initial', note: 'A letter cut from solid metal. Yours, or someone\'s you carry.', art: chain + '<path d="M60 74l-17 40h9l8-20 8 20h9z"/>' },
        { name: 'Cross', note: 'Plain, or set with stones. Sized to be worn every day.', art: chain + '<path d="M55 74h10v12h11v9H65v21H55V95H44v-9h11z"/>' },
        { name: 'Medallion', note: 'A round face for a figure, a date, or a symbol that is only yours.', art: chain + '<circle cx="60" cy="95" r="21"/><circle cx="60" cy="95" r="15"/><path d="M60 87l6 8-6 8-6-8z"/>' },
        { name: 'Tag', note: 'A clean plate for a name, a date, or a line of words.', art: chain + '<rect x="46" y="74" width="28" height="42" rx="8"/><path d="M53 96h14M53 103h9"/>' },
        { name: 'A shape only you know', note: 'Bring the drawing, the photo or the story. Boston will turn it into metal.', art: chain + '<path d="M60 74c-16 6-20 20-14 30s22 12 28 0-2-20-14-16" stroke-dasharray="3 5"/>', open: true },
      ],
    },
    {
      key: 'earrings', file: 'earrings.html', name: 'Earrings', one: 'earrings', option: 'Earrings', code: 'E',
      pieces: [
        { name: 'Studs', note: 'A matched pair of stones, set low and close to the ear.', art: stud(36) + stud(84) },
        { name: 'Hoops', note: 'Any size, any thickness. Plain, or set with stones.', art: '<circle cx="38" cy="66" r="22"/><path d="M38 44v-14"/><circle cx="84" cy="66" r="22"/><path d="M84 44v-14"/>' },
        { name: 'Drops', note: 'A stone or a shape that moves when you do.', art: drop(38) + drop(82) },
        { name: 'Huggies', note: 'Small, thick hoops that sit tight to the lobe.', art: '<circle cx="36" cy="60" r="17"/><circle cx="36" cy="60" r="9"/><path d="M36 43v8"/><circle cx="84" cy="60" r="17"/><circle cx="84" cy="60" r="9"/><path d="M84 43v8"/>' },
        { name: 'The one you lost', note: 'Send a photo of the one you still have. Boston makes its match.', art: stud(36) + stud(84, true) },
        { name: 'Something else', note: 'Climbers, cuffs, mismatched on purpose. If you can describe it, ask.', art: '<g stroke-dasharray="3 5"><circle cx="38" cy="66" r="22"/><circle cx="84" cy="66" r="22"/></g><path d="M38 44v-14M84 44v-14"/>', open: true },
      ],
    },
    {
      key: 'bracelets', file: 'bracelets.html', name: 'Bracelets', one: 'a bracelet', option: 'A bracelet', code: 'B',
      pieces: [
        { name: 'Cuff', note: 'Open at the back, shaped to your wrist so it stays where you put it.', art: '<path d="M46 88.6A46 30 0 1 1 74 88.6"/><path d="M49 79A38 22 0 1 1 71 79"/><path d="M46 88.6l3-9.6M74 88.6l-3-9.6"/>' },
        { name: 'Bangle', note: 'A closed circle of metal. Worn alone, or three at a time.', art: '<ellipse cx="60" cy="60" rx="46" ry="30"/><ellipse cx="60" cy="56" rx="38" ry="22"/>' },
        { name: 'Chain bracelet', note: 'Any link from the chains page, cut to your wrist.', art: '<ellipse cx="60" cy="60" rx="44" ry="28" stroke-width="6" stroke-dasharray="11 5"/>' },
        { name: 'Tennis bracelet', note: 'One line of stones, all the way round.', art: along(20, 60, 60, 44, 28, 5.4, 0, 360) },
        { name: 'ID bracelet', note: 'A plate for a name or a date, on a chain that can take daily wear.', art: '<path d="M38 82.3A46 30 0 1 1 82 82.3" stroke-dasharray="9 5"/><rect x="36" y="75" width="48" height="16" rx="3"/><path d="M46 83h28"/>' },
        { name: 'Sized to you', note: 'Your wrist, measured. Not small, medium or large.', art: '<ellipse cx="60" cy="60" rx="46" ry="30" stroke-dasharray="3 5"/><ellipse cx="60" cy="56" rx="38" ry="22"/>', open: true },
      ],
    },
  ];
  // ---- The shop: the carousel on the home page, and the purchase page behind each piece. ----
  // price is in dollars. To take real payment, paste a payment link (e.g. a Stripe Payment Link) into pay:
  //   pay: 'https://buy.stripe.com/...'
  // and the button becomes "Buy now". With pay empty, the button reserves the piece through the form instead.
  // photo: 'assets/x.jpg' swaps the drawing for a real photo, same as the gallery.
  const art = (key, name) => window.BAKR_GALLERY.find((g) => g.key === key).pieces.find((p) => p.name === name).art;
  window.BAKR_SHOP = [
    { id: 'solitaire', in: 'rings', name: 'The Solitaire', metal: '14k gold · one round stone', price: 3200, note: 'One stone, four prongs, a plain band. The ring everything else gets compared to.', art: art('rings', 'Engagement'), pay: '' },
    { id: 'signet', in: 'rings', name: 'The Signet', metal: '14k gold · flat oval face', price: 1450, note: 'A solid face, left clean or cut with your initial.', art: art('rings', 'Signet'), pay: '' },
    { id: 'cuban', in: 'chains', name: 'Cuban Chain', metal: '14k gold · 5 mm · 22 in', price: 2800, note: 'Tight, flat links with real weight. Made to the length you wear.', art: art('chains', 'Cuban'), pay: '' },
    { id: 'rope', in: 'chains', name: 'Rope Chain', metal: '14k gold · 3 mm · 20 in', price: 1900, note: 'Twisted strands that catch the light from every side.', art: art('chains', 'Rope'), pay: '' },
    { id: 'initial', in: 'pendants', name: 'Initial Pendant', metal: '14k gold · on a fine chain', price: 680, note: 'One letter, cut from solid metal. Yours, or someone\'s you carry.', art: art('pendants', 'Initial'), pay: '' },
    { id: 'medallion', in: 'pendants', name: 'The Medallion', metal: '14k gold · 20 mm face', price: 940, note: 'A round face for a figure, a date, or a symbol that is only yours.', art: art('pendants', 'Medallion'), pay: '' },
    { id: 'studs', in: 'earrings', name: 'Stone Studs', metal: '14k gold · matched pair', price: 1200, note: 'Two matched stones, set low and close to the ear.', art: art('earrings', 'Studs'), pay: '' },
    { id: 'huggies', in: 'earrings', name: 'Gold Huggies', metal: '14k gold · pair', price: 540, note: 'Small, thick hoops that sit tight to the lobe.', art: art('earrings', 'Huggies'), pay: '' },
    { id: 'tennis', in: 'bracelets', name: 'Tennis Bracelet', metal: '14k gold · stones all round', price: 4600, note: 'One unbroken line of stones, sized to your wrist.', art: art('bracelets', 'Tennis bracelet'), pay: '' },
    { id: 'cuff', in: 'bracelets', name: 'The Cuff', metal: '14k gold · open back', price: 1350, note: 'Shaped to your wrist so it stays where you put it.', art: art('bracelets', 'Cuff'), pay: '' },
  ];
  window.bakrPrice = (n) => '$' + n.toLocaleString('en-US');
})();
