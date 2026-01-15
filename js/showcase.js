(() => {
  const grid = document.getElementById('cardsGrid');
  const filter = document.getElementById('filter');
  const emptyState = document.getElementById('emptyState');

  if (!grid || !filter || !emptyState) return;

  const items = [
    { id: 1, type: 'smartphone', title: 'iPhone 15', desc: '6.1", камера 48 МП', price: 89990 },
    { id: 2, type: 'smartphone', title: 'Samsung Galaxy S24', desc: 'AMOLED, быстрый экран', price: 99990 },
    { id: 3, type: 'smartphone', title: 'Xiaomi Redmi Note 13', desc: 'Лучший баланс цены', price: 24990 },
    { id: 4, type: 'laptop', title: 'MacBook Air M2', desc: 'Лёгкий, автономный', price: 139990 },
    { id: 5, type: 'laptop', title: 'ASUS Zenbook 14', desc: 'Тонкий, хороший дисплей', price: 119990 },
    { id: 6, type: 'laptop', title: 'Lenovo ThinkPad T14', desc: 'Надёжный для работы', price: 159990 },
    { id: 7, type: 'appliance', title: 'Холодильник LG DoorCooling+', desc: 'No Frost, инвертор', price: 84990 },
    { id: 8, type: 'appliance', title: 'Стиральная машина Bosch Serie 6', desc: 'Загрузка 8 кг, тихая', price: 69990 },
    { id: 9, type: 'appliance', title: 'Пылесос Dyson V11', desc: 'Беспроводной, мощный', price: 59990 },
  ];

  let activeFilter = 'all';

  function rub(n) {
    return new Intl.NumberFormat('ru-RU').format(n);
  }

  function typeLabel(type) {
    if (type === 'laptop') return 'Ноутбук';
    if (type === 'smartphone') return 'Смартфон';
    if (type === 'appliance') return 'Бытовая техника';
    return '';
  }

  function cardHTML(item) {
    return `
      <article class="card">
        <h3 class="card__name">${item.title}</h3>
        <p class="card__desc">${item.desc}</p>
        <div class="card__meta">
          <span class="badge">${typeLabel(item.type)}</span>
          <span class="badge">${rub(item.price)} ₽</span>
        </div>
      </article>
    `;
  }

  function render() {
    const list = activeFilter === 'all'
      ? items
      : items.filter(i => i.type === activeFilter);

    grid.innerHTML = list.map(cardHTML).join('');
    emptyState.hidden = list.length > 0;
  }

  filter.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;

    activeFilter = btn.dataset.filter || 'all';

    filter.querySelectorAll('.chip').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    render();
  });

  render();
})();
