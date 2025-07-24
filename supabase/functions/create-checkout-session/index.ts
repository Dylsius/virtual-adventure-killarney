import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  experience: string;
  participants: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== CREATE CHECKOUT SESSION DEBUG ===')
    console.log('Request method:', req.method)
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    const rawBody = await req.text()
    console.log('Raw request body:', rawBody)
    
    let parsedBody
    try {
      parsedBody = JSON.parse(rawBody)
      console.log('Parsed request body:', JSON.stringify(parsedBody, null, 2))
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { priceId, bookingData }: { priceId: string; bookingData: BookingData } = parsedBody
    
    console.log('Extracted priceId:', priceId)
    console.log('Extracted bookingData:', JSON.stringify(bookingData, null, 2))

    // Validate required fields
    const missingFields = []
    if (!priceId) missingFields.push('priceId')
    if (!bookingData) missingFields.push('bookingData')
    if (bookingData) {
      if (!bookingData.name) missingFields.push('bookingData.name')
      if (!bookingData.email) missingFields.push('bookingData.email')
      if (!bookingData.phone) missingFields.push('bookingData.phone')
      if (!bookingData.date) missingFields.push('bookingData.date')
      if (!bookingData.time) missingFields.push('bookingData.time')
      if (!bookingData.experience) missingFields.push('bookingData.experience')
    }
    
    console.log('Missing fields:', missingFields)
    
    if (!priceId || !bookingData.name || !bookingData.email || !bookingData.phone || 
        !bookingData.date || !bookingData.time || !bookingData.experience) {
      console.error('Validation failed - missing required fields:', missingFields)
      return new Response(
        JSON.stringify({ 
          error: 'Missing required booking information', 
          missingFields: missingFields,
          receivedData: { priceId, bookingData }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Validation passed, creating Stripe checkout session...')
    
    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${req.headers.get('origin')}/booking`,
        'metadata[booking_data]': JSON.stringify(bookingData),
      }),
    })

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text()
      console.error('Stripe API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to create checkout session' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const session = await stripeResponse.json()

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})