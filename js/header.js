(() => {
  const midHeader = document.getElementById('midHeader');
  const mainHeader = document.getElementById('mainHeader');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - lastY;
    if (Math.abs(delta) < 6) return;

    if (delta > 0 && y > 30) {
      midHeader?.classList.add('is-hidden');
      mainHeader?.classList.add('is-hidden');
    } else {

      midHeader?.classList.remove('is-hidden');
      mainHeader?.classList.remove('is-hidden');
    }
    lastY = y;
  },{ passive: true });


  const dropdowns = document.querySelectorAll('[data-dropdown]');

  function closeAllDropdowns() {
    dropdowns.forEach(d => {
      d.classList.remove('is-open');
      const btn = d.querySelector('.dropdown__btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach(drop => {
    const btn = drop.querySelector('.dropdown__btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const isOpen = drop.classList.contains('is-open');
      closeAllDropdowns();

      if (!isOpen) {
        drop.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', () => closeAllDropdowns());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  function setMobileMenu(open) {
    if (!burger || !mobileMenu) return;

    burger.setAttribute('aria-expanded', String(open));
    if (open) {
      mobileMenu.hidden = false;
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.hidden = true;
      document.body.style.overflow = '';
    }
  }

  burger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setMobileMenu(!isOpen);
  });


  document.addEventListener('click', (e) => {
    if (!mobileMenu || mobileMenu.hidden) return;
    const target = e.target;

    if (target) {
      const insideMenu = mobileMenu.contains(target);
      const insideBurger = burger?.contains(target);
      if (!insideMenu && !insideBurger) setMobileMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMobileMenu(false);
  });

  const accBtns = document.querySelectorAll('[data-acc]');
  accBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));

      const panel = btn.nextElementSibling;
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) setMobileMenu(false);
  });
})();

