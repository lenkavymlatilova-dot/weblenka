const products = [
  { id: 1, name: 'Dýňové sušenky', pet: 'dog', badge: 'Nejprodávanější', icon: '🎃', price: 119, ing: 'Ovesná mouka, dýně, lněné semínko, kapka lososového oleje.' },
  { id: 2, name: 'Jablečno-mrkvové křupky', pet: 'dog', icon: '🍎', price: 109, ing: 'Jablko, mrkev, ovesné vločky, kokosový olej.' },
  { id: 3, name: 'Arašídové sušenky', pet: 'dog', badge: 'Oblíbené', icon: '🥜', price: 109, ing: 'Ovesná mouka, arašídové máslo bez soli, banán.' },
  { id: 4, name: 'Lososový olej a oves', pet: 'cat', badge: 'Oblíbené', icon: '🐟', price: 129, ing: 'Ovesná mouka, lososový olej, lněné semínko.' },
  { id: 5, name: 'Kočičí tráva a oves', pet: 'cat', icon: '🌿', price: 99, ing: 'Ovesné vločky, kočičí tráva, dýňový pyré.' },
  { id: 6, name: 'Dýně s lososovým olejem', pet: 'cat', badge: 'Novinka', icon: '🥣', price: 119, ing: 'Dýně, ovesná mouka, kapka lososového oleje.' }
];
const petLabel = { dog: 'Pro psy', cat: 'Pro kočky' };

const grid = document.getElementById('grid');
const cartList = document.getElementById('cart-list');
const cartCount = document.getElementById('cart-count');
const totalEl = document.getElementById('total');
const msg = document.getElementById('msg');
let cart = {};
let filter = 'all';

const kc = n => n.toLocaleString('cs-CZ') + ' Kč';

function renderGrid() {
  grid.innerHTML = '';
  products.filter(p => filter === 'all' || p.pet === filter).forEach(p => {
    const card = document.createElement('article');
    card.className = 'card ' + p.pet;
    card.innerHTML = `
      <div class="pic"><span aria-hidden="true">${p.icon}</span>${p.badge ? `<span class="badge">${p.badge}</span>` : ''}</div>
      <div class="body">
        <h3>${p.name}</h3>
        <p class="meta">${petLabel[p.pet]} · 150 g</p>
        <p class="ing">${p.ing}</p>
        <div class="row">
          <span class="price">${kc(p.price)}</span>
          <button class="add" data-id="${p.id}">Do košíku</button>
        </div>
      </div>`;
    grid.append(card);
  });
}

function renderCart() {
  cartList.innerHTML = '';
  let count = 0, total = 0;
  const ids = Object.keys(cart);
  if (!ids.length) {
    cartList.innerHTML = '<li class="empty">Košík je prázdný. Vyberte něco z nabídky.</li>';
  }
  ids.forEach(id => {
    const p = products.find(x => x.id == id);
    const qty = cart[id];
    count += qty; total += qty * p.price;
    const li = document.createElement('li');
    li.innerHTML = `<span class="name">${p.name}</span>
      <button data-act="minus" data-id="${id}" aria-label="Ubrat ${p.name}">−</button>
      <span>${qty}</span>
      <button data-act="plus" data-id="${id}" aria-label="Přidat ${p.name}">+</button>`;
    cartList.append(li);
  });
  cartCount.textContent = count;
  const ship = document.getElementById('ship');
  ship.textContent = total === 0 ? '' : total >= 990 ? 'Doprava zdarma' : `Do dopravy zdarma zbývá ${kc(990 - total)}`;
  totalEl.textContent = kc(total);
}

grid.addEventListener('click', e => {
  const btn = e.target.closest('.add');
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  cartCount.classList.remove('bump'); void cartCount.offsetWidth; cartCount.classList.add('bump');
  const p = products.find(x => x.id == id);
  const t = document.getElementById('toast');
  t.textContent = p.name + ' je v košíku';
  t.classList.add('show');
  clearTimeout(window._t); window._t = setTimeout(() => t.classList.remove('show'), 1600);
});

cartList.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] += btn.dataset.act === 'plus' ? 1 : -1;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
});

document.querySelectorAll('.filter').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.filter;
  document.querySelectorAll('.filter').forEach(x => x.classList.toggle('active', x === b));
  renderGrid();
}));

document.getElementById('cart-btn').addEventListener('click', () => {
  document.getElementById('objednavka').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('order-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  msg.className = 'msg';
  if (!Object.keys(cart).length) { msg.textContent = 'Nejdřív přidejte do košíku aspoň jeden pamlsek.'; msg.classList.add('err'); return; }
  if (!f.name.value.trim() || !/^\S+@\S+\.\S+$/.test(f.email.value)) {
    msg.textContent = 'Vyplňte jméno a platný e-mail.'; msg.classList.add('err'); return;
  }
  msg.textContent = `Děkujeme, ${f.name.value.trim()}! Objednávku potvrdíme e-mailem.`;
  msg.classList.add('ok');
  cart = {}; f.reset(); renderCart();
});

renderGrid();
renderCart();
