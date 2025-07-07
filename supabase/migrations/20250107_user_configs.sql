-- Create user_configs table
CREATE TABLE IF NOT EXISTS user_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  device_id TEXT NOT NULL,
  preferences JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, device_id)
);

-- Create indexes
CREATE INDEX idx_user_configs_user_id ON user_configs(user_id);
CREATE INDEX idx_user_configs_device_id ON user_configs(device_id);
CREATE INDEX idx_user_configs_created_at ON user_configs(created_at);

-- Enable RLS
ALTER TABLE user_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own configs
CREATE POLICY "Users can view own configs" ON user_configs
  FOR SELECT USING (auth.uid()::text = user_id);

-- Users can insert their own configs
CREATE POLICY "Users can insert own configs" ON user_configs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can update their own configs
CREATE POLICY "Users can update own configs" ON user_configs
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Users can delete their own configs
CREATE POLICY "Users can delete own configs" ON user_configs
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_configs_updated_at
  BEFORE UPDATE ON user_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add comment
COMMENT ON TABLE user_configs IS 'Stores user configuration and preferences per device';
COMMENT ON COLUMN user_configs.user_id IS 'User ID from authentication provider';
COMMENT ON COLUMN user_configs.user_email IS 'User email for notifications';
COMMENT ON COLUMN user_configs.device_id IS 'Unique device identifier';
COMMENT ON COLUMN user_configs.preferences IS 'User preferences as JSON (theme, notifications, etc)';