# Verification — November 1, 2026

## Observed in the browser

- Desktop, laptop, tablet and phone layouts inspected. Measured document width stays within the viewport at 375, 768, 812 landscape, 1024 and 1440 pixels.
- Actual Aura and NovaCare preview captures and supplied Lumo artwork load. Lumo presentation shows brand artwork, not a storefront screenshot.
- Mobile menu opens, closes on section navigation, and restores a clear destination focus. Native anchors retain URL hashes.
- E-commerce filter shows only Lumo with “1 project”; All work restores the three projects.
- Aura, NovaCare and Lumo details use a native modal dialog. Escape closes it and returns focus to the originating button.
- Blank contact submission focuses the first required field. A complete submission creates an encoded email draft URL with punctuation intact and moves focus to the draft link. Editing the form invalidates the old draft. No email was sent.
- Sculpture initializes successfully and Animate/Pause toggles its accessible state. Motion defaults off. Corrected a blank-canvas regression after full-page capture by preserving the drawing buffer and guarding duplicate resize calls; a synchronous draw follows a real resize. Repeated capture no longer removes the sculpture.
- No browser console warnings or errors in the final inspected HTTP preview.

## Checked from files and HTTP

- JavaScript syntax checks pass for main.js, hero-scene.js and preview-server.mjs.
- Static audit: no duplicate IDs, missing local HTML resources or broken internal anchors. External new-tab links use noopener. Image dimensions and alt attributes are present.
- Local font and Three.js assets included with their licenses; no third-party runtime scripts or font network requests are required.
- Measured token contrast: primary on ink 16.10:1; muted on ink 8.27:1; muted on contact 7.46:1; lavender on ink 9.92:1. This is a token check, not a claim of complete WCAG conformance.
- Included Node preview server tested on localhost: HTML, CSS/JS, font, image and PDF resources return HTTP 200 with appropriate content types.
- Original CV unchanged: SHA-256 8942c31383cb44328c816bb1411b24fd53e2e1217eb7e08c071198ee874b3ee1.
- Final independent code review reported no remaining material findings.

## Limits

- Reduced-motion and WebGL-failure fallbacks reviewed in code; operating-system media preference and WebGL failure were not forced in the browser. The browser permits HTTP/HTTPS previews, so direct file-URL behavior was not visually tested.
- Email delivery requires the visitor's email application. No backend submission, delivery confirmation, analytics, or persistent form storage is configured.
- GitHub Pages previews do not make NovaCare's local clinic app available as a hosted service. Aura is a frontend ordering demo. No production booking, payment, or ordering was tested.
- No GitHub commit, push or site publication performed.
