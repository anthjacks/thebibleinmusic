/*
  # Add PayPal Payment Fields to User Profiles

  1. Changes
    - Add `paypal_payment_id` column to store PayPal order/transaction ID
    - Add `paypal_payer_email` column to store PayPal payer email address
  
  2. Purpose
    - Track PayPal payment information for premium purchases
    - Enable payment verification and customer support
    - Replace Stripe payment tracking with PayPal tracking
  
  3. Security
    - These fields are protected by existing RLS policies on user_profiles table
    - Only authenticated users can view/update their own payment data
*/

-- Add PayPal payment tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'paypal_payment_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN paypal_payment_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'paypal_payer_email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN paypal_payer_email text;
  END IF;
END $$;