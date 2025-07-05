-- Import mentors from CSV files into the mentors table
-- This script should be run after the mentors table is created

-- First, clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM mentors;

-- Import from existing CSV files
-- Note: This is a template - you'll need to run this for each CSV file
-- Replace 'filename.csv' with actual CSV filenames

-- Example for one file (repeat for each):
-- COPY mentors (name, linkedin, company, job_title, email, years_experience, state, source_file)
-- FROM '/path/to/webset-california.csv'
-- WITH (FORMAT csv, HEADER true, FORCE_NULL (name, linkedin, company, job_title, email, years_experience, state));

-- For now, we'll create a function to handle the import process
CREATE OR REPLACE FUNCTION import_mentors_from_csv()
RETURNS void AS $$
BEGIN
  -- This function will be called from a Node.js script
  -- that can properly parse CSV files and insert data
  RAISE NOTICE 'Use the Node.js import script instead of this function';
END;
$$ LANGUAGE plpgsql;

-- Create a function to get unique states from mentors table
CREATE OR REPLACE FUNCTION get_mentor_states()
RETURNS TABLE(state_name TEXT) AS $$
BEGIN
  RETURN QUERY SELECT DISTINCT state FROM mentors WHERE state IS NOT NULL ORDER BY state;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get mentor count by state
CREATE OR REPLACE FUNCTION get_mentor_count_by_state()
RETURNS TABLE(state_name TEXT, mentor_count BIGINT) AS $$
BEGIN
  RETURN QUERY 
    SELECT state, COUNT(*) as mentor_count 
    FROM mentors 
    WHERE state IS NOT NULL 
    GROUP BY state 
    ORDER BY mentor_count DESC;
END;
$$ LANGUAGE plpgsql; 