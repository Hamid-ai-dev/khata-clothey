-- Create table for managing allowed emails
CREATE TABLE public.allowed_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for allowed_emails
CREATE POLICY "Admin users can view all allowed emails" 
ON public.allowed_emails 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae 
    WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND ae.is_admin = true
  )
);

CREATE POLICY "Admin users can insert allowed emails" 
ON public.allowed_emails 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae 
    WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND ae.is_admin = true
  )
);

CREATE POLICY "Admin users can update allowed emails" 
ON public.allowed_emails 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae 
    WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND ae.is_admin = true
  )
);

CREATE POLICY "Admin users can delete allowed emails" 
ON public.allowed_emails 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae 
    WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    AND ae.is_admin = true
  )
);

-- Insert the admin email
INSERT INTO public.allowed_emails (email, is_admin) 
VALUES ('admin@accountledger.com', true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_allowed_emails_updated_at
BEFORE UPDATE ON public.allowed_emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if email is allowed
CREATE OR REPLACE FUNCTION public.is_email_allowed(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_emails 
    WHERE email = user_email
  );
$$;