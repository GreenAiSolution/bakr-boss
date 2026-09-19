// page.js — the small things every page shares: footer, sticky nav, reveal on scroll.
(function () {
  const $ = (id) => document.getElementById(id);
  $('year').textContent = new Date().getFullYear();
  const bits = [];
  if (BAKR.instagram) bits.push('<a href="https://instagram.com/' + BAKR.instagram + '" target="_blank" rel="noopener">@' + BAKR.instagram + '</a>');
  if (BAKR.email) bits.push('<a href="mailto:' + BAKR.email + '">' + BAKR.email + '</a>');
  if (BAKR.phone) bits.push('<a href="tel:' + BAKR.phone.replace(/[^+\d]/g, '') + '">' + BAKR.phone + '</a>');
  $('contacts').innerHTML = bits.join(' · ');

  const nav = $('nav'), sub = document.body.classList.contains('sub');
  const stick = () => nav.classList.toggle('stuck', window.scrollY > (sub ? 40 : window.innerHeight * 0.5));
  window.addEventListener('scroll', stick, { passive: true }); stick();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
})();
