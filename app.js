/* · EX DATA, VERITAS · — app.js
   HTML + CSS + JS vanilla. Sin frameworks, sin build. */
"use strict";

/* ═══════════ 1. Pixel-art auxiliar (palma) ═══════════ */

/* Pinta una rejilla de caracteres en un canvas (1 celda = 1 px nativo) */
function paintGrid(canvas, rows, legend) {
  const w = rows[0].length, h = rows.length;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      if (ch === "." || !legend[ch]) continue;
      ctx.fillStyle = legend[ch];
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/* Paleta canónica del personaje (para la palma en pixel art) */
const PAL = {
  fur: "#5a5146", shadow: "#302820", pad: "#25282b", light: "#d8c8aa"
};

/* Palma de mapache — 20×24 */
const PALM_ROWS = [
  "....................",
  ".........ll.........",
  "......ll.fs.ll......",
  "......fs.fs.fs......",
  "...ll.fs.fs.fs.ll...",
  "...fs.fs.fs.fs.fs...",
  "...fs.fs.fs.fs.fs...",
  "...fs.fs.fs.fs.fs...",
  "...fs.fs.fs.fs.fs...",
  "...fs.fs.fs.fs.fs...",
  "...fsffsffsffsffs...",
  "...ffffffffffffffs..",
  "..fffffffffffffffs..",
  "..fffffffffffffffs..",
  "..ffffpppppppffffs..",
  "..ffffpppppppffffs..",
  "..ffffpppppppffffs..",
  "..ffffpppppppffffs..",
  "..fffffffffffffffs..",
  "...ffffffffffffffs..",
  "....ssssssssssss....",
  "......ffffffffss....",
  "......ffffffffss....",
  "......ssssssssss...."
];
const PALM_LEGEND = { f: PAL.fur, s: PAL.shadow, p: PAL.pad, l: PAL.light };

/* ═══════════ 3. Copy y estado ═══════════ */

const ARIA = {
  palm:  { es: "Choca esos cinco", en: "High five" },
  theme: { es: "Cambiar tema", en: "Toggle theme" }
};

const PROJECTS = [
  {
    id: "cronicas-barbaras",
    nombre: "Crónicas Bárbaras Knowledge Graph",
    url: "https://lacrimae0rerum.github.io/cronicas-barbaras/",
    urlLabel: "CRONICAS-BARBARAS ↗",
    desc_es: "Visor estático del grafo de conocimiento del podcast Crónicas Bárbaras: 147 episodios, ~2500 entidades y 22 comunidades temáticas, con vistas por comunidad o episodio, búsqueda, timeline y deep linking por URL. Canvas 2D puro con d3-force solo para el layout, sin build step.",
    desc_en: "Static knowledge-graph viewer for the Crónicas Bárbaras podcast: 147 episodes, ~2,500 entities and 22 thematic communities, with community and episode views, search, a timeline and URL deep linking. Pure 2D canvas using d3-force only for layout — no build step."
  },
  {
    id: "alejandria",
    nombre: "AlejandrIA",
    url: "https://alejandria.exdataveritas.com",
    urlLabel: "ALEJANDRIA.EXDATAVERITAS.COM ↗",
    desc_es: "La pequeña biblioteca de términos de IA: una galaxia 3D de conceptos navegable.",
    desc_en: "The little library of AI terms: a navigable 3D galaxy of concepts."
  },
  {
    id: "team-journal",
    nombre: "Team Journal",
    url: "https://github.com/lacrimae0rerum/offsec-journal",
    urlLabel: "GITHUB ↗",
    desc_es: "Herramienta interna para gestionar equipos de seguridad ofensiva en un MSSP: personas, skills, proyectos, clientes y disponibilidad, con heatmap de carga y detección de skill-gap. YAML como fuente de verdad, SQLite como caché de lectura y toda modificación auditada vía journal con rollback. FastAPI + frontend estático.",
    desc_en: "Internal tool for managing offensive-security teams at an MSSP: people, skills, projects, clients and availability, with a workload heatmap and skill-gap detection. YAML as the source of truth, SQLite as a read cache, and every change audited through a journal with rollback. FastAPI plus a static frontend."
  },
  {
    id: "corvus-engine",
    nombre: "CorvusEngine",
    url: "TODO",
    urlLabel: "GITHUB ↗",
    desc_es: "Framework modular de inteligencia de nivel profesional para análisis, procesamiento y reporting multi-dominio (OSINT, GEOINT, económico, infraestructura, estratégico). Arquitectura por componentes con núcleos de personalidad adaptativos, alineada con estándares IC (ICD 203/206): ATT&CK, Diamond Model, TIBER-EU, STIX 2.1, contexto NIS2/DORA.",
    desc_en: "Professional-grade modular intelligence framework for multi-domain analysis, processing and reporting (OSINT, GEOINT, economic, infrastructure, strategic). Component-based architecture with adaptive personality cores, aligned to IC standards (ICD 203/206): ATT&CK, Diamond Model, TIBER-EU, STIX 2.1, NIS2/DORA context."
  },
  {
    id: "corvus-dossiers",
    nombre: "CorvusDossiers",
    url: "https://lacrimae0rerum.github.io/CorvusDossiers/",
    urlLabel: "CORVUSDOSSIERS ↗",
    desc_es: "Repositorio público de dossiers de CTI elaborados con CorvusEngine: kits de phishing, campañas de smishing e infraestructura maliciosa investigados solo mediante OSINT pasivo — sin escaneo activo, sin envío de formularios, sin explotación.",
    desc_en: "Public repository of CTI dossiers built with CorvusEngine: phishing kits, smishing campaigns and malicious infrastructure investigated through passive OSINT only — no active scanning, no form submissions, no exploitation."
  },
  {
    id: "vault-cti-juniors",
    nombre: "Vault CTI Juniors",
    url: "https://lacrimae0rerum.github.io/html-cti-for-juniors/",
    urlLabel: "HTML-CTI-FOR-JUNIORS ↗",
    desc_es: "Vault de Obsidian convertida en página web, usada en un MSSP como recurso didáctico y operativo del equipo CTI y SOC. Recopilación curada de mi vault personal.",
    desc_en: "Obsidian vault turned into a website, used at an MSSP as a training and operational resource for the CTI/SOC team. A curated selection from my personal vault."
  },
  {
    id: "grc-suite",
    nombre: "GRC Suite",
    url: "TODO",
    urlLabel: "GITHUB ↗",
    desc_es: "Herramienta privada basada en CorvusEngine + n8n para evaluar el riesgo de empresas candidatas a colaboración: toma OSINT de un motor upstream externo y genera un informe ejecutivo de 12 secciones para el comité de riesgos, con presencia del CISO.",
    desc_en: "Private tool built on CorvusEngine + n8n for risk-scoring prospective partner companies: ingests OSINT from an external upstream engine and produces a 12-section executive report for the risk committee, with CISO sign-off."
  },
  {
    id: "council-of-intel",
    nombre: "Council of Intel",
    url: "https://github.com/lacrimae0rerum/council-of-intel",
    urlLabel: "GITHUB ↗",
    desc_es: "App standalone de deliberación multi-LLM para análisis de inteligencia: 17 personalidades endurecidas — arquetipos SAT, doctrinarios IC como Kent o Heuer y pensadores estratégicos — deliberan en una única sesión y un Chairman pondera el dissent en un Stage Final estructurado. Sin turnos ni follow-up: una pregunta, un entregable.",
    desc_en: "Standalone multi-LLM deliberation app for intelligence analysis: 17 hardened personalities — SAT archetypes, IC doctrine figures like Kent and Heuer, and strategic thinkers — deliberate in a single session, with a Chairman weighing dissent into a structured final stage. No turns, no follow-up: one question, one deliverable."
  },
  {
    id: "oci-security-viewer",
    nombre: "OCI Security Viewer",
    url: "https://github.com/lacrimae0rerum/oci-security-viewer",
    urlLabel: "GITHUB ↗",
    desc_es: "Canvas visual drag-and-drop para diseñar arquitecturas de Oracle Cloud Infrastructure, reemplazo del OKIT que Oracle descontinuó en 2024: 14 tipos de recursos con anidamiento jerárquico, proyectos persistidos, export a PNG e import de Terraform en desarrollo. React 19 + TypeScript en el frontend, FastAPI + SQLite en el backend.",
    desc_en: "Visual drag-and-drop canvas for designing Oracle Cloud Infrastructure architectures, replacing the OKIT that Oracle discontinued in 2024: 14 resource types with hierarchical nesting, persisted projects, PNG export and Terraform import in progress. React 19 + TypeScript frontend, FastAPI + SQLite backend."
  },
  {
    id: "it-alignment-chart",
    nombre: "IT Alignment Chart",
    url: "https://lacrimae0rerum.github.io/it-alignment-chart/",
    urlLabel: "IT-ALIGNMENT-CHART ↗",
    desc_es: "Alignment chart interactivo de arquetipos del profesional IT sobre cuatro ejes — criterio, uso de IA, IQ y ética de trabajo — basado en el framework Hockenmaier × Recuenco: de Linus Torvalds a Prompt Goblin u Office Furniture. HTML/CSS/JS vanilla, cero dependencias.",
    desc_en: "Interactive alignment chart mapping IT professional archetypes across four axes — judgment, AI usage, IQ and work ethic — based on the Hockenmaier × Recuenco framework: from Linus Torvalds to Prompt Goblin or Office Furniture. Vanilla HTML/CSS/JS, zero dependencies."
  }
];

const state = {
  lang: "es",
  dark: true,
  scene: "palm",
  proj: null,
  introDone: false
};

const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE = window.matchMedia("(max-width: 760px)");
const SCENES = ["home", "manifiesto", "proyectos"];

const $ = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));

const noVideo = () => RM || MOBILE.matches;
const VIDEO_IDS = ["idleVideo", "introVideo", "maniVideo", "proyVideo", "proyVideoB", "proyIntroVideo"];

function prefetchVideos() {
  VIDEO_IDS.forEach(id => {
    const v = $(id);
    if (v && v.preload !== "auto") { v.preload = "auto"; v.load(); }
  });
}

/* ═══════════ 4. Hash: estado en la URL ═══════════ */

function parseHash() {
  const raw = location.hash.replace(/^#/, "");
  const out = { scene: null, lang: null, dark: null, p: null };
  const parts = raw.split("&").filter(Boolean);
  if (parts.length && !parts[0].includes("=")) out.scene = parts.shift();
  for (const kv of parts) {
    const [k, v] = kv.split("=");
    if (k === "lang") out.lang = v;
    else if (k === "dark") out.dark = v;
    else if (k === "p") out.p = v;
  }
  return out;
}

function buildHash(scene) {
  const parts = [];
  if (scene && scene !== "palm") parts.push(scene);
  if (state.lang === "en") parts.push("lang=en");
  if (!state.dark) parts.push("dark=0");
  if (scene === "proyectos" && state.proj) parts.push("p=" + state.proj);
  return parts.length ? "#" + parts.join("&") : "";
}

function syncHash() {
  const h = buildHash(state.scene);
  history.replaceState(null, "", h || location.pathname + location.search);
}

/* ═══════════ 5. Idioma y tema ═══════════ */

function applyLang() {
  const l = state.lang;
  document.documentElement.setAttribute("lang", l);
  document.documentElement.setAttribute("data-lang", l);
  $("langToggle").textContent = l === "es" ? "EN" : "ES";
  $("palmBtn").setAttribute("aria-label", ARIA.palm[l]);
  $("themeToggle").setAttribute("aria-label", ARIA.theme[l]);
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.dark ? "dark" : "light");
}

/* ═══════════ 6. Cortina de píxeles ═══════════ */

let transitioning = false;

function makeCells() {
  const c = $("curtain");
  const size = 48;
  const cols = Math.ceil(window.innerWidth / size);
  const rows = Math.ceil(window.innerHeight / size);
  c.classList.remove("fade");
  c.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
  c.innerHTML = "";
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const d = document.createElement("div");
      d.className = "cell";
      d._delay = Math.round(((col + r) / (cols + rows)) * 320 + Math.random() * 110);
      c.appendChild(d);
      cells.push(d);
    }
  }
  return cells;
}

async function curtainTransition(swap) {
  if (RM) {
    const c = $("curtain");
    c.innerHTML = "";
    c.classList.add("fade");
    void c.offsetWidth;
    c.classList.add("on");
    await wait(220);
    swap();
    await wait(80);
    c.classList.remove("on");
    await wait(220);
    c.classList.remove("fade");
    return;
  }
  const cells = makeCells();
  void $("curtain").offsetWidth;
  for (const d of cells) { d.style.transitionDelay = d._delay + "ms"; d.classList.add("on"); }
  await wait(480);
  swap();
  await wait(100);
  for (const d of cells) { d.style.transitionDelay = (430 - d._delay) + "ms"; d.classList.remove("on"); }
  await wait(500);
  $("curtain").innerHTML = "";
}

/* Deep link: entra cubierto y descubre la escena */
async function curtainReveal() {
  if (RM) return;
  const cells = makeCells();
  for (const d of cells) { d.style.transitionDelay = "0ms"; d.classList.add("on"); }
  void $("curtain").offsetWidth;
  await wait(120);
  for (const d of cells) { d.style.transitionDelay = (430 - d._delay) + "ms"; d.classList.remove("on"); }
  await wait(500);
  $("curtain").innerHTML = "";
}

/* ═══════════ 7. Escenas ═══════════ */

function setSceneRaw(scene) {
  state.scene = scene;
  document.body.dataset.scene = scene;
  if (scene !== "proyectos" && state.proj) closeCard(false);
  syncIdleLoop();
  syncProyLoop();
  syncManiLoop();
}

function seatRaccoon() {
  $("homeNav").classList.remove("hidden");
}

/* Loop idle del salón: se reproduce solo en home (y no con reduced motion) */
function startIdleLoop() {
  if (noVideo()) return;
  const v = $("idleVideo");
  v.classList.add("on");
  const p = v.play();
  if (p && p.catch) p.catch(() => v.classList.remove("on"));
}

function syncIdleLoop() {
  const v = $("idleVideo");
  if (!v || !v.classList.contains("on")) return;
  if (state.scene === "home") { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
  else v.pause();
}

/* Loops de proyectos: vídeo de entrada una vez, luego dos idles alternos */
let proyIntroPlayed = false;
const PROY_IDLES = ["proyVideo", "proyVideoB"];
let proyIdleIdx = 0;

function startProyIdle(cb) {
  const v = $(PROY_IDLES[proyIdleIdx]);
  v.classList.add("on");
  void v.offsetWidth;
  let shown = false;
  const ready = () => {
    if (shown) return;
    shown = true;
    v.classList.add("vis");
    if (cb) cb();
  };
  v.addEventListener("playing", ready, { once: true });
  const p = v.play();
  if (p && p.catch) p.catch(ready);
  /* red de seguridad: no bloquear el fundido más de 1.5 s */
  setTimeout(ready, 1500);
}

/* al terminar un idle, funde al otro POR ENCIMA (sin dejar ver el fondo) */
function switchProyIdle() {
  if (state.scene !== "proyectos") return;
  const old = $(PROY_IDLES[proyIdleIdx]);
  proyIdleIdx = 1 - proyIdleIdx;
  const nv = $(PROY_IDLES[proyIdleIdx]);
  nv.currentTime = 0;
  nv.classList.add("top");
  /* el viejo se queda visible (último frame) hasta que el nuevo cubra del todo */
  startProyIdle(() => {
    setTimeout(() => {
      old.classList.remove("vis", "on");
      old.pause();
      old.currentTime = 0;
      nv.classList.remove("top");
    }, 500);
  });
}

function playProyIntro() {
  const v = $("proyIntroVideo");
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (state.scene === "proyectos") {
      /* el idle arranca DEBAJO del vídeo de entrada; se espera a que esté
         reproduciéndose Y a que su fundido de opacidad termine antes de
         retirar la entrada, para que el fondo nunca quede expuesto */
      startProyIdle(() => {
        setTimeout(() => {
          v.classList.add("fadeout");
          setTimeout(() => v.classList.remove("playing", "fadeout"), 460);
        }, 500);
      });
    } else {
      v.classList.add("fadeout");
      setTimeout(() => v.classList.remove("playing", "fadeout"), 460);
    }
  };
  v.addEventListener("ended", finish, { once: true });
  v.addEventListener("error", finish, { once: true });
  const guard = setTimeout(() => { if (v.paused || !v.duration) finish(); }, 4000);
  v.addEventListener("ended", () => clearTimeout(guard), { once: true });
  v.classList.add("playing");
  const p = v.play();
  if (p && p.catch) p.catch(finish);
}

/* Loop de fondo del manifiesto */
function syncManiLoop() {
  const v = $("maniVideo");
  if (!v || noVideo()) return;
  if (state.scene === "manifiesto") {
    v.classList.add("on");
    const p = v.play();
    if (p && p.catch) p.catch(() => v.classList.remove("on"));
  } else if (v.classList.contains("on")) {
    v.pause();
  }
}

function syncProyLoop() {
  const intro = $("proyIntroVideo");
  if (noVideo()) return;
  if (state.scene === "proyectos") {
    if (!proyIntroPlayed) {
      proyIntroPlayed = true;
      playProyIntro();
    } else if (!intro.classList.contains("playing")) {
      startProyIdle();
    }
  } else {
    if (intro && intro.classList.contains("playing")) {
      intro.pause();
      intro.classList.remove("playing", "fadeout");
    }
    PROY_IDLES.forEach(id => { const v = $(id); if (v && v.classList.contains("on")) v.pause(); });
  }
}

async function routeTo(parsed) {
  if (parsed.lang) state.lang = parsed.lang === "en" ? "en" : "es";
  if (parsed.dark !== null) state.dark = parsed.dark !== "0";
  applyLang(); applyTheme();
  const target = SCENES.includes(parsed.scene) ? parsed.scene
    : (state.introDone ? "home" : "palm");
  state.proj = parsed.p || null;
  if (target !== state.scene && target !== "palm") {
    if (transitioning) return;
    transitioning = true;
    if (!state.introDone) { state.introDone = true; seatRaccoon(); startIdleLoop(); }
    await curtainTransition(() => {
      setSceneRaw(target);
      if (target === "proyectos") syncOpenCard();
    });
    transitioning = false;
  } else if (target === "proyectos") {
    syncOpenCard();
  }
}

/* ═══════════ 8. Proyectos ═══════════ */

function renderProjects() {
  const grid = $("projGrid");
  grid.innerHTML = "";
  PROJECTS.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.dataset.id = p.id;
    const idx = String(i + 1).padStart(2, "0");
    let body = "";
    if (p.desc_es !== "TODO") {
      body += '<p class="card-desc"><span lang="es">' + p.desc_es +
        '</span><span lang="en">' + p.desc_en + "</span></p>";
    }
    if (p.url !== "TODO") {
      body += '<a class="card-url" href="' + p.url + '" target="_blank" rel="noopener">' +
        p.urlLabel + "</a>";
    }
    card.innerHTML =
      '<div class="card-head"><span class="idx">' + idx + '</span>' +
      '<span class="cname">' + p.nombre + "</span></div>" +
      '<div class="card-body">' + body + "</div>";
    card.addEventListener("click", e => {
      if (e.target.closest(".card-url")) return;
      toggleCard(p.id);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(p.id); }
    });
    grid.appendChild(card);
  });
  $("projCount").textContent = String(PROJECTS.length).padStart(2, "0");
}

function toggleCard(id) {
  const open = document.querySelector(".card.open");
  if (open && open.dataset.id === id) { closeCard(true); return; }
  if (open) open.classList.remove("open");
  const card = document.querySelector('.card[data-id="' + id + '"]');
  if (card) {
    card.classList.add("open");
    state.proj = id;
    syncHash();
  }
}

function closeCard(updateHash) {
  const open = document.querySelector(".card.open");
  if (open) open.classList.remove("open");
  state.proj = null;
  if (updateHash) syncHash();
}

function syncOpenCard() {
  const open = document.querySelector(".card.open");
  if (state.proj) {
    if (open && open.dataset.id === state.proj) return;
    if (open) open.classList.remove("open");
    const card = document.querySelector('.card[data-id="' + state.proj + '"]');
    if (card) card.classList.add("open");
  } else if (open) {
    open.classList.remove("open");
  }
}

/* ═══════════ 9. Intro ═══════════ */

let introStarted = false;

