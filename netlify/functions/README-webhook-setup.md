# Stripe Webhook Setup for VR Bookings

This setup automatically captures successful Stripe payments and submits the booking details to Netlify forms for easy management.

## Components Created

1. **Webhook Function**: `netlify/functions/stripe-webhook.js`
   - Handles Stripe webhook events
   - Extracts customer and booking data
   - Submits to Netlify forms

2. **Hidden Form**: Added to `index.html`
   - Netlify detects this form automatically
   - Creates form endpoint for submissions

## Required Environment Variables

Add these to your Netlify site environment variables:

```bash
STRIPE_SECRET_KEY=sk_live_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret from Stripe
```

## Stripe Webhook Configuration

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Add endpoint**: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
3. **Select events to send**: `checkout.session.completed`
4. **Copy the webhook secret** and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## What Data is Captured

The webhook captures and submits the following data to Netlify forms:

### Payment Information
- `session_id`: Stripe session ID
- `amount_paid`: Amount paid in cents
- `currency`: Payment currency (EUR)
- `payment_status`: Payment status

### Customer Information  
- `customer_email`: Customer email
- `customer_name`: Customer name
- `customer_phone`: Customer phone number
- `billing_address`: Full billing address

### Booking Details
- `vr_experience`: Selected VR experience (human-readable label)
- `participants`: Number of participants
- `booking_slot`: Selected date and time slot
- `booking_date`: When the booking was made

## Accessing Form Submissions

1. **Netlify Dashboard** → Your Site → Forms
2. You'll see a "vr-bookings" form with all submissions
3. You can export data, set up notifications, or integrate with other services

## Testing

1. **Test the webhook locally**:
   ```bash
   # Use Stripe CLI to forward webhooks
   stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
   ```

2. **Test a payment** through your booking form
3. **Check Netlify forms** to see if the data appears

## Notifications

You can set up email notifications in Netlify:
1. Go to Site Settings → Forms → Form notifications
2. Add email notification for "vr-bookings" form
3. Get notified whenever a new booking comes through

## Security

- Webhook signature verification ensures requests come from Stripe
- All sensitive data is handled server-side
- Form submissions are protected by Netlify's spam filtering

## Troubleshooting

- Check Netlify function logs for webhook processing errors
- Verify webhook secret matches between Stripe and environment variables
- Ensure the hidden form is properly deployed (check page source)
- Test webhook endpoint directly using Stripe CLI or dashboard 