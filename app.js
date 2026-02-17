const productSelect = document.getElementById('product-select');
const orderForm = document.getElementById('order-form');

// ==========================
// LOAD PRODUCTS
// ==========================
async function loadProducts() {
  const res = await fetch('/.netlify/functions/api/products');
  const products = await res.json();

  productSelect.innerHTML = '';

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - $${product.base_price}`;
    productSelect.appendChild(option);
  });
}

// ==========================
// SUBMIT ORDER
// ==========================
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderData = {
    product_id: productSelect.value,
    customer_name: document.getElementById('customer-name').value,
    customer_email: document.getElementById('customer-email').value,
    quantity: parseInt(document.getElementById('quantity').value),
    file_url: document.getElementById('file-url').value
  };

  const res = await fetch('/.netlify/functions/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });

  const result = await res.json();

  if (res.ok) {
    alert("Order Submitted Successfully!");
    orderForm.reset();
  } else {
    alert("Error: " + result.error);
  }
});

loadProducts();
