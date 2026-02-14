const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  const method = event.httpMethod;
  const path = event.path.replace('/.netlify/functions/api', '');

  if (path === '/products' && method === 'GET') {
    const { data, error } = await supabase.from('products').select('*');
    return response(data, error);
  }

  if (path === '/products' && method === 'POST') {
    const body = JSON.parse(event.body);
    const { data, error } = await supabase
      .from('products')
      .insert([{ name: body.name }])
      .select();
    return response(data, error);
  }

  if (path === '/orders' && method === 'GET') {
    const { data, error } = await supabase.from('orders').select('*');
    return response(data, error);
  }

  if (path === '/orders' && method === 'POST') {
    const body = JSON.parse(event.body);
    const { data, error } = await supabase
      .from('orders')
      .insert([{ details: body.details }])
      .select();
    return response(data, error);
  }

  if (path === '/fulfill' && method === 'POST') {
    const body = JSON.parse(event.body);
    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'fulfilled' })
      .eq('id', body.id)
      .select();
    return response(data, error);
  }

  return response({ message: 'Not found' }, null, 404);
};

function response(data, error, status = 200) {
  return {
    statusCode: error ? 400 : status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(error ? { error: error.message } : data)
  };
}
