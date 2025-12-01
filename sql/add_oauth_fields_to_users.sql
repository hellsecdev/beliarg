-- Migration: Add OAuth fields to users table
-- This script adds support for OAuth authentication (Telegram)

-- Add new columns for OAuth support
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider_type VARCHAR(20) DEFAULT 'email',
ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Make password_hash nullable (OAuth users don't have passwords)
ALTER TABLE users 
ALTER COLUMN password_hash DROP NOT NULL;

-- Update existing users to have provider_type = 'email'
UPDATE users 
SET provider_type = 'email' 
WHERE provider_type IS NULL;

-- Create unique index for OAuth providers (provider_type + provider_id)
-- This ensures one user per OAuth provider account
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_unique 
ON users(provider_type, provider_id) 
WHERE provider_id IS NOT NULL;

-- Create index for faster lookups by provider
CREATE INDEX IF NOT EXISTS idx_users_provider_type 
ON users(provider_type);

-- Grant permissions (if using specific user)
-- GRANT ALL PRIVILEGES ON TABLE users TO beliarg_user;

