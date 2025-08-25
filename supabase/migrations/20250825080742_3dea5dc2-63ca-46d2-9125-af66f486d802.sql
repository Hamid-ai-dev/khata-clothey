-- Fix function search path security warnings
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.get_customer_balance(UUID);

-- Recreate update function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate customer balance function with secure search path
CREATE OR REPLACE FUNCTION public.get_customer_balance(customer_uuid UUID)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_credit DECIMAL(10,2) := 0;
  total_debit DECIMAL(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total_credit
  FROM public.transactions
  WHERE customer_id = customer_uuid AND type = 'credit';
  
  SELECT COALESCE(SUM(amount), 0) INTO total_debit
  FROM public.transactions
  WHERE customer_id = customer_uuid AND type = 'debit';
  
  RETURN total_credit - total_debit;
END;
$$;