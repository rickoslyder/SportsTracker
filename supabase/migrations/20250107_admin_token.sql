-- Add api_token column to admins table for API authentication
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS api_token TEXT UNIQUE;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_admins_api_token ON admins(api_token) WHERE api_token IS NOT NULL;

-- Generate tokens for existing admins (in production, these should be manually set)
UPDATE admins 
SET api_token = encode(gen_random_bytes(32), 'hex')
WHERE api_token IS NULL AND is_active = true;

-- Add comment
COMMENT ON COLUMN admins.api_token IS 'API token for authenticating admin API requests';