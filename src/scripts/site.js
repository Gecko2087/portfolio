const root = document.documentElement;
const en = root.lang === 'en';
const themePreference = matchMedia('(prefers-color-scheme: light)');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const desktop = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
const themeButton = document.querySelector('#theme-toggle');
const stage = document.querySelector('.scene');
const image = document.querySelector('#hero-preview-image');
const imageButton = document.querySelector('#hero-image-open');
const previewDemo = document.querySelector('#preview-demo');
const previewButtons = [...document.querySelectorAll('[data-preview]')];
const triageControls = document.querySelector('#triage-controls');
const triageResult = document.querySelector('#triage-result');
const triageButtons = [...triageControls.querySelectorAll('[data-triage]')];
const previewLabel = document.querySelector('#preview-label');
const previewDescription = document.querySelector('#preview-description');
const introDemoLabel = previewDemo.textContent.trim();
const triageDescription = previewDescription.textContent;
const walkthroughLabel = previewLabel.textContent;
const screenshot = document.querySelector('#screenshot-dialog');
const sectionLinks = [...document.querySelectorAll('.header-row nav a')];
const progress = document.querySelector('.reading-progress');
const topLink = document.querySelector('#back-to-top');
let webgl;
let preparingWebgl = false;
let webglUnavailable = false;
let motion;
let motionContext;
const hero = stage.closest('.hero');
const heroMotionChoice = document.querySelector('#hero-motion-choice');
const heroMotionKey = 'portfolio-cover-motion';
let heroMotionOptIn = false;
try { heroMotionOptIn = sessionStorage.getItem(heroMotionKey) === 'on'; } catch {}

function updateHeroMotionChoice() {
  heroMotionChoice.hidden = !motionPreference.matches;
  heroMotionChoice.setAttribute('aria-pressed', String(heroMotionOptIn));
  hero.toggleAttribute('data-ambient-motion', !motionPreference.matches || heroMotionOptIn);
}

heroMotionChoice.addEventListener('click', () => {
  heroMotionOptIn = !heroMotionOptIn;
  try { sessionStorage.setItem(heroMotionKey, heroMotionOptIn ? 'on' : 'off'); } catch {}
  updateHeroMotionChoice();
});
motionPreference.addEventListener('change', updateHeroMotionChoice);
updateHeroMotionChoice();

let heroVisible = true;
function updateAmbientMotion() {
  hero.toggleAttribute('data-motion-idle', !heroVisible || document.hidden);
}
new IntersectionObserver(([entry]) => {
  heroVisible = entry.isIntersecting;
  updateAmbientMotion();
}).observe(hero);
document.addEventListener('visibilitychange', updateAmbientMotion);
updateAmbientMotion();

let previewAnimations = [];
let selection = 0;
let pendingScroll = false;
const canAnimate = () => !motionPreference.matches;
const canRender = () => canAnimate() && desktop.matches && !webglUnavailable;

function updateThemeButton() {
  const isLight = (root.dataset.theme ?? (themePreference.matches ? 'light' : 'dark')) === 'light';
  themeButton.textContent = isLight ? '☾' : '☼';
  themeButton.setAttribute('aria-pressed', String(isLight));
  themeButton.setAttribute('aria-label', en ? 'Light theme' : 'Tema claro');
  themeButton.title = en ? (isLight ? 'Switch to dark theme' : 'Switch to light theme')
    : (isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
}
themeButton.addEventListener('click', () => {
  root.dataset.theme = themeButton.getAttribute('aria-pressed') === 'true' ? 'dark' : 'light';
  try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
  updateThemeButton();
});
themePreference.addEventListener('change', updateThemeButton);
updateThemeButton();
themeButton.hidden = false;

async function prepareMotion() {
  if (!motion) {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
    gsap.registerPlugin(ScrollTrigger);
    motion = gsap;
  }
  if (!canAnimate() || motionContext) return;
  motionContext = motion.context(() => {
    if (scrollY < 80 && desktop.matches) {
      motion.from('[data-hero-motion]', {
        y: 12, duration: .55, stagger: .065, clearProps: 'transform',
      });
    }
    document.querySelectorAll('[data-reveal]').forEach(card => {
      if (card.getBoundingClientRect().top < innerHeight) return;
      motion.from(card, {
        y: 24, opacity: .55, duration: .58, clearProps: 'transform,opacity',
        scrollTrigger: { trigger: card, start: 'top 94%', once: true },
      });
    });
  });
}

async function prepareWebgl() {
  if (preparingWebgl || webgl || !canRender()) return;
  preparingWebgl = true;
  try {
    const { mountScene } = await import('./scene');
    webgl = await mountScene(stage, canRender);
    if (!webgl && canRender()) webglUnavailable = true;
  } catch {
    webglUnavailable = true;
  } finally {
    preparingWebgl = false;
  }
}

function updateMotion() {
  const paused = !canAnimate();
  document.body.classList.toggle('motion-paused', paused);
  root.classList.toggle('motion-paused', paused);
  if (paused) {
    motionContext?.revert();
    motionContext = undefined;
    clearPreviewMotion();
  } else {
    prepareMotion().catch(() => {});
  }
  if (!canRender()) {
    webgl?.dispose();
    webgl = undefined;
  }
}

function queueWebgl() {
  if (!canRender()) return;
  if ('requestIdleCallback' in window) requestIdleCallback(prepareWebgl, { timeout: 2000 });
  else setTimeout(prepareWebgl, 250);
}
motionPreference.addEventListener('change', () => { updateMotion(); queueWebgl(); });
desktop.addEventListener('change', () => { updateMotion(); queueWebgl(); });
if (document.readyState === 'complete') queueWebgl();
else window.addEventListener('load', queueWebgl, { once: true });
updateMotion();

function clearPreviewMotion() {
  previewAnimations.forEach(animation => animation.cancel());
  previewAnimations = [];
}

function animateProjectPreview() {
  if (!canAnimate()) return;
  const options = { duration: 520, easing: 'cubic-bezier(.21,.8,.27,1)' };
  previewAnimations = [
    image.animate([
      { opacity: .3, transform: 'translateX(22px) scale(1.06)', clipPath: 'inset(0 14% 0 0)' },
      { opacity: 1, transform: 'none', clipPath: 'inset(0)' },
    ], options),
    stage.querySelector('.scene-caption').animate([
      { opacity: .4, transform: 'translateY(7px)' },
      { opacity: 1, transform: 'none' },
    ], { ...options, delay: 55 }),
    stage.querySelector('.scene-aura').animate([
      { opacity: .55, transform: 'scale(.86)' },
      { opacity: 1, transform: 'scale(1)' },
    ], { ...options, duration: 740 }),
  ];
}

async function switchProject(button) {
  const ticket = ++selection;
  const { preview: key } = button.dataset;
  const card = document.getElementById('project-' + key);
  const demo = card.querySelector('.demo-button');
  const isHelpdesk = key === 'helpdesk';
  const stageButton = triageButtons.find(item => item.getAttribute('aria-pressed') === 'true');
  const nextImage = isHelpdesk ? { src: stageButton.dataset.image, alt: stageButton.dataset.alt } : card.querySelector('img');
  const preloader = new Image();
  preloader.src = nextImage.src;
  try { await preloader.decode(); } catch { return; }
  if (ticket !== selection) return;

  clearPreviewMotion();
  previewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  stage.dataset.scene = key;
  document.querySelector('#preview-name').textContent = button.textContent.trim();
  triageControls.hidden = !isHelpdesk;
  triageResult.hidden = !isHelpdesk;
  previewLabel.textContent = isHelpdesk ? walkthroughLabel : en ? 'Project preview' : 'Vista del proyecto';
  previewDescription.textContent = isHelpdesk ? triageDescription : card.querySelector('.project-content > p').textContent;
  previewDemo.href = demo.href;
  previewDemo.target = demo.target;
  previewDemo.rel = demo.rel;
  previewDemo.textContent = isHelpdesk ? introDemoLabel : demo.textContent.trim();
  image.src = nextImage.src;
  image.alt = nextImage.alt;
  document.dispatchEvent(new CustomEvent('project-selected', { detail: key }));
  animateProjectPreview();
}
previewButtons.forEach(button => button.addEventListener('click', () => switchProject(button)));
document.querySelector('.scene-controls').hidden = false;

triageButtons.forEach(button => button.addEventListener('click', async () => {
  const ticket = ++selection;
  if (button.getAttribute('aria-pressed') === 'true') return;
  const { image: source, alt, priority, history, triage: state } = button.dataset;
  const preloader = new Image();
  preloader.src = source;
  try { await preloader.decode(); } catch {}
  if (ticket !== selection || stage.dataset.scene !== 'helpdesk') return;
  clearPreviewMotion();
  triageButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  image.src = source;
  image.alt = alt;
  triageResult.querySelector('strong').textContent = priority;
  triageResult.querySelector('.triage-history').textContent = history;
  triageResult.dataset.state = state;
}));
triageControls.hidden = false;

let screenshotTrigger;
function enlarge(source, trigger) {
  screenshotTrigger = trigger;
  const detail = screenshot.querySelector('img');
  detail.src = source.currentSrc || source.src;
  detail.alt = source.alt;
  screenshot.querySelector('#screenshot-caption').textContent = source.alt;
  screenshot.showModal();
  document.body.style.overflow = 'hidden';
}
imageButton.addEventListener('click', () => enlarge(image, imageButton));
document.querySelectorAll('[data-capture]').forEach(button => {
  button.addEventListener('click', () => enlarge(button.closest('.work-visual').querySelector('img'), button));
});
screenshot.addEventListener('close', () => {
  document.body.style.overflow = '';
  screenshotTrigger?.focus({ preventScroll: true });
});
screenshot.addEventListener('click', event => {
  if (event.target !== screenshot) return;
  const box = screenshot.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) screenshot.close();
});

const sections = sectionLinks.map(link => document.querySelector(link.hash));
function updateReading() {
  pendingScroll = false;
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  const scrolled = maxScroll > 0 ? scrollY / maxScroll : 0;
  progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, scrolled)) + ')';
  topLink.hidden = scrollY < 560;
  const current = scrolled > .98 ? sections.at(-1) : sections.findLast(section => section.getBoundingClientRect().top <= 170);
  sectionLinks.forEach(link => {
    if (link.hash === '#' + current?.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleReading() {
  if (pendingScroll) return;
  pendingScroll = true;
  requestAnimationFrame(updateReading);
}
window.addEventListener('scroll', scheduleReading, { passive: true });
window.addEventListener('resize', scheduleReading);
updateReading();
topLink.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#inicio').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: canAnimate() ? 'smooth' : 'instant' });
});
document.querySelectorAll('[data-language]').forEach(link => {
  link.addEventListener('click', () => {
    const current = sectionLinks.find(item => item.hasAttribute('aria-current'));
    const next = new URL(link.href);
    next.hash = current?.hash || location.hash;
    link.href = next.href;
  });
});
