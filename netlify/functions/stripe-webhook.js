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
      // Retrieve the full session with custom fields
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['customer_details']
      });

      // Extract booking information
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
        
        // Custom fields from checkout
        vr_experience: '',
        participants: '',
        booking_slot: '',
        booking_date: new Date().toISOString(),
      };

      // Extract custom fields
      if (fullSession.custom_fields) {
        fullSession.custom_fields.forEach(field => {
          if (field.key === 'vr_experience' && field.dropdown?.value) {
            // Find the label for the VR experience
            const vrExperiences = [
              { value: 'carracing', label: 'CAR - 8 racing games' },
              { value: 'doublevregg', label: 'DOUBLE VR EGG CHAIR - 200 games (variety of genres)' },
              { value: 'ultimatecrossing', label: 'ULTIMATE CROSSING 2 - 20 games' },
              { value: 'vr360', label: 'VR 360 - 14 games' },
              { value: 'virtualrelaxation', label: 'VIRTUAL RELAXATION - Relaxation experiences' },
              { value: 'kindbear', label: 'KIND BEAR - Children\'s adventures' }
            ];
            const experience = vrExperiences.find(exp => exp.value === field.dropdown.value);
            bookingData.vr_experience = experience ? experience.label : field.dropdown.value;
          } else if (field.key === 'participants' && field.dropdown?.value) {
            bookingData.participants = field.dropdown.value;
          } else if (field.key === 'booking_slot' && field.dropdown?.value) {
            // Parse the booking slot back to readable format
            const slotValue = field.dropdown.value;
            // Convert alphanumeric back to date (format: DDMMYYYYHHMM = 12 characters)
            if (slotValue.length === 12) {
              try {
                // Extract date components from alphanumeric string
                const dayStr = slotValue.substring(0, 2);
                const monthStr = slotValue.substring(2, 4);
                const yearStr = slotValue.substring(4, 8);
                const hourStr = slotValue.substring(8, 10);
                const minuteStr = slotValue.substring(10, 12);
                
                const day = parseInt(dayStr);
                const month = parseInt(monthStr);
                const year = parseInt(yearStr);
                const hour = parseInt(hourStr);
                const minute = parseInt(minuteStr);
                
                const date = new Date(year, month - 1, day, hour, minute);
                
                // Validate the date
                if (!isNaN(date.getTime())) {
                  const dateStr = date.toLocaleDateString('en-GB');
                  const timeStr = date.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  });
                  bookingData.booking_slot = `${dateStr} at ${timeStr}`;
                } else {
                  bookingData.booking_slot = slotValue;
                }
              } catch (error) {
                console.error('Error parsing booking slot:', error);
                bookingData.booking_slot = slotValue;
              }
            } else {
              bookingData.booking_slot = slotValue;
            }
          }
        });
      }

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