const productSelect = document.getElementById('product-select');
const orderForm = document.getElementById('order-form');

// ==========================
// LOAD PRODUCTS
// ==========================
async function loadProducts() {
  try {
    const res = await fetch('/.netlify/functions/api/products');
    const products = await res.json();

    productSelect.innerHTML = '';

    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = `${product.name} - $${product.base_price}`;
      productSelect.appendChild(option);
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// ==========================
// STRIPE CHECKOUT SUBMIT
// ==========================
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const orderData = {
      product_id: productSelect.value,
      customer_name: document.getElementById('customer-name').value,
      customer_email: document.getElementById('customer-email').value,
      quantity: parseInt(document.getElementById('quantity').value),
      file_url: document.getElementById('file-url').value,
      origin: window.location.origin
    };

    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();

    if (data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      alert("Stripe error: " + data.error);
    }

  } catch (error) {
    console.error("Checkout error:", error);
    alert("Something went wrong.");
  }
});

// Load products on page load
loadProducts();
