(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible'); reveal.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  const targets = document.querySelectorAll('.section-heading,.project,.about-copy,.portrait,.experience-layout,.recruiter-panel,.contact');
  targets.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index % 2 * 85, 85)}ms`);
    if (!reduce.matches) { element.classList.add('reveal'); reveal.observe(element); }
  });
  reduce.addEventListener('change', () => {
    if (reduce.matches) { reveal.disconnect(); targets.forEach(el => el.classList.add('is-visible')); }
  });
  const nav = document.querySelector('.nav');
  const sentinel = document.querySelector('.hero');
  if (nav && sentinel) new IntersectionObserver(([entry]) => nav.classList.toggle('scrolled', !entry.isIntersecting)).observe(sentinel);
  const sections = [...document.querySelectorAll('main>section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      document.querySelectorAll('nav>a[href^="#"]').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
  document.querySelectorAll('[data-language]').forEach(link => {
    const destination = new URL(link.href);
    destination.search = location.search;
    destination.hash = location.hash;
    link.href = destination.href;
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-language]');
    if (link) { const destination = new URL(link.href); destination.hash = location.hash; link.href = destination.href; }
    const control = event.target.closest('[data-layer],[data-role]');
    const panel = control?.matches('[data-layer]') ? document.querySelector('.layer-detail') : document.querySelector('#role-summary');
    if (control && panel && !reduce.matches) panel.animate([{ opacity: .25, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' });
  });
})();
