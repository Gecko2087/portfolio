document.querySelectorAll('[data-language]').forEach(link => {
  const destination = new URL(link.href);
  destination.search = location.search; destination.hash = location.hash;
  link.href = destination.href;
});
