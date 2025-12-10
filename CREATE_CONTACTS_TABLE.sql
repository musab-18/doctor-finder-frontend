-- ============================================
-- MANUAL SQL SCRIPT TO CREATE CONTACTS TABLE
-- ============================================
-- Run this script in pgAdmin 4 or psql if the table doesn't exist automatically
-- Make sure you're connected to the 'doctor_finder' database

-- Drop table if exists (use only if you want to recreate it)
-- DROP TABLE IF EXISTS contacts;

-- Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on createdAt for faster queries
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts("createdAt");

-- Create an index on isRead for faster filtering
CREATE INDEX IF NOT EXISTS idx_contacts_is_read ON contacts("isRead");

-- Verify the table was created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'contacts'
ORDER BY ordinal_position;

-- Test insert (optional)
-- INSERT INTO contacts (name, email, subject, message) 
-- VALUES ('Test User', 'test@example.com', 'Test Subject', 'Test message');

-- View all contacts
-- SELECT * FROM contacts ORDER BY "createdAt" DESC;







