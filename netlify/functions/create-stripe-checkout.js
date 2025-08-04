const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { 
      amount = 1000, // Default €10.00 deposit in cents
      currency = 'eur',
      success_url,
      cancel_url,
      customer_email,
      metadata = {}
    } = JSON.parse(event.body || '{}');

    // Validate required URLs
    if (!success_url || !cancel_url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'success_url and cancel_url are required' 
        }),
      };
    }

    // Validate that required booking metadata is present
    if (!metadata.vr_experiences || !metadata.participants || !metadata.booking_slot) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Booking information is required (vr_experiences, participants, booking_slot)' 
        }),
      };
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url,
      cancel_url,
      customer_email,
      metadata,
      
      // Line items for the deposit
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'VR Experience Booking Deposit',
              description: `Deposit for ${metadata.vr_experience_labels || 'VR experience'} - ${metadata.participants} participants`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      // Collect customer information
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true
      },

      // Custom text
      custom_text: {
        submit: {
          message: 'Complete your VR experience booking with a €10 deposit'
        },
        after_submit: {
          message: 'Thank you! We will contact you to confirm your booking details.'
        }
      },

      // Enable automatic tax calculation if configured
      automatic_tax: {
        enabled: false, // Set to true if you have tax settings configured
      },

      // Set expiration (24 hours)
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
        expires_at: session.expires_at
      }),
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
}; 