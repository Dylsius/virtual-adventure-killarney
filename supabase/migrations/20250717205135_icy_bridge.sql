/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text, customer name)
      - `email` (text, customer email)
      - `phone` (text, customer phone)
      - `booking_date` (date, preferred booking date)
      - `booking_time` (text, preferred booking time)
      - `experience` (text, selected VR experience)
      - `participants` (integer, number of participants)
      - `payment_status` (text, payment status)
      - `stripe_session_id` (text, Stripe session ID)
      - `deposit_amount` (decimal, deposit amount paid)
      - `created_at` (timestamp, booking creation time)
      - `updated_at` (timestamp, last update time)

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for service role to manage bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  experience text NOT NULL,
  participants integer NOT NULL DEFAULT 1,
  payment_status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  deposit_amount decimal(10,2) DEFAULT 10.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage all bookings
CREATE POLICY "Service role can manage bookings"
  ON bookings
  FOR ALL
  TO service_role
  USING (true);

-- Policy for authenticated users to read their own bookings (if needed later)
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON bookings(stripe_session_id);