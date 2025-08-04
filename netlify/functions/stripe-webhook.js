const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }

  // Handle the checkout.session.completed event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    try {
      // Retrieve the full session with customer details and metadata
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer_details']
      });

      // Extract booking information from metadata
      const metadata = fullSession.metadata || {};
      
      const bookingData = {
        // Payment information
        session_id: fullSession.id,
        amount_paid: fullSession.amount_total,
        currency: fullSession.currency,
        payment_status: fullSession.payment_status,
        
        // Customer information
        customer_email: fullSession.customer_details?.email || fullSession.customer_email,
        customer_name: fullSession.customer_details?.name,
        customer_phone: fullSession.customer_details?.phone,
        
        // Billing address
        billing_address: fullSession.customer_details?.address ? 
          `${fullSession.customer_details.address.line1 || ''}, ${fullSession.customer_details.address.line2 || ''}, ${fullSession.customer_details.address.city || ''}, ${fullSession.customer_details.address.state || ''}, ${fullSession.customer_details.address.postal_code || ''}, ${fullSession.customer_details.address.country || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') : '',
        
        // Booking information from metadata
        vr_experiences: metadata.vr_experiences || '',
        vr_experience_labels: metadata.vr_experience_labels || '',
        participants: metadata.participants || '',
        booking_slot: metadata.booking_slot || '',
        booking_slot_label: metadata.booking_slot_label || '',
        booking_timestamp: metadata.booking_timestamp || new Date().toISOString(),
      };

      // Log the extracted booking data for debugging
      console.log('Extracted booking data:', bookingData);

      // Submit to Netlify form
      const formData = new URLSearchParams();
      formData.append('form-name', 'vr-bookings');
      
      // Add all booking data to form
      Object.entries(bookingData).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      // Submit to Netlify forms endpoint
      const siteUrl = process.env.URL || 'https://virtual-adventure-killarney.netlify.app';
      const netlifyResponse = await fetch(siteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!netlifyResponse.ok) {
        console.error('Failed to submit to Netlify form:', await netlifyResponse.text());
        throw new Error('Failed to submit booking data to form');
      }

      console.log('Booking data successfully submitted to Netlify form:', bookingData);

      return {
        statusCode: 200,
        body: JSON.stringify({ 
          received: true,
          session_id: session.id,
          message: 'Booking data processed successfully'
        }),
      };

    } catch (error) {
      console.error('Error processing booking data:', error);
      
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to process booking data',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }),
      };
    }
  }

  // Return success for other event types
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
}; 