const canvasHostSelector = '.scene-canvas';
const palettes = {
  gamerhub: 0xa4de85,
  helpdesk: 0x62e8af,
  passforge: 0xbda2ff,
  taskapi: 0x74c7ff,
};

export async function mountScene(stage, canRun) {
  const THREE = await import('three');
  if (!canRun()) return;

  const host = stage.querySelector(canvasHostSelector);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', { alpha: true, antialias: true });
  if (!context) return;
  const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.z = 10;
  const assembly = new THREE.Group();
  scene.add(assembly);
  scene.add(new THREE.AmbientLight(0xe4ecff, 2));
  const light = new THREE.DirectionalLight(0xacefff, 3);
  light.position.set(-3, 4, 6);
  scene.add(light);

  const material = new THREE.MeshStandardMaterial({
    color: palettes[stage.dataset.scene],
    metalness: 0.3,
    roughness: 0.36,
    transparent: true,
    opacity: 0.65,
  });
  const frameGeometry = new THREE.TorusGeometry(2.45, 0.018, 8, 80);
  for (let layer = 0; layer < 3; layer++) {
    const frame = new THREE.Mesh(frameGeometry, material);
    frame.scale.set(1, 0.73, 1);
    frame.position.z = -layer * 0.45;
    frame.rotation.set(0.22 * layer, -0.25 * layer, 0.26 * layer);
    assembly.add(frame);
  }
  const shardGeometry = new THREE.OctahedronGeometry(0.12);
  for (const [x, y, z] of [[-2.1,1.2,1.3],[2.2,1.4,0.5],[-2.05,-1.3,1],[1.95,-1.35,1.4],[0.9,1.6,0.8]]) {
    const shard = new THREE.Mesh(shardGeometry, material);
    shard.position.set(x, y, z);
    shard.rotation.set(x, y, z);
    assembly.add(shard);
  }
  host.append(canvas);

  const target = new THREE.Vector2();
  const targetColor = new THREE.Color(palettes[stage.dataset.scene]);
  let frameId = 0;
  let visible = true;
  let disposed = false;

  function render() {
    frameId = 0;
    if (disposed || !visible || document.hidden || !canRun()) return;
    assembly.rotation.x += (target.y - assembly.rotation.x) * .18;
    assembly.rotation.y += (target.x - assembly.rotation.y) * .18;
    material.color.lerp(targetColor, .16);
    renderer.render(scene, camera);
    if (Math.abs(target.y - assembly.rotation.x) > .001 ||
        Math.abs(target.x - assembly.rotation.y) > .001 ||
        Math.abs(material.color.r - targetColor.r) + Math.abs(material.color.g - targetColor.g) + Math.abs(material.color.b - targetColor.b) > .003) schedule();
  }

  function schedule() {
    if (!frameId && !disposed && visible && !document.hidden && canRun()) {
      frameId = requestAnimationFrame(render);
    }
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    assembly.scale.set(1.12 * camera.aspect, 1.35, 1);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(width, height, false);
    schedule();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) resetTilt();
    schedule();
  });
  intersection.observe(host);

  const events = new AbortController();
  const { signal } = events;
  stage.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !canRun()) return;
    const rect = stage.getBoundingClientRect();
    target.set((event.clientX - rect.left) / rect.width - .5, .5 - (event.clientY - rect.top) / rect.height);
    stage.style.setProperty('--pitch', target.y * 7 + 'deg');
    stage.style.setProperty('--yaw', target.x * 9 + 'deg');
    schedule();
  }, { passive: true, signal });
  stage.addEventListener('pointerleave', () => {
    target.set(0, 0);
    resetTilt();
    schedule();
  }, { signal });
  document.addEventListener('project-selected', ({ detail }) => {
    targetColor.set(palettes[detail]);
    schedule();
  }, { signal });
  document.addEventListener('visibilitychange', schedule, { signal });

  function resetTilt() {
    stage.style.removeProperty('--pitch');
    stage.style.removeProperty('--yaw');
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersection.disconnect();
    events.abort();
    resetTilt();
    frameGeometry.dispose();
    shardGeometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
  }
  canvas.addEventListener('webglcontextlost', dispose, { once: true });
  window.addEventListener('pagehide', event => {
    if (!event.persisted) dispose();
  }, { signal });
  resize();
  return { dispose };
}
