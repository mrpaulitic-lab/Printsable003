async function testConnection() {
  try {
    const response = await fetch('/.netlify/functions/api/products');
    const data = await response.json();

    console.log('Backend response:', data);

    const status = document.getElementById('connection-status');

    if (Array.isArray(data)) {
      status.textContent = "✅ Backend Connected";
      status.style.color = "green";
    } else {
      status.textContent = "⚠️ Unexpected Response";
      status.style.color = "orange";
    }
  } catch (error) {
    console.error(error);
    const status = document.getElementById('connection-status');
    status.textContent = "❌ Backend NOT Connected";
    status.style.color = "red";
  }
}

testConnection();
