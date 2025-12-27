// ============================================
// NETLIFY FUNCTION: Crear Checkout Session
// ============================================
// Ruta: netlify/functions/create-checkout.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { priceId, email, name, plan } = JSON.parse(event.body);

    // Validar datos
    if (!priceId || !email || !name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Faltan campos requeridos',
          details: { priceId: !!priceId, email: !!email, name: !!name }
        })
      };
    }

    console.log('Creating checkout session:', { plan, email, name });

    // Determinar modo (subscription o payment)
    const mode = plan === 'pro' ? 'subscription' : 'payment';
    
    // URL base del sitio
    const siteUrl = process.env.URL || 'http://localhost:8888';

    // Crear Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${siteUrl}/gracias.html?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&email=${encodeURIComponent(email)}`,
      cancel_url: `${siteUrl}/comprar.html?plan=${plan}`,
      customer_email: email,
      client_reference_id: email,
      metadata: {
        customer_name: name,
        plan: plan,
        created_at: new Date().toISOString()
      },
      // Para suscripciones
      ...(mode === 'subscription' && {
        subscription_data: {
          metadata: {
            customer_name: name,
            plan: plan
          }
        }
      }),
      // Configuración adicional
      billing_address_collection: 'auto',
      locale: 'es',
    });

    console.log('Checkout session created:', session.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Stripe error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message,
        type: error.type
      })
    };
  }
};
