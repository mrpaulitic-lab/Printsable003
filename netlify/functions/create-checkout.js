const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { priceId, affiliateCode } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: "https://printsable.store/success.html",
      cancel_url: "https://printsable.store/cancel.html",
      metadata: {
        affiliateCode: affiliateCode || "none"
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
