import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {
  bezelTexture,
  keyTexture,
  matTexture,
  mugTexture,
  rng,
  rugTexture,
  spineTexture,
  steamTexture,
  towerFrontTexture,
  woodTexture,
} from './textures';

/** Procedurally modelled office desk. Units are metres; desk top surface sits at y = DESK_H. */
export const DESK_H = 0.75;
export const SCREEN = { w: 0.42, h: 0.315 };

const std = (color: THREE.ColorRepresentation, roughness = 0.7, metalness = 0, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], pos: [number, number, number], opts: { cast?: boolean; receive?: boolean } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.castShadow = opts.cast ?? true;
  m.receiveShadow = opts.receive ?? true;
  return m;
}

const rbox = (w: number, h: number, d: number, r = 0.008) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));

export type DeskScene = {
  root: THREE.Group;
  screenAnchor: THREE.Object3D; // centre of the screen, facing +z
  screenHit: THREE.Mesh; // invisible plane for ray picking
  steam: THREE.Sprite[];
  binders: Binder[];
};

/** A clickable binder: the visible mesh itself is ray-picked (no invisible hit zones). */
export type Binder = {
  mesh: THREE.Mesh;
  label: string;
  route: string;
  base: { pos: THREE.Vector3; rotX: number; rotZ: number };
  materials: THREE.MeshStandardMaterial[];
  hover: number; // animated 0..1
  target: number; // 0 or 1
};

