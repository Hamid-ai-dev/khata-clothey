-- Confirm the admin email
UPDATE auth.users 
SET email_confirmed_at = now(), 
    confirmed_at = now() 
WHERE email = 'admin@accountledger.com';