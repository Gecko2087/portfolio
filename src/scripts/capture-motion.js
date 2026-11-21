const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('capture-entered');
    observer.unobserve(entry.target);
  }
}, { threshold: 0.12 });

document.querySelectorAll('.work-image img, .case-capture img').forEach(image => observer.observe(image));
