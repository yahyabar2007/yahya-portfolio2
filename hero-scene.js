import * as THREE from "./vendor/three.module.min.js";

// A single, authored, bevelled Y. The silhouette and its reflections carry the
// scene; no model downloads, stock geometry, particle field, or animation loop
// are needed for the resting composition.
const host = document.querySelector("[data-hero-scene]");
const fallback = document.querySelector("[data-scene-fallback]");
const motionButton = document.querySelector("[data-motion-toggle]");

if (host) initialiseSculpture();

function initialiseSculpture() {
  let renderer;
  const resources = [];
  let frame = 0;
  let active = false;
  let inView = true;
  let disposed = false;
  let phase = 0;
  let previousTime = 0;
  let pointerX = 0;
  let pointerY = 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  try {
    // Keep the final frame available while this on-demand scene is parked.
    // Otherwise capture/compositor cycles can discard an idle drawing buffer.
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    host.append(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 30);
    camera.position.set(0, 0.05, 7.8);
    camera.lookAt(0, 0, 0);

    // A self-contained studio reflection map. Broad softboxes give the metal
    // long, legible highlights instead of a flat, uniformly shiny surface.
    const studio = document.createElement("canvas");
    studio.width = 1024;
    studio.height = 512;
    const ctx = studio.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.fillStyle = "#15111e";
    ctx.fillRect(0, 0, 1024, 512);
    const fill = ctx.createLinearGradient(0, 0, 0, 512);
    fill.addColorStop(0, "#766b91");
    fill.addColorStop(0.36, "#25212e");
    fill.addColorStop(0.65, "#111017");
    fill.addColorStop(1, "#09070f");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, 1024, 512);
    ctx.filter = "blur(15px)";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(135, 44, 135, 300);
    ctx.fillStyle = "#d7c9ff";
    ctx.fillRect(635, 80, 100, 260);
    ctx.fillStyle = "#a6c9c6";
    ctx.fillRect(900, 180, 80, 180);
    ctx.fillStyle = "#d2beee";
    ctx.fillRect(310, 14, 440, 45);
    ctx.filter = "none";
    const environment = new THREE.CanvasTexture(studio);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromEquirectangular(environment);
    scene.environment = envTarget.texture;
    resources.push(envTarget);
    environment.dispose();
    pmrem.dispose();

    const sculpture = new THREE.Group();
    sculpture.rotation.set(-0.14, -0.39, -0.13);
    scene.add(sculpture);

    const yShape = new THREE.Shape();
    const outline = [
      [-1.58, 1.72],
      [-0.72, 1.72],
      [0, 0.46],
      [0.72, 1.72],
      [1.58, 1.72],
      [0.43, -0.24],
      [0.43, -1.7],
      [-0.43, -1.7],
      [-0.43, -0.24],
    ];
    outline.forEach(([x, y], index) =>
      index ? yShape.lineTo(x, y) : yShape.moveTo(x, y),
    );
    yShape.closePath();
    const geometry = new THREE.ExtrudeGeometry(yShape, {
      depth: 0.54,
      bevelEnabled: true,
      bevelThickness: 0.13,
      bevelSize: 0.12,
      bevelSegments: 8,
      steps: 1,
      curveSegments: 16,
    });
    geometry.translate(0, 0, -0.27);
    resources.push(geometry);

    const front = new THREE.MeshPhysicalMaterial({
      color: 0xd4c8e7,
      metalness: 0.93,
      roughness: 0.22,
      clearcoat: 0.35,
      clearcoatRoughness: 0.22,
      envMapIntensity: 1.65,
    });
    const bevel = new THREE.MeshPhysicalMaterial({
      color: 0xaaa0ca,
      metalness: 0.96,
      roughness: 0.19,
      envMapIntensity: 1.85,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
    });
    resources.push(front, bevel);
    const letter = new THREE.Mesh(geometry, [front, bevel]);
    sculpture.add(letter);

    // A continuous violet backplate seats directly against the metal body.
    // It only peeks out along the lower-right edge, making the depth readable.
    const backMaterial = new THREE.MeshStandardMaterial({
      color: 0x584276,
      metalness: 0.68,
      roughness: 0.33,
      envMapIntensity: 1.1,
    });
    resources.push(backMaterial);
    const backplate = new THREE.Mesh(geometry, backMaterial);
    backplate.position.set(0.035, -0.035, -0.34);
    backplate.scale.set(1.018, 1.018, 0.48);
    sculpture.add(backplate);

    // Light ownership is entirely in this scene: the broad key shapes the
    // upper faces; violet and cool rim sources separate the silhouette.
    scene.add(new THREE.HemisphereLight(0xece3ff, 0x18111c, 1.7));
    const key = new THREE.DirectionalLight(0xfff6ed, 3.8);
    key.position.set(-3, 5, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb29aef, 4);
    rim.position.set(4, 1.8, -1);
    scene.add(rim);
    const cool = new THREE.DirectionalLight(0xb9e4df, 2.2);
    cool.position.set(-4, -1.5, 2);
    scene.add(cool);

    function render(time = 0) {
      frame = 0;
      if (disposed || document.hidden || !inView) return;
      const running = active && !reduceMotion.matches;
      if (running) {
        const delta = previousTime
          ? Math.min((time - previousTime) / 1000, 0.05)
          : 0;
        phase += delta * 0.32;
      }
      previousTime = time;
      const targetX =
        -0.14 + pointerY + (running ? Math.sin(phase * 0.7) * 0.05 : 0);
      const targetY = -0.39 + pointerX + (running ? Math.sin(phase) * 0.17 : 0);
      sculpture.rotation.x += (targetX - sculpture.rotation.x) * 0.12;
      sculpture.rotation.y += (targetY - sculpture.rotation.y) * 0.12;
      sculpture.position.y = running ? Math.sin(phase) * 0.045 : 0;
      renderer.render(scene, camera);
      const settling =
        Math.abs(targetX - sculpture.rotation.x) > 0.0003 ||
        Math.abs(targetY - sculpture.rotation.y) > 0.0003;
      if (running || settling) requestRender();
    }

    function requestRender() {
      if (!frame && !disposed && inView && !document.hidden)
        frame = requestAnimationFrame(render);
    }

    let renderedWidth = 0;
    let renderedHeight = 0;
    function resize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (disposed || !width || !height) return;
      // setSize assigns the canvas dimensions even when unchanged, which
      // clears its buffer. A parked scene must not lose its last frame on a
      // redundant observer notification or a capture's viewport restoration.
      if (width === renderedWidth && height === renderedHeight) return;
      renderedWidth = width;
      renderedHeight = height;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Preserve the full fork and lower stem in narrow containers.
      camera.position.z = camera.aspect < 0.9 ? 8.5 : 7.8;
      camera.updateProjectionMatrix();
      // Refill the resized buffer synchronously. IntersectionObserver can
      // still report the previous viewport here, so an on-demand RAF alone
      // can be suppressed until a later scroll or interaction.
      renderer.render(scene, camera);
      requestRender();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        previousTime = 0;
        if (!inView && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        } else requestRender();
      },
      { rootMargin: "80px" },
    );
    visibilityObserver.observe(host);

    function syncMotionButton() {
      if (!motionButton) return;
      motionButton.disabled = reduceMotion.matches;
      motionButton.setAttribute(
        "aria-pressed",
        String(active && !reduceMotion.matches),
      );
      motionButton.textContent = reduceMotion.matches
        ? "Motion reduced"
        : active
          ? "Pause sculpture"
          : "Animate sculpture";
    }

    motionButton?.addEventListener("click", () => {
      active = !active;
      previousTime = 0;
      syncMotionButton();
      requestRender();
    });

    host.addEventListener("pointermove", (event) => {
      if (reduceMotion.matches || event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.22;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.14;
      requestRender();
    });
    host.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      requestRender();
    });

    document.addEventListener("visibilitychange", () => {
      previousTime = 0;
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestRender();
    });

    reduceMotion.addEventListener("change", () => {
      pointerX = pointerY = 0;
      syncMotionButton();
      requestRender();
    });

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      disposed = true;
      cancelAnimationFrame(frame);
      canvas.style.visibility = "hidden";
      if (fallback) fallback.hidden = false;
      if (motionButton) motionButton.hidden = true;
      host.dataset.sceneReady = "false";
    });

    window.addEventListener(
      "pagehide",
      (event) => {
        if (event.persisted) return;
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        visibilityObserver.disconnect();
        resources.forEach((resource) => resource.dispose());
        renderer.dispose();
      },
      { once: true },
    );

    resize();
    // Confirm a first successful draw before hiding the immediate fallback.
    renderer.render(scene, camera);
    if (fallback) fallback.hidden = true;
    host.dataset.sceneReady = "true";
    if (motionButton) motionButton.hidden = false;
    syncMotionButton();
  } catch {
    if (frame) cancelAnimationFrame(frame);
    renderer?.domElement.remove();
    renderer?.dispose();
    resources.forEach((resource) => resource.dispose());
    if (fallback) fallback.hidden = false;
    if (motionButton) motionButton.hidden = true;
    host.dataset.sceneReady = "false";
  }
}
