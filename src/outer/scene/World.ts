import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { buildDesk, DESK_H, SCREEN, type Binder, type DeskScene } from './models';

export type Mode = 'intro' | 'desk' | 'monitor';

type Opts = {
  container: HTMLElement;
  osUrl: string;
  brand: { mono: string; name: string };
  onIframeLoad: (iframe: HTMLIFrameElement) => void;
  onMode: (m: Mode) => void;
};

const SCREEN_PX = { w: 1280, h: 960 };
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class World {
  private renderer: THREE.WebGLRenderer;
  private css: CSS3DRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private desk: DeskScene;
  private screenEl: HTMLDivElement;
  readonly iframe: HTMLIFrameElement;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(0, 0);
  private smoothPointer = new THREE.Vector2(0, 0);
  private mode: Mode = 'intro';
  private tween: { from: THREE.Vector3; fromT: THREE.Vector3; start: number; dur: number } | null = null;
  private camTarget = new THREE.Vector3();
  private clock = new THREE.Clock();
  private raf = 0;
  private reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private disposed = false;
  private ro: ResizeObserver;
  /** After a binder click the monitor view holds until the pointer reaches the screen (or the user clicks away). */
  private sticky = false;
  private hovered: Binder | null = null;
  private pressed: Binder | null = null;

  constructor(private opts: Opts) {
    const { container } = opts;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'webgl';
    container.appendChild(this.renderer.domElement);

    this.css = new CSS3DRenderer();
    this.css.domElement.className = 'css3d';
    container.appendChild(this.css.domElement);

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.05, 50);

    // Lights: soft sky fill plus one key light for crisp contact shadows.
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#b7aea2', 1.6));
    const key = new THREE.DirectionalLight('#fff6ea', 2.4);
    key.position.set(-1.6, 4.2, 2.4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -2;
    key.shadow.camera.right = 2;
    key.shadow.camera.top = 2;
    key.shadow.camera.bottom = -2;
    key.shadow.radius = 6;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.01;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight('#dfe9ff', 0.6);
    rim.position.set(2.5, 2, -2);
    this.scene.add(rim);

    this.desk = buildDesk(opts.brand);
    this.scene.add(this.desk.root);

    // The monitor screen: a live iframe of the OS site, positioned in 3D.
    this.screenEl = document.createElement('div');
    this.screenEl.className = 'screen';
    this.screenEl.style.width = `${SCREEN_PX.w}px`;
    this.screenEl.style.height = `${SCREEN_PX.h}px`;
    this.iframe = document.createElement('iframe');
    this.iframe.src = opts.osUrl;
    this.iframe.title = `${opts.brand.name} OS`;
    this.iframe.addEventListener('load', () => opts.onIframeLoad(this.iframe));
    const glare = document.createElement('div');
    glare.className = 'screen-glare';
    this.screenEl.append(this.iframe, glare);
    const obj = new CSS3DObject(this.screenEl);
    obj.scale.setScalar(SCREEN.w / SCREEN_PX.w);
    this.desk.screenAnchor.add(obj);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();

    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);

    this.camera.position.copy(this.introPose(0).pos);
    this.camTarget.copy(this.introPose(0).target);
    this.loop();
  }

  /** Renders one frame so shaders compile before the reveal. */
  warmup() {
    this.renderer.compile(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  /** Routes the OS on the monitor (e.g. 'software') and zooms in to it. Used by the binders and the keyboard shortcuts. */
  openRoute(route: string) {
    this.iframe.contentWindow?.postMessage({ type: 'krish:navigate', route }, window.location.origin);
    this.setHovered(null);
    this.setMode('monitor');
    this.sticky = true;
  }

  setMode(m: Mode) {
    if (m === this.mode) return;
    if (m !== 'monitor') this.sticky = false;
    this.mode = m;
    this.tween = {
      from: this.camera.position.clone(),
      fromT: this.camTarget.clone(),
      start: this.clock.getElapsedTime(),
      dur: this.reduceMotion ? 0.01 : m === 'monitor' ? 1.0 : m === 'desk' ? 1.6 : 1.2,
    };
    this.screenEl.classList.toggle('interactive', m === 'monitor');
    this.opts.onMode(m);
  }

  getMode() {
    return this.mode;
  }

  // ---------- Camera poses ----------
  private aspect() {
    return this.camera.aspect || 1;
  }

  private introPose(t: number) {
    const az = this.reduceMotion ? -0.5 : -0.5 + Math.sin(t * 0.1) * 0.28;
    const narrow = Math.max(1, 1.5 / this.aspect());
    const radius = 6.2 * Math.pow(narrow, 0.55);
    const el = 0.6;
    const target = new THREE.Vector3(0.05, 0.4, 0.3);
    const pos = new THREE.Vector3(Math.sin(az) * Math.cos(el) * radius, Math.sin(el) * radius, Math.cos(az) * Math.cos(el) * radius).add(target);
    return { pos, target };
  }

  private deskPose() {
    const narrow = Math.max(1, 1.5 / this.aspect());
    const p = this.reduceMotion ? new THREE.Vector2() : this.smoothPointer;
    const pos = new THREE.Vector3(p.x * 0.14, DESK_H + 0.46 + p.y * 0.06, 1.5 * Math.pow(narrow, 0.7));
    const target = new THREE.Vector3(p.x * 0.03, DESK_H + 0.2, -0.15);
    return { pos, target };
  }

  private monitorPose() {
    const anchor = this.desk.screenAnchor;
    const center = new THREE.Vector3();
    anchor.getWorldPosition(center);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(anchor.getWorldQuaternion(new THREE.Quaternion()));
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const fill = 0.94;
    const distH = SCREEN.h / fill / 2 / Math.tan(vFov / 2);
    const distW = SCREEN.w / fill / 2 / Math.tan(vFov / 2) / this.aspect();
    const dist = Math.max(distH, distW);
    return { pos: center.clone().addScaledVector(normal, dist), target: center };
  }

  private pose(t: number) {
    if (this.mode === 'intro') return this.introPose(t);
    if (this.mode === 'desk') return this.deskPose();
    return this.monitorPose();
  }

  // ---------- Input ----------
  private toNdc(e: PointerEvent) {
    const r = this.renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  private hitsScreen(ndc: THREE.Vector2) {
    this.raycaster.setFromCamera(ndc, this.camera);
    return this.raycaster.intersectObject(this.desk.screenHit, false).length > 0;
  }

  /** Ray-picks the visible binder meshes (body + spine label). */
  private pickBinder(ndc: THREE.Vector2): Binder | null {
    if (this.mode === 'monitor') return null;
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = this.raycaster.intersectObjects(
      this.desk.binders.map((b) => b.mesh),
      true,
    )[0];
    if (!hit) return null;
    return this.desk.binders.find((b) => b.mesh === hit.object || b.mesh === hit.object.parent) ?? null;
  }

  private setHovered(b: Binder | null) {
    if (this.hovered === b) return;
    if (this.hovered) this.hovered.target = 0;
    this.hovered = b;
    if (b) b.target = 1;
    this.opts.container.style.cursor = b ? 'pointer' : '';
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const ndc = this.toNdc(e);
    this.pointer.copy(ndc);
    this.setHovered(this.tween ? null : this.pickBinder(ndc));
    if (this.tween || this.mode === 'intro') return;
    const onScreen = this.hitsScreen(ndc);
    if (this.mode === 'monitor' && this.sticky) {
      if (onScreen) this.sticky = false;
      return;
    }
    if (this.mode === 'desk' && onScreen) this.setMode('monitor');
    else if (this.mode === 'monitor' && !onScreen) this.setMode('desk');
  };

  private onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const ndc = this.toNdc(e);
    this.pressed = this.pickBinder(ndc);
    if (this.pressed) {
      // Instant feedback on touch, where there is no hover.
      if (e.pointerType !== 'mouse') this.pressed.target = 1;
      return;
    }
    if (this.mode === 'intro') return;
    const onScreen = this.hitsScreen(ndc);
    if (e.pointerType === 'mouse') {
      // Holding after a binder click: clicking outside the screen zooms back out.
      if (this.mode === 'monitor' && this.sticky && !onScreen) this.setMode('desk');
      return;
    }
    // Touch: tap the screen to zoom in, tap elsewhere to zoom out.
    if (this.mode === 'desk' && onScreen) this.setMode('monitor');
    else if (this.mode === 'monitor' && !onScreen) this.setMode('desk');
  };

  private onPointerUp = (e: PointerEvent) => {
    const pressed = this.pressed;
    this.pressed = null;
    if (!pressed) return;
    if (e.pointerType !== 'mouse') pressed.target = 0;
    // Activate only if released over the same binder (a normal click/tap).
    if (this.pickBinder(this.toNdc(e)) === pressed) this.openRoute(pressed.route);
  };

  /** True while a binder is being pressed: lets the page ignore that click. */
  isPressingBinder() {
    return this.pressed !== null;
  }

  // ---------- Loop ----------
  private resize() {
    const { clientWidth: w, clientHeight: h } = this.opts.container;
    this.camera.aspect = w / h;
    this.camera.fov = w / h < 0.8 ? 42 : 34;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.css.setSize(w, h);
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const t = this.clock.getElapsedTime();
    this.smoothPointer.lerp(this.pointer, 0.05);

    const goal = this.pose(t);
    if (this.tween) {
      const k = Math.min(1, (t - this.tween.start) / this.tween.dur);
      const e = ease(k);
      this.camera.position.lerpVectors(this.tween.from, goal.pos, e);
      this.camTarget.lerpVectors(this.tween.fromT, goal.target, e);
      if (k >= 1) this.tween = null;
    } else {
      this.camera.position.lerp(goal.pos, this.mode === 'monitor' ? 0.2 : 0.08);
      this.camTarget.lerp(goal.target, 0.08);
    }
    this.camera.lookAt(this.camTarget);

    // Binder hover: slide out towards the viewer, tilt and glow slightly.
    for (const b of this.desk.binders) {
      b.hover += (b.target - b.hover) * (this.reduceMotion ? 1 : 0.18);
      const h = b.hover;
      b.mesh.position.set(b.base.pos.x, b.base.pos.y + 0.012 * h, b.base.pos.z + 0.04 * h);
      b.mesh.rotation.x = b.base.rotX + 0.07 * h;
      b.mesh.rotation.z = b.base.rotZ * (1 - h);
      b.materials[0].emissive.copy(b.materials[0].color).multiplyScalar(0.45 * h);
      b.materials[1].emissive.setScalar(0.1 * h);
    }

    // Rising steam from the mug.
    for (const s of this.desk.steam) {
      const p = (t * 0.18 + s.userData.phase) % 1;
      const m = s.material as THREE.SpriteMaterial;
      s.position.y = DESK_H + 0.11 + p * 0.22;
      s.position.x = 0.66 + Math.sin(t * 1.3 + s.userData.phase * 9) * 0.012 * p;
      s.scale.set(0.04 + p * 0.06, 0.08 + p * 0.08, 1);
      m.opacity = this.reduceMotion ? 0 : Math.sin(p * Math.PI) * 0.45;
    }

    this.renderer.render(this.scene, this.camera);
    this.css.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.renderer.dispose();
    this.opts.container.innerHTML = '';
  }
}
