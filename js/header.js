(() => {
  const midHeader = document.getElementById('midHeader');

  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) < 6) return;

    if (delta > 0 && y > 30) {
      midHeader?.classList.add('is-hidden');
    } else {
      midHeader?.classList.remove('is-hidden');
    }
    lastY = y;
  });
})();
