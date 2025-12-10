-- Add address column to contacts table
-- Run this SQL in pgAdmin 4 Query Tool

ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS address VARCHAR(255);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
AND column_name = 'address';






