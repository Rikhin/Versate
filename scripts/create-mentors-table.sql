-- Create mentors table for storing all mentor profiles
CREATE TABLE IF NOT EXISTS mentors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  linkedin TEXT,
  company TEXT,
  job_title TEXT,
  email TEXT,
  years_experience TEXT,
  state TEXT,
  source_file TEXT, -- tracks which CSV file the mentor came from
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast search and filtering
CREATE INDEX IF NOT EXISTS idx_mentors_name ON mentors USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_mentors_company ON mentors USING gin(to_tsvector('english', company));
CREATE INDEX IF NOT EXISTS idx_mentors_job_title ON mentors USING gin(to_tsvector('english', job_title));
CREATE INDEX IF NOT EXISTS idx_mentors_state ON mentors(state);
CREATE INDEX IF NOT EXISTS idx_mentors_source_file ON mentors(source_file);

-- Enable RLS (we'll handle auth at API level)
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all reads (mentors are public data)
CREATE POLICY "Allow public read access to mentors" ON mentors
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_mentors_updated_at 
  BEFORE UPDATE ON mentors 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE mentors IS 'Stores all mentor profiles from CSV files for fast search and filtering'; 