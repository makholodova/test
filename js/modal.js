(() => {
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modalTitle');
  const bodyEl = document.getElementById('modalBody');
  const footer = document.getElementById('footer');



  const MODALS = {
    timer: {title: 'Добро пожаловать!', isPromo: true},
    footer: {title: 'Спасибо, что дочитали', isPromo: true},
    contact: {title: 'Связаться', isPromo: false}
  };

  const isFormSent = () => sessionStorage.getItem('requestSent') === 'true';
  const isPromoShown = () => sessionStorage.getItem('promoModalShown') === 'true';
  const isFooterShown = () => sessionStorage.getItem('footerModalShown') === 'true';

  const setFormSent = () => sessionStorage.setItem('requestSent', 'true');
  const setPromoShown = () => sessionStorage.setItem('promoModalShown', 'true');
  const setFooterShown = () => sessionStorage.setItem('footerModalShown', 'true');


  function lockBody(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function render(type) {
    if (type === 'timer') {
      return `
       <form class="form" data-form="${type}">
          <p class="form__text">Оставьте email для связи.</p>

          <label class="field">
            <span class="field__label">Email</span>
            <input class="field__input" name="email" type="email" placeholder="name@example.com" required />
            <span class="field__error" data-error-for="email"></span>
          </label>

          <button class="btn btn--primary" type="submit" disabled>Отправить</button>
        </form>
      `;
    }

    if (type === 'footer') {
      return `
       <form class="form" data-form="${type}">
          <p class="form__text">Оставьте телефон — перезвоним.</p>

          <label class="field">
            <span class="field__label">Телефон</span>
            <input class="field__input" name="phone" type="tel" placeholder="+7 (999) 000-00-00" required />
            <span class="field__error" data-error-for="phone"></span>
          </label>

          <button class="btn btn--primary" type="submit" disabled>Перезвоните мне</button>
        </form>
      `;
    }

    return `
      <form class="form" data-form="${type}" data-request-form>
        <label class="field">
          <span class="field__label">Имя</span>
          <input class="field__input" name="name" type="text" placeholder="Введите имя" required minlength="2" />
          <span class="field__error" data-error-for="name"></span>
        </label>

         <label class="field">
            <span class="field__label">Телефон</span>
            <input class="field__input" name="phone" type="tel" placeholder="+7 (999) 000-00-00" required />
            <span class="field__error" data-error-for="phone"></span>
          </label>

        <button class="btn btn--primary" type="submit" disabled>Отправить заявку</button>
      </form>
    `;
  }


  function openModal(type) {
    const contentModal = MODALS[type];

    if (isFormSent()) return;

    if (modal.classList.contains('is-open')) return;
    if (contentModal.isPromo && isPromoShown()) return;

    titleEl.textContent = contentModal.title;
    bodyEl.innerHTML = render(type)

    if (contentModal.isPromo) setPromoShown();
    if (type === 'footer') setFooterShown();

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lockBody(true);

    const form = bodyEl.querySelector('form');
    if (form) initValidation(form, type);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lockBody(false);

    bodyEl.innerHTML = '';
    titleEl.textContent = '';
  }

  modal.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    if (t.hasAttribute('data-modal-close')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    const btn = t.closest('[data-open-modal="contact"]');
    if (!btn) return;

    e.preventDefault();
    openModal('contact');
  });


  setTimeout(() => {
     if (isFooterShown()) return;

    openModal('timer');
  }, 40000);


  if (footer) {
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;

      io.disconnect();
      openModal('footer');
    }, {threshold: 0.15});

    io.observe(footer);
  }

  function initValidation(form, type) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = Array.from(form.querySelectorAll('input'));

    function setError(name, msg) {
      const err = form.querySelector(`[data-error-for="${name}"]`);
      if (err) err.textContent = msg || '';
    }

    function validateField(el) {
      const name = el.name;
      const value = el.value.trim();

      if (el.hasAttribute('required') && value.length === 0) {
        setError(name, 'Поле обязательно');
        return false;
      }

      if (name === 'phone' && value.length > 0) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10) {
          setError(name, 'Введите корректный телефон');
          return false;
        }
      }

      if (el.type === 'email' && value.length > 0) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!ok) {
          setError(name, 'Некорректный email');
          return false;
        }
      }

      const min = el.getAttribute('minlength');
      if (min && value.length > 0 && value.length < Number(min)) {
        setError(name, `Минимум ${min} символа`);
        return false;
      }

      setError(name, '');
      return true;
    }

    function validateForm() {
      const ok = inputs.every(validateField);
      if (submitBtn) submitBtn.disabled = !ok;
      return ok;
    }

    inputs.forEach((el) => {
      el.addEventListener('input', () => validateForm());
      el.addEventListener('blur', () => validateField(el));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const isRequest = form.hasAttribute('data-request-form');
      if (isRequest) {
        setFormSent();
        updateContactButtons();
      }

      bodyEl.innerHTML = `
        <div class="form">
         <p class="form__text">${isRequest ? 'Заявка отправлена!' : 'Спасибо! Данные отправлены.'}</p>
          <button class="btn btn--primary" type="button" data-modal-close>Закрыть</button>
        </div>
      `;
    });

    validateForm();
  }

  function updateContactButtons() {
    const buttons = document.querySelectorAll('[data-open-modal="contact"]');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      if (isFormSent()) {
        btn.disabled = true;
        btn.classList.add('is-disabled');
        btn.setAttribute('aria-disabled', 'true');

        btn.textContent = 'Заявка отправлена';
      }
    });
  }
  updateContactButtons();
})();
