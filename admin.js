const ordersDiv = document.getElementById('orders');
const summaryDiv = document.getElementById('summary');

async function loadOrders() {
  const res = await fetch('/.netlify/functions/api/orders');
  const orders = await res.json();

  ordersDiv.innerHTML = '';

  let totalRevenue = 0;
  let pendingCount = 0;

  orders.forEach(order => {
    totalRevenue += Number(order.total_price || 0);
    if (order.status === 'pending') pendingCount++;

    const div = document.createElement('div');
    div.className = "order-card";

    div.innerHTML = `
      <h3>${order.customer_name}</h3>
      <p>Email: ${order.customer_email}</p>
      <p>Product: ${order.products?.name || ''}</p>
      <p>Quantity: ${order.quantity}</p>
      <p>Total: $${order.total_price}</p>
      <p>Status: <span class="status ${order.status}">
        ${order.status}
      </span></p>
      <button onclick="updateStatus('${order.id}', 'fulfilled')">
        Mark Fulfilled
      </button>
      <hr>
    `;

    ordersDiv.appendChild(div);
  });

  summaryDiv.innerHTML = `
    <h2>Dashboard Summary</h2>
    <p>Total Orders: ${orders.length}</p>
    <p>Pending Orders: ${pendingCount}</p>
    <p>Total Revenue: $${totalRevenue.toFixed(2)}</p>
    <hr>
  `;
}

async function updateStatus(id, status) {
  await fetch('/.netlify/functions/api/fulfill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status })
  });

  loadOrders();
}

loadOrders();
