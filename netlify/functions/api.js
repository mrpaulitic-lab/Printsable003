const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  const method = event.httpMethod;
  const path = event.path.replace('/.netlify/functions/api', '');

  try {
    // ===============================
    // GET PRODUCTS
    // ===============================
    if (path === '/products' && method === 'GET') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      return success(data);
    }

    // ===============================
    // CREATE ORDER
    // ===============================
    if (path === '/orders' && method === 'POST') {
      const body = JSON.parse(event.body);

      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', body.product_id)
        .single();

      if (productError) throw productError;

      const total = product.base_price * (body.quantity || 1);

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            product_id: product.id,
            customer_name: body.customer_name,
            customer_email: body.customer_email,
            quantity: body.quantity || 1,
            file_url: body.file_url,
            total_price: total,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      return success(data);
    }

    // ===============================
    // GET ORDERS
    // ===============================
    if (path === '/orders' && method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return success(data);
    }

    // ===============================
    // UPDATE ORDER STATUS
    // ===============================
    if (path === '/fulfill' && method === 'POST') {
      const body = JSON.parse(event.body);

      const { data, error } = await supabase
        .from('orders')
        .update({ status: body.status })
        .eq('id', body.id)
        .select();

      if (error) throw error;

      return success(data);
    }

    return notFound();

  } catch (err) {
    return failure(err.message);
  }
};

function success(data) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

function failure(message) {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message })
  };
}

function notFound() {
  return {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Not Found' })
  };
}
