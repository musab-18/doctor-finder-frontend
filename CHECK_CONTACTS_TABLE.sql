-- SQL Queries to Check Contacts Table in PostgreSQL
-- Run these in pgAdmin 4, psql, or any PostgreSQL client

-- 1. Connect to the database first:
-- Make sure you're connected to the 'doctor_finder' database

-- 2. Check if the contacts table exists:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'contacts';

-- 3. View all tables in the database:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 4. Check the structure of the contacts table:
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'contacts'
ORDER BY ordinal_position;

-- 5. View ALL contact submissions:
SELECT * FROM contacts ORDER BY "createdAt" DESC;

-- 6. Count total contacts:
SELECT COUNT(*) as total_contacts FROM contacts;

-- 7. View unread contacts:
SELECT * FROM contacts WHERE "isRead" = false ORDER BY "createdAt" DESC;

-- 8. View contacts from today:
SELECT * FROM contacts 
WHERE DATE("createdAt") = CURRENT_DATE 
ORDER BY "createdAt" DESC;








