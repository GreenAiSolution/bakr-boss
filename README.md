# BAKR — bakrjewelry.co

Boston's jewelry site. Plain HTML, CSS and JavaScript. No build step.

- `index.html` — home: hero, the shop carousel, the gallery, "Design with me", the form
- `rings.html` `chains.html` `pendants.html` `earrings.html` `bracelets.html` — gallery pages
- `piece.html` — the purchase page behind every carousel piece (`piece.html?id=signet`)
- **`bakr.js` — the one file to edit**: Boston's contact details, the gallery pieces, the shop pieces, prices, photos and payment links
- `old-godaddy-site/` — a copy of the GoDaddy page that was on the domain before this site

Preview on your own computer: `python3 -m http.server 8241`, then open http://localhost:8241

Hosted on GitHub Pages from the `main` branch. The `CNAME` file ties it to bakrjewelry.co.
