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
  const table = document.getElementById('products');
  table.innerHTML = '';

  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td>${p.name}</td>
      </tr>
    `;
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
  const table = document.getElementById('orders');
  table.innerHTML = '';

  orders.forEach(order => {
    table.innerHTML += `
      <tr>
        <td>${order.details}</td>
        <td>
          <span class="status ${order.status}">
            ${order.status}
          </span>
        </td>
        <td>
          ${order.status === 'pending'
            ? `<button onclick="fulfill(${order.id})">Fulfill</button>`
            : ''}
        </td>
      </tr>
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
