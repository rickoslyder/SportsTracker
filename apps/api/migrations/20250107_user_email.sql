-- Add user_email column to user_configs table
ALTER TABLE user_configs
ADD COLUMN user_email VARCHAR(255);

-- Add index for email lookups
CREATE INDEX idx_user_configs_email ON user_configs(user_email);

-- Add comment
COMMENT ON COLUMN user_configs.user_email IS 'User email for notifications. Can be null for anonymous users.';