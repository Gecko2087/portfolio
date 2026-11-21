try {
  const theme = localStorage.getItem('portfolio-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch {}
try {
  document.documentElement.classList.toggle('motion-paused', sessionStorage.getItem('portfolio-motion-paused') === 'true');
} catch {}
