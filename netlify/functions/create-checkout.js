const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', body.product_id)
      .single();

    if (error) throw error;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name
            },
            unit_amount: Math.round(product.base_price * 100)
          },
          quantity: body.quantity || 1
        }
      ],
      success_url: `${body.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${body.origin}/`,
      metadata: {
        product_id: product.id,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        quantity: body.quantity,
        file_url: body.file_url
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }
};
