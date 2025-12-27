// ============================================
// NETLIFY FUNCTION: Verificar Sesión
// ============================================
// Ruta: netlify/functions/verify-session.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { session_id } = event.queryStringParameters || {};

    if (!session_id) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing session_id parameter' })
      };
    }

    console.log('Verifying session:', session_id);

    // Recuperar sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'customer']
    });

    console.log('Session verified:', {
      id: session.id,
      status: session.payment_status,
      email: session.customer_email
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: session.payment_status,
        customer_email: session.customer_email,
        customer_name: session.metadata?.customer_name,
        amount_total: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
        plan: session.metadata?.plan,
        mode: session.mode,
        created: session.created
      })
    };

  } catch (error) {
    console.error('Error verifying session:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
