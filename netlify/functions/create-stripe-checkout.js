const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// VR Experience options (matching your form)
const VR_EXPERIENCES = [
  { value: 'carracing', label: 'CAR - 8 racing games' },
  { value: 'doublevregg', label: 'DOUBLE VR EGG CHAIR - 200 games (variety of genres)' },
  { value: 'ultimatecrossing', label: 'ULTIMATE CROSSING 2 - 20 games' },
  { value: 'vr360', label: 'VR 360 - 14 games' },
  { value: 'virtualrelaxation', label: 'VIRTUAL RELAXATION - Relaxation experiences' },
  { value: 'kindbear', label: 'KIND BEAR - Children\'s adventures' }
];

// Participant options (1-10 people)
const PARTICIPANT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: `${i + 1}people`,
  label: `${i + 1} ${i === 0 ? 'person' : 'people'}`
}));

// Generate available time slots for the next 14 days
function generateAvailableSlots() {
  const slots = [];
  const today = new Date();
  
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Skip Mondays (closed)
    if (dayOfWeek === 1) continue;
    
    // Determine opening hours based on day
    let startHour, endHour;
    if (dayOfWeek === 0) { // Sunday
      startHour = 12;
      endHour = 18;
    } else { // Tuesday-Saturday
      startHour = 12;
      endHour = 20;
    }
    
    // Generate hourly slots, accounting for 30-minute break at 15:00-15:30
    for (let hour = startHour; hour < endHour; hour++) {
      const slotTime = new Date(currentDate);
      slotTime.setHours(hour, 0, 0, 0);
      
      // Skip if slot is during break time (15:00-15:30)
      if (hour === 15) {
        // Add 15:30 slot instead of 15:00
        const breakSlot = new Date(slotTime);
        breakSlot.setMinutes(30);
        
        if (breakSlot < new Date() && day === 0) continue; // Skip past times for today
        
        const dateStr = breakSlot.toLocaleDateString('en-GB');
        const timeStr = breakSlot.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        // Create alphanumeric-only value for Stripe (format: DDMMYYYYHHMM)
        const alphanumericValue = `${breakSlot.getDate().toString().padStart(2, '0')}${(breakSlot.getMonth() + 1).toString().padStart(2, '0')}${breakSlot.getFullYear()}${breakSlot.getHours().toString().padStart(2, '0')}${breakSlot.getMinutes().toString().padStart(2, '0')}`;
        
        slots.push({
          value: alphanumericValue,
          label: `${dateStr} at ${timeStr}`
        });
      } else {
        // Skip past time slots for today
        if (slotTime < new Date() && day === 0) continue;
        
        const dateStr = slotTime.toLocaleDateString('en-GB');
        const timeStr = slotTime.toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        // Create alphanumeric-only value for Stripe (format: DDMMYYYYHHMM)
        const alphanumericValue = `${slotTime.getDate().toString().padStart(2, '0')}${(slotTime.getMonth() + 1).toString().padStart(2, '0')}${slotTime.getFullYear()}${slotTime.getHours().toString().padStart(2, '0')}${slotTime.getMinutes().toString().padStart(2, '0')}`;
        
        slots.push({
          value: alphanumericValue,
          label: `${dateStr} at ${timeStr}`
        });
      }
    }
  }
  
  return slots.slice(0, 200); // Stripe limit for dropdown options
}

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
      amount = 50, // Default €10.00 deposit in cents
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

    // Generate available time slots
    const availableSlots = generateAvailableSlots();

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
              description: 'Deposit to secure your VR experience booking',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      // Custom fields for booking details
      custom_fields: [
        {
          key: 'vr_experience',
          type: 'dropdown',
          label: {
            type: 'custom',
            custom: 'VR Experience'
          },
          dropdown: {
            options: VR_EXPERIENCES
          },
          optional: false
        },
        {
          key: 'participants',
          type: 'dropdown',
          label: {
            type: 'custom',
            custom: 'Number of Participants'
          },
          dropdown: {
            options: PARTICIPANT_OPTIONS
          },
          optional: false
        },
        {
          key: 'booking_slot',
          type: 'dropdown',
          label: {
            type: 'custom',
            custom: 'Preferred Date & Time'
          },
          dropdown: {
            options: availableSlots
          },
          optional: false
        }
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