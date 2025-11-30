-- Create achievements table
-- This script should be run as postgres superuser

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    unlocked_at BIGINT,
    progress INTEGER DEFAULT 0,
    target INTEGER DEFAULT 0,
    UNIQUE(user_id, type)
);

-- Grant permissions to beliarg_user
GRANT ALL PRIVILEGES ON TABLE achievements TO beliarg_user;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);

