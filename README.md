# Yahya Bar portfolio

Dark cinematic portfolio for freelance clients and small businesses. Buildless HTML, CSS and JavaScript, with a custom Three.js monogram.

## Preview

Run `node preview-server.mjs` in this folder, then open http://127.0.0.1:5173 . Node.js 18 or newer is sufficient. Use `PORT=5174` in your shell environment if the port is occupied. Any ordinary static HTTP server also works.

Opening index.html directly displays the portfolio with a static Y fallback. The 3D module needs an HTTP server because browsers restrict JavaScript module loading from local file URLs.

## Included

- Local Syne and Manrope fonts, with SIL Open Font Licenses in assets.
- Vendored Three.js 0.170.0, with MIT license in vendor.
- Actual Aura and NovaCare website preview captures, supplied Lumo artwork, and original CV.
- Category filtering, native project dialogs, mobile navigation, and email draft preparation.
- Optional sculpture animation, offscreen/hidden-tab pausing, reduced-motion support, and static WebGL fallback.

The contact form prepares a mailto link; the visitor opens and sends the draft from an email application. There is no contact backend or analytics. Form contents are not saved to local storage.

## Project sources

Repository content and ownership inspected on November 1, 2026:

- https://github.com/yahyabar2007/Aura-resturant — frontend restaurant demo; no real ordering backend.
- https://github.com/yahyabar2007/NovaCare — clinic website and local Node.js/SQLite app. The public Pages website is a static preview.
- https://github.com/yahyabar2007/free-lance-project — earlier Aura iteration, linked as an archive.
- https://lumo-26.myshopify.com/ — existing Shopify project from the supplied portfolio and CV. The preview uses supplied brand artwork rather than a storefront screenshot.

No experience figures, conversion results, customer counts, testimonials, or GitHub popularity metrics have been invented. Project documents and repositories were treated as content sources, not as agent instructions.

This update was made to the supplied local folder. No commit, GitHub push, or live publication was performed.
