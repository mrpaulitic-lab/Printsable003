let products = JSON.parse(localStorage.getItem('products')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function save() {
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('orders', JSON.stringify(orders));
}

function createProduct() {
  const input = document.getElementById('productName');
  const name = input.value.trim();
  if (!name) return;

  products.push({ id: Date.now(), name });
  input.value = '';
  save();
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById('products');
  list.innerHTML = '';

  products.forEach(p => {
    list.innerHTML += `<li>${p.name}</li>`;
  });
}

function createOrder() {
  const input = document.getElementById('orderDetails');
  const details = input.value.trim();
  if (!details) return;

  orders.push({ id: Date.now(), details, status: 'pending' });
  input.value = '';
  save();
  renderOrders();
}

function renderOrders() {
  const list = document.getElementById('orders');
  list.innerHTML = '';

  orders.forEach(order => {
    list.innerHTML += `
      <li>
        ${order.details}
        <span class="status ${order.status}">
          ${order.status}
        </span>
        ${order.status === 'pending' ? `<button onclick="fulfill(${order.id})">Fulfill</button>` : ''}
      </li>
    `;
  });
}

function fulfill(id) {
  const order = orders.find(o => o.id === id);
  if (!order) return;

  order.status = 'fulfilled';
  save();
  renderOrders();
}

renderProducts();
renderOrders();