async function runIntro() {
  if (introStarted) return;
  introStarted = true;
  state.introDone = true;

  const palmBtn = $("palmBtn"), circ = $("circSvg");
  const nav = $("homeNav");

  if (RM) {
    setSceneRaw("home");
    seatRaccoon();
    syncHash();
    return;
  }

  /* 1 · choque */
  circ.classList.add("out");
  palmBtn.classList.add("hifive");
  await wait(260);

  /* 2 · caída */
  palmBtn.classList.add("fall");
  await wait(650);

  /* pasar al salón */
  setSceneRaw("home");
  syncHash();
  nav.classList.add("hidden");

  /* 3 · vídeo de entrada */
  if (!noVideo()) await playIntroVideo();

  /* 4 · enlaces escalonados */
  nav.classList.add("stagger");
  nav.classList.remove("hidden");
  setTimeout(() => nav.classList.remove("stagger"), 1400);
}

/* Reproduce el vídeo de entrada una vez; si falla, sigue sin él */
function playIntroVideo() {
  return new Promise(res => {
    const v = $("introVideo");
    if (!v) { res(); return; }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      startIdleLoop();
      v.classList.add("fadeout");
      setTimeout(() => { v.classList.remove("playing", "fadeout"); res(); }, 460);
    };
    v.addEventListener("ended", finish, { once: true });
    v.addEventListener("error", finish, { once: true });
    /* red de seguridad por si el vídeo no llega a reproducirse */
    const guard = setTimeout(() => { if (v.paused || !v.duration) finish(); }, 4000);
    v.addEventListener("ended", () => clearTimeout(guard), { once: true });
    v.classList.add("playing");
    const p = v.play();
    if (p && p.catch) p.catch(finish);
  });
}

/* ═══════════ 10. Eventos ═══════════ */

function bindEvents() {
  $("palmBtn").addEventListener("click", runIntro);

  $("langToggle").addEventListener("click", () => {
    state.lang = state.lang === "es" ? "en" : "es";
    applyLang();
    syncHash();
  });

  $("themeToggle").addEventListener("click", () => {
    state.dark = !state.dark;
    applyTheme();
    syncHash();
  });

  /* enlaces de escena desde el salón: bocadillo → cortina */
  document.querySelectorAll("[data-scene-link]").forEach(a => {
    a.addEventListener("click", async e => {
      e.preventDefault();
      const target = a.dataset.sceneLink;
      if (transitioning) return;
      location.hash = buildHash(target);
    });
  });

  /* wordmark → salón */
  document.querySelector(".wordmark").addEventListener("click", e => {
    e.preventDefault();
    if (state.scene !== "home" && state.introDone) location.hash = buildHash("home");
  });

  $("returnBubble").addEventListener("click", () => {
    location.hash = buildHash("home");
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (state.scene === "proyectos" && state.proj) { closeCard(true); return; }
    if (state.scene === "manifiesto" || state.scene === "proyectos") {
      location.hash = buildHash("home");
    }
  });

  /* clic fuera cierra la tarjeta abierta */
  document.addEventListener("click", e => {
    if (state.scene !== "proyectos" || !state.proj) return;
    if (!e.target.closest(".card")) closeCard(true);
  });

  window.addEventListener("hashchange", () => routeTo(parseHash()));

  /* alternancia de idles en proyectos */
  PROY_IDLES.forEach(id => $(id).addEventListener("ended", switchProyIdle));

  MOBILE.addEventListener("change", e => {
    if (e.matches) { VIDEO_IDS.forEach(id => { const v = $(id); if (v) v.pause(); }); return; }
    if (RM) return;
    prefetchVideos();
    if (state.introDone) startIdleLoop();
    syncIdleLoop(); syncManiLoop(); syncProyLoop();
  });
}

/* ═══════════ 11. Init ═══════════ */

function buildSprites() {
  paintGrid($("miniPalmCv"), PALM_ROWS, PALM_LEGEND);
}

function init() {
  buildSprites();
  renderProjects();
  if (!noVideo()) prefetchVideos();

  const parsed = parseHash();
  state.lang = parsed.lang === "en" ? "en" : "es";
  state.dark = parsed.dark !== "0";
  applyLang();
  applyTheme();

  if (SCENES.includes(parsed.scene)) {
    /* deep link: sin intro, salón ya en estado final, cortina de entrada */
    state.introDone = true;
    introStarted = true;
    state.proj = parsed.p || null;
    seatRaccoon();
    startIdleLoop();
    setSceneRaw(parsed.scene);
    if (parsed.scene === "proyectos") syncOpenCard();
    curtainReveal();
  } else {
    setSceneRaw("palm");
  }

  bindEvents();
}

init();
