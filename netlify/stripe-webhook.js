// ============================================
// NETLIFY FUNCTION: Stripe Webhook
// ============================================
// Ruta: netlify/functions/stripe-webhook.js
// Maneja eventos de Stripe (pagos, cancelaciones, etc.)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Webhook Secret de Stripe
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Verificar firma del webhook
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  console.log('✅ Webhook received:', stripeEvent.type);

  // Manejar diferentes tipos de eventos
  try {
    switch (stripeEvent.type) {
      
      // ============================================
      // Checkout completado (pago inicial exitoso)
      // ============================================
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        
        console.log('💰 Checkout completed:', {
          id: session.id,
          email: session.customer_email,
          amount: session.amount_total / 100,
          mode: session.mode,
          plan: session.metadata?.plan
        });

        // TODO: Aquí puedes:
        // 1. Enviar email de bienvenida
        // 2. Crear cuenta de usuario en tu DB
        // 3. Activar acceso PRO
        // 4. Enviar notificación a Discord/Slack
        
        await handleSuccessfulCheckout(session);
        break;

      // ============================================
      // Pago de suscripción exitoso (renovación)
      // ============================================
      case 'invoice.payment_succeeded':
        const invoice = stripeEvent.data.object;
        
        // Evitar duplicado con checkout.session.completed
        if (invoice.billing_reason === 'subscription_create') {
          console.log('⏭️ Skipping first invoice (handled by checkout)');
          break;
        }
        
        console.log('🔄 Subscription renewed:', {
          customer: invoice.customer_email,
          amount: invoice.amount_paid / 100,
          subscription: invoice.subscription
        });

        // TODO: Enviar email de confirmación de renovación
        await handleSuccessfulRenewal(invoice);
        break;

      // ============================================
      // Pago fallido
      // ============================================
      case 'invoice.payment_failed':
        const failedInvoice = stripeEvent.data.object;
        
        console.log('❌ Payment failed:', {
          customer: failedInvoice.customer_email,
          attempt: failedInvoice.attempt_count,
          amount: failedInvoice.amount_due / 100
        });

        // TODO: Enviar email de alerta
        await handleFailedPayment(failedInvoice);
        break;

      // ============================================
      // Suscripción cancelada
      // ============================================
      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object;
        
        console.log('🚫 Subscription cancelled:', {
          customer: subscription.customer,
          id: subscription.id,
          status: subscription.status
        });

        // TODO: Revocar acceso PRO
        await handleCancellation(subscription);
        break;

      // ============================================
      // Suscripción actualizada
      // ============================================
      case 'customer.subscription.updated':
        const updatedSub = stripeEvent.data.object;
        
        console.log('🔄 Subscription updated:', {
          customer: updatedSub.customer,
          status: updatedSub.status,
          plan: updatedSub.items.data[0]?.price.id
        });
        break;

      default:
        console.log(`⚪ Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function handleSuccessfulCheckout(session) {
  console.log('📧 TODO: Send welcome email to', session.customer_email);
  
  // Aquí puedes integrar con:
  // - Mailgun: https://www.mailgun.com/
  // - SendGrid: https://sendgrid.com/
  // - AWS SES: https://aws.amazon.com/ses/
  
  // Ejemplo con fetch (si tienes un servicio de email):
  /*
  await fetch('https://api.mailgun.net/v3/YOUR_DOMAIN/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      from: 'HabitWolf Pro <noreply@habitwolf.com>',
      to: session.customer_email,
      subject: '🎉 ¡Bienvenido a HabitWolf Pro!',
      html: `
        <h1>¡Hola ${session.metadata.customer_name}!</h1>
        <p>Gracias por unirte a HabitWolf Pro.</p>
        <p><a href="${process.env.APP_URL}">🚀 Acceder a la app</a></p>
      `
    })
  });
  */
}

async function handleSuccessfulRenewal(invoice) {
  console.log('📧 TODO: Send renewal confirmation to', invoice.customer_email);
}

async function handleFailedPayment(invoice) {
  console.log('⚠️ TODO: Send payment failure alert to', invoice.customer_email);
  
  // Avisar al usuario que actualice su método de pago
  // Después de X intentos fallidos, suspender acceso
}

async function handleCancellation(subscription) {
  console.log('👋 TODO: Send goodbye email and revoke access');
  
  // 1. Revocar acceso PRO
  // 2. Downgrade a plan gratuito
  // 3. Enviar email de despedida (opcional: survey de feedback)
}