export function buildDesk(brand: { mono: string; name: string }): DeskScene {
  const root = new THREE.Group();
  const wood = std(0xffffff, 0.62, 0, { map: woodTexture() });
  const woodSide = std(0xffffff, 0.65, 0, { map: woodTexture('#cfa46e', '#a97f4c') });
  const black = std('#1e1f21', 0.45, 0.4);
  const darkPlastic = std('#34373b', 0.5);

  // ---------- Floor ----------
  const shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.13 }));
  shadowFloor.rotation.x = -Math.PI / 2;
  shadowFloor.receiveShadow = true;
  root.add(shadowFloor);

  const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.1), new THREE.MeshStandardMaterial({ map: rugTexture(), transparent: true, roughness: 1 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.15, 0.002, 0.55);
  rug.receiveShadow = true;
  root.add(rug);

  // ---------- Desk ----------
  const deskW = 1.6;
  const deskD = 0.75;
  const top = mesh(rbox(deskW, 0.04, deskD, 0.006), [woodSide, woodSide, wood, wood, woodSide, woodSide], [0, DESK_H - 0.02, 0]);
  root.add(top);

  // Left pedestal with two drawers
  const pedW = 0.44;
  const pedH = DESK_H - 0.04;
  const ped = mesh(rbox(pedW, pedH, deskD - 0.04, 0.004), woodSide, [-deskW / 2 + pedW / 2 + 0.02, pedH / 2, 0]);
  root.add(ped);
  const drawerMat = std(0xffffff, 0.6, 0, { map: woodTexture('#d4aa74', '#ad8352') });
  [0.52, 0.2].forEach((y, i) => {
    const h = i === 0 ? 0.2 : 0.38;
    const front = mesh(rbox(pedW - 0.03, h, 0.02, 0.004), drawerMat, [ped.position.x, y + (i === 0 ? 0.06 : -0.02), deskD / 2 - 0.01]);
    root.add(front);
    const handle = mesh(new THREE.BoxGeometry(0.18, 0.014, 0.012), black, [ped.position.x, front.position.y + h / 2 - 0.04, deskD / 2 + 0.006]);
    root.add(handle);
  });

  // Right metal T-legs and apron
  const legX = deskW / 2 - 0.08;
  for (const z of [-deskD / 2 + 0.06, deskD / 2 - 0.06]) {
    root.add(mesh(new THREE.BoxGeometry(0.05, DESK_H - 0.04, 0.05), black, [legX, (DESK_H - 0.04) / 2, z]));
  }
  root.add(mesh(new THREE.BoxGeometry(0.05, 0.05, deskD - 0.1), black, [legX, DESK_H - 0.065, 0]));
  root.add(mesh(new THREE.BoxGeometry(0.08, 0.02, deskD - 0.06), black, [legX, 0.01, 0]));
  root.add(mesh(new THREE.BoxGeometry(deskW - pedW - 0.12, 0.05, 0.03), black, [0.18, DESK_H - 0.065, deskD / 2 - 0.12]));

  // ---------- Monitor ----------
  const mon = new THREE.Group();
  mon.position.set(0, DESK_H, -0.16);
  root.add(mon);
  mon.add(mesh(rbox(0.26, 0.016, 0.2, 0.006), darkPlastic, [0, 0.008, 0]));
  mon.add(mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.012, 40), std('#c9cdd1', 0.4, 0.3), [0, 0.012, 0.02]));
  mon.add(mesh(rbox(0.06, 0.16, 0.035, 0.008), std('#c9cdd1', 0.4, 0.3), [0, 0.09, -0.02]));
  const head = new THREE.Group();
  head.position.set(0, 0.34, 0);
  head.rotation.x = -0.05;
  mon.add(head);
  const bezelW = SCREEN.w + 0.05;
  const bezelH = SCREEN.h + 0.075;
  const bezelFront = std(0xffffff, 0.5, 0, { map: bezelTexture(brand.mono, brand.name) });
  head.add(mesh(rbox(bezelW, bezelH, 0.045, 0.012), darkPlastic, [0, -0.015, -0.005]));
  const chin = mesh(new THREE.PlaneGeometry(bezelW - 0.02, 0.036), bezelFront, [0, -SCREEN.h / 2 - 0.028, 0.0181], { cast: false });
  head.add(chin);
  head.add(mesh(rbox(0.3, 0.24, 0.08, 0.02), darkPlastic, [0, 0, -0.06]));
  // Screen: black glass + inner anchor for the CSS3D iframe.
  const glass = mesh(new THREE.PlaneGeometry(SCREEN.w + 0.006, SCREEN.h + 0.006), std('#0b0c0d', 0.2, 0.1), [0, 0, 0.0179], { cast: false });
  head.add(glass);
  const screenAnchor = new THREE.Object3D();
  screenAnchor.position.set(0, 0, 0.0182);
  head.add(screenAnchor);
  const screenHit = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), new THREE.MeshBasicMaterial({ visible: false }));
  screenHit.position.copy(screenAnchor.position);
  head.add(screenHit);

  // ---------- PC tower ----------
  const tower = new THREE.Group();
  tower.position.set(0.58, DESK_H, -0.14);
  tower.rotation.y = -0.08;
  root.add(tower);
  const twW = 0.19;
  const twH = 0.44;
  const twD = 0.44;
  tower.add(mesh(rbox(twW, twH, twD, 0.008), std('#d3d6d9', 0.45, 0.15), [0, twH / 2 + 0.012, 0]));
  tower.add(mesh(new THREE.PlaneGeometry(twW - 0.02, twH - 0.02), std(0xffffff, 0.5, 0, { map: towerFrontTexture() }), [0, twH / 2 + 0.012, twD / 2 + 0.0015], { cast: false }));
  for (const x of [-0.07, 0.07]) for (const z of [-0.17, 0.17]) tower.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.012, 12), black, [x, 0.006, z]));
  // Side vent strip
  const vent = mesh(new THREE.PlaneGeometry(0.2, 0.22), std('#b9bdc1', 0.6), [-twW / 2 - 0.0015, 0.26, 0.05], { cast: false });
  vent.rotation.y = -Math.PI / 2;
  tower.add(vent);

  // Cable from monitor to tower
  const cable = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.05, DESK_H + 0.25, -0.26),
    new THREE.Vector3(0.18, DESK_H + 0.05, -0.32),
    new THREE.Vector3(0.36, DESK_H + 0.01, -0.3),
    new THREE.Vector3(0.48, DESK_H + 0.22, -0.3),
  ]);
  root.add(mesh(new THREE.TubeGeometry(cable, 40, 0.006, 8), black, [0, 0, 0]));

  // ---------- Desk mat, keyboard, mouse ----------
  root.add(mesh(rbox(0.86, 0.004, 0.3, 0.002), [std('#35575b', 0.9), std('#35575b', 0.9), std(0xffffff, 0.9, 0, { map: matTexture(brand.name) }), std('#35575b'), std('#35575b'), std('#35575b')], [0.02, DESK_H + 0.002, 0.16]));
  const kb = new THREE.Group();
  kb.position.set(-0.05, DESK_H + 0.004, 0.15);
  kb.rotation.x = 0.04;
  root.add(kb);
  kb.add(mesh(rbox(0.44, 0.022, 0.135, 0.006), std('#5c6266', 0.5), [0, 0.011, 0]));
  const keyGeo = rbox(0.0165, 0.01, 0.0165, 0.003);
  const keyMat = std(0xffffff, 0.55, 0, { map: keyTexture() });
  const accentMat = std('#3d8f8c', 0.55);
  const greyMat = std('#9aa2a6', 0.55);
  const r = rng(3);
  const rows = 6;
  const cols = 22;
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, rows * cols);
  const accents = new THREE.InstancedMesh(keyGeo, accentMat, 24);
  const greys = new THREE.InstancedMesh(keyGeo, greyMat, 40);
  let k = 0;
  let a = 0;
  let gI = 0;
  const m4 = new THREE.Matrix4();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Leave gaps between the main block, the nav cluster and the numpad.
      if (col === 15 || col === 18) continue;
      if (row === 0 && (col === 1 || col === 6 || col === 11)) continue;
      const x = -0.2 + col * 0.0186;
      const z = -0.05 + row * 0.019;
      m4.makeTranslation(x, 0.026, z);
      const isAccent = (row === 0 && col === 0) || (row === 3 && col === 13) || (row === 5 && col > 4 && col < 9 ? false : r() < 0.06);
      const isGrey = col > 15 && col < 18;
      if (isAccent && a < 24) accents.setMatrixAt(a++, m4);
      else if (isGrey && gI < 40) greys.setMatrixAt(gI++, m4);
      else keys.setMatrixAt(k++, m4);
    }
  }
  keys.count = k;
  accents.count = a;
  greys.count = gI;
  for (const im of [keys, accents, greys]) {
    im.castShadow = true;
    im.receiveShadow = true;
    kb.add(im);
  }
  // Space bar
  kb.add(mesh(rbox(0.1, 0.01, 0.0165, 0.003), keyMat, [-0.06, 0.026, 0.045]));

  const mouse = mesh(new THREE.SphereGeometry(0.03, 32, 16), std('#2f3336', 0.35, 0.2), [0.31, DESK_H + 0.006, 0.17]);
  mouse.scale.set(0.95, 0.5, 1.45);
  root.add(mouse);
  root.add(mesh(new THREE.BoxGeometry(0.002, 0.004, 0.02), std('#888', 0.5), [0.31, DESK_H + 0.021, 0.145], { cast: false }));

  // ---------- Binders ----------
  const binderDefs: [string, string, string][] = [
    ['#2d4b4d', 'PROJECTS', 'software'],
    ['#222426', 'RESEARCH', 'research'],
    ['#c4672a', 'CERTIFICATES', 'certificates'],
  ];
  const binders: Binder[] = [];
  binderDefs.forEach(([color, label, route], i) => {
    const bw = 0.072;
    const bh = 0.32;
    const bd = 0.27;
    const body = std(color, 0.6);
    const spine = std(0xffffff, 0.6, 0, { map: spineTexture(label, color) });
    const b = mesh(rbox(bw, bh, bd, 0.006), body, [-0.68 + i * 0.08, DESK_H + bh / 2, -0.2]);
    b.rotation.z = i === 2 ? -0.06 : 0;
    root.add(b);
    const s = mesh(new THREE.PlaneGeometry(bw - 0.006, bh - 0.006), spine, [0, 0, bd / 2 + 0.0012], { cast: false });
    b.add(s);
    b.name = `binder:${label}`;
    binders.push({ mesh: b, label, route, base: { pos: b.position.clone(), rotX: b.rotation.x, rotZ: b.rotation.z }, materials: [body, spine], hover: 0, target: 0 });
  });

  // ---------- Notebook + pen ----------
  const nb = mesh(rbox(0.16, 0.018, 0.22, 0.004), std('#202224', 0.6), [-0.58, DESK_H + 0.009, 0.17]);
  nb.rotation.y = 0.18;
  root.add(nb);
  nb.add(mesh(new THREE.BoxGeometry(0.008, 0.02, 0.222), std('#3d8f8c', 0.5), [0.055, 0, 0]));
  const pen = mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.14, 12), std('#c9cdd1', 0.3, 0.6), [-0.58, DESK_H + 0.024, 0.16]);
  pen.rotation.set(Math.PI / 2, 0, 1.2);
  root.add(pen);

  // ---------- Rubber duck ----------
  const duck = new THREE.Group();
  duck.position.set(0.19, DESK_H, -0.03);
  duck.rotation.y = -0.5;
  root.add(duck);
  const yellow = std('#f5cf2b', 0.45);
  const bodyD = mesh(new THREE.SphereGeometry(0.032, 24, 16), yellow, [0, 0.026, 0]);
  bodyD.scale.set(1.25, 0.85, 1);
  duck.add(bodyD);
  duck.add(mesh(new THREE.SphereGeometry(0.021, 24, 16), yellow, [0.016, 0.063, 0]));
  const beak = mesh(new THREE.ConeGeometry(0.008, 0.02, 12), std('#f08a24', 0.5), [0.04, 0.06, 0]);
  beak.rotation.z = -Math.PI / 2;
  duck.add(beak);
  for (const z of [-0.012, 0.012]) duck.add(mesh(new THREE.SphereGeometry(0.0035, 8, 8), black, [0.031, 0.07, z]));

  // ---------- Mug, coaster, steam ----------
  const mug = new THREE.Group();
  mug.position.set(0.66, DESK_H, 0.2);
  mug.rotation.y = -0.9;
  root.add(mug);
  mug.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.006, 40), std('#e6c99a', 0.9), [0, 0.003, 0]));
  const mugMats = [std(0xffffff, 0.35, 0, { map: mugTexture() }), std('#f3f1ec', 0.35), std('#f3f1ec', 0.35)];
  mug.add(mesh(new THREE.CylinderGeometry(0.042, 0.038, 0.1, 40, 1, true), mugMats[0], [0, 0.056, 0]));
  const coffee = mesh(new THREE.CircleGeometry(0.04, 32), std('#4a2c1a', 0.2), [0, 0.096, 0]);
  coffee.rotation.x = -Math.PI / 2;
  mug.add(coffee);
  mug.add(mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.004, 32), mugMats[1], [0, 0.008, 0]));
  const handle = mesh(new THREE.TorusGeometry(0.024, 0.0065, 12, 24, Math.PI * 1.2), mugMats[1], [0.042, 0.058, 0]);
  handle.rotation.z = -Math.PI * 0.6;
  mug.add(handle);
  const steamTex = steamTexture();
  const steam: THREE.Sprite[] = [];
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0 }));
    s.scale.set(0.05, 0.1, 1);
    s.position.set(0.66, DESK_H + 0.12, 0.2);
    s.userData.phase = i / 6;
    steam.push(s);
    root.add(s);
  }

  // ---------- Plant ----------
  const plant = new THREE.Group();
  plant.position.set(-1.05, 0, 0.05);
  root.add(plant);
  // Open-topped pot (a closed lid sat exactly on the soil's top face and z-fought with it).
  const potMat = std('#f1efea', 0.6);
  plant.add(mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.24, 40, 1, true), potMat, [0, 0.12, 0]));
  // Inner wall: back faces of a slightly smaller shell, so the outer wall keeps clean single-sided shadows.
  plant.add(mesh(new THREE.CylinderGeometry(0.116, 0.087, 0.24, 40, 1, true), std('#e4e1da', 0.7, 0, { side: THREE.BackSide }), [0, 0.12, 0], { cast: false }));
  const potBase = mesh(new THREE.CircleGeometry(0.09, 40), potMat, [0, 0.001, 0]);
  potBase.rotation.x = -Math.PI / 2;
  plant.add(potBase);
  const rim = mesh(new THREE.TorusGeometry(0.12, 0.005, 8, 48), potMat, [0, 0.24, 0]);
  rim.rotation.x = Math.PI / 2;
  plant.add(rim);
  // Soil sits 2 cm below the rim, just inside the inner wall (r ≈ 0.1136 at that height) so it never pokes through.
  const SOIL_Y = 0.22;
  plant.add(mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.01, 40), std('#3b2a1e', 1), [0, SOIL_Y - 0.005, 0]));
  const leafMats = [std('#3f7a3a', 0.6, 0, { side: THREE.DoubleSide }), std('#5c9a45', 0.6, 0, { side: THREE.DoubleSide }), std('#2f5f30', 0.6, 0, { side: THREE.DoubleSide })];
  // The desk's drawer pedestal starts 0.27 m to the plant's +x; leaves heading that way must stop short of it.
  const MAX_REACH_TOWARDS_DESK = 0.22;
  const pr = rng(21);
  for (let i = 0; i < 30; i++) {
    // Same random sequence as before (len, lean, yaw, tilt) so every leaf keeps its look.
    const len = 0.45 + pr() * 0.45;
    let lean = 0.15 + pr() * 0.6;
    const yaw = pr() * Math.PI * 2;
    const tilt = (pr() - 0.5) * 0.15;
    const towardsDesk = Math.cos(yaw); // world +x component of the leaf's direction
    if (towardsDesk > 0 && Math.sin(lean) * len * towardsDesk > MAX_REACH_TOWARDS_DESK) {
      lean = Math.asin(MAX_REACH_TOWARDS_DESK / (len * towardsDesk));
    }
    const pts: THREE.Vector3[] = [];
    for (let s = 0; s <= 10; s++) {
      const t = s / 10;
      pts.push(new THREE.Vector3(Math.sin(lean) * len * t * t, len * t - lean * 0.25 * len * t * t, 0));
    }
    // A tapered ribbon along the curve.
    const geo = new THREE.BufferGeometry();
    const verts: number[] = [];
    const idx: number[] = [];
    pts.forEach((p, j) => {
      const w = 0.018 * (1 - j / pts.length) + 0.002;
      verts.push(p.x, p.y, -w, p.x, p.y, w);
      if (j > 0) {
        const b = (j - 1) * 2;
        idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
      }
    });
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const leaf = mesh(geo, leafMats[i % 3], [0, SOIL_Y, 0]);
    leaf.rotation.y = yaw;
    leaf.rotation.x = tilt;
    plant.add(leaf);
  }

  // ---------- Office chair ----------
  const chair = new THREE.Group();
  chair.position.set(0.92, 0, 0.98);
  chair.rotation.y = 0.55;
  root.add(chair);
  const teal = std('#1f7473', 0.65);
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    const arm = mesh(new THREE.BoxGeometry(0.3, 0.025, 0.04), black, [Math.cos(ang) * 0.15, 0.07, Math.sin(ang) * 0.15]);
    arm.rotation.y = -ang;
    chair.add(arm);
    chair.add(mesh(new THREE.SphereGeometry(0.025, 12, 8), black, [Math.cos(ang) * 0.29, 0.03, Math.sin(ang) * 0.29]));
  }
  chair.add(mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.3, 16), black, [0, 0.22, 0]));
  chair.add(mesh(rbox(0.5, 0.08, 0.48, 0.03), teal, [0, 0.43, 0]));
  const back = mesh(rbox(0.46, 0.5, 0.07, 0.03), teal, [0, 0.76, 0.24]);
  back.rotation.x = 0.12;
  chair.add(back);
  chair.add(mesh(new THREE.BoxGeometry(0.06, 0.24, 0.04), black, [0, 0.52, 0.24]));
  for (const x of [-0.27, 0.27]) {
    chair.add(mesh(new THREE.BoxGeometry(0.03, 0.18, 0.03), black, [x, 0.53, 0.02]));
    chair.add(mesh(rbox(0.06, 0.03, 0.26, 0.012), black, [x, 0.63, 0]));
  }

  return { root, screenAnchor, screenHit, steam, binders };
}
