-- Create sync_errors table for monitoring sync failures
CREATE TABLE IF NOT EXISTS sync_errors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sport_id INTEGER NOT NULL,
  sport_name TEXT NOT NULL,
  error_type TEXT NOT NULL CHECK (error_type IN ('network', 'api', 'validation', 'database', 'unknown')),
  error_message TEXT NOT NULL,
  error_details JSONB,
  endpoint TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX idx_sync_errors_sport_id ON sync_errors(sport_id);
CREATE INDEX idx_sync_errors_error_type ON sync_errors(error_type);
CREATE INDEX idx_sync_errors_created_at ON sync_errors(created_at DESC);

-- Create composite index for querying recent errors by sport
CREATE INDEX idx_sync_errors_sport_time ON sync_errors(sport_id, created_at DESC);

-- Add foreign key to sports table
ALTER TABLE sync_errors 
  ADD CONSTRAINT fk_sync_errors_sport 
  FOREIGN KEY (sport_id) 
  REFERENCES sports(id) 
  ON DELETE CASCADE;

-- Create a view for error statistics
CREATE VIEW sync_error_stats AS
SELECT 
  sport_id,
  sport_name,
  error_type,
  COUNT(*) as error_count,
  MAX(created_at) as last_error,
  MIN(created_at) as first_error
FROM sync_errors
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY sport_id, sport_name, error_type;

-- Add comments
COMMENT ON TABLE sync_errors IS 'Logs sync errors for monitoring and debugging';
COMMENT ON COLUMN sync_errors.error_type IS 'Categorized error type for easier filtering';
COMMENT ON COLUMN sync_errors.retry_count IS 'Number of retry attempts made';
COMMENT ON VIEW sync_error_stats IS 'Aggregated error statistics for the last 24 hours';