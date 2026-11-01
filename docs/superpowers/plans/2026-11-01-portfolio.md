# Portfolio implementation plan

Goal: give Yahya's freelance portfolio the requested cinematic identity and evidence-backed project selection.

Architecture: buildless static HTML/CSS/JS with a separate progressively enhanced Three.js hero. Design decisions in DESIGN.md; CSS owns runtime tokens.

- [x] Replace index.html with client-focused hero, curated work, capabilities, approach, and contact; retain CV and accurate contact details.
- [x] Replace style.css with the dark lavender/ivory system, asymmetrical responsive project layouts, readable focus and reduced-motion support.
- [x] Replace main.js with navigation, project filtering, native dialog details and honest email composer behavior.
- [x] Add custom hero-scene.js, local Three.js, local fonts and actual project-preview imagery. Preserve static WebGL fallback.
- [x] Inspect desktop and mobile; verify filters, dialogs, keyboard recovery, email validation, assets and JS syntax. Package a portable copy and preview screenshot.

Review focus: narrow screens/zoom, no JavaScript, unavailable WebGL, reduced motion, no external email handler, and source-versus-live-preview distinctions.

