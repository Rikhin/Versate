-- Insert sample competitions
INSERT INTO competitions (name, description, category, organizer, registration_deadline, submission_deadline, team_size_min, team_size_max, grade_levels, format, skills_needed, location, prize_info, website_url) VALUES

-- STEM Competitions
('Regeneron International Science and Engineering Fair', 'The world''s largest international pre-college science competition', 'STEM', 'Society for Science', '2024-02-01', '2024-05-15', 1, 3, ARRAY['9', '10', '11', '12'], 'in-person', ARRAY['Research', 'Science', 'Engineering'], 'Various Locations', '$75,000+ in awards', 'https://www.societyforscience.org/isef/'),

('Conrad Challenge', 'Innovation competition focused on solving global challenges', 'STEM', 'Conrad Foundation', '2024-01-15', '2024-04-30', 2, 4, ARRAY['9', '10', '11', '12'], 'hybrid', ARRAY['Innovation', 'Engineering', 'Business'], 'Global', '$50,000+ in prizes', 'https://www.conradchallenge.org/'),

('eCYBERMISSION', 'STEM competition for students in grades 6-9', 'STEM', 'U.S. Army Educational Outreach Program', '2024-01-31', '2024-06-15', 3, 4, ARRAY['6', '7', '8', '9'], 'virtual', ARRAY['STEM', 'Research', 'Problem Solving'], 'United States', '$10,000+ in savings bonds', 'https://www.ecybermission.com/'),

-- Computer Science Competitions
('Congressional App Challenge', 'Nationwide competition encouraging students to code', 'Computer Science', 'U.S. House of Representatives', '2024-08-01', '2024-11-01', 1, 4, ARRAY['9', '10', '11', '12'], 'virtual', ARRAY['Programming', 'App Development', 'Web Development'], 'United States', 'Congressional Recognition', 'https://www.congressionalappchallenge.us/'),

('Technovation Girls', 'Global competition empowering girls to solve problems through technology', 'Computer Science', 'Technovation', '2024-01-15', '2024-08-15', 1, 5, ARRAY['8', '9', '10', '11', '12'], 'virtual', ARRAY['Mobile Development', 'Business Plan', 'Pitch'], 'Global', '$15,000+ in prizes', 'https://technovationchallenge.org/'),

('RoboCupJunior', 'International robotics competition for students', 'Computer Science', 'RoboCup Federation', '2024-03-01', '2024-07-15', 2, 4, ARRAY['6', '7', '8', '9', '10', '11', '12'], 'in-person', ARRAY['Robotics', 'Programming', 'Engineering'], 'Various Countries', 'Trophies and Recognition', 'https://junior.robocup.org/'),

-- Business & Entrepreneurship
('DECA Competitive Events', 'Business and marketing competition', 'Business & Entrepreneurship', 'DECA Inc.', '2024-02-15', '2024-04-25', 1, 3, ARRAY['9', '10', '11', '12'], 'in-person', ARRAY['Business', 'Marketing', 'Finance'], 'United States', 'Scholarships and Awards', 'https://www.deca.org/'),

('Diamond Challenge', 'High school entrepreneurship competition', 'Business & Entrepreneurship', 'University of Delaware', '2024-01-31', '2024-04-15', 1, 4, ARRAY['9', '10', '11', '12'], 'hybrid', ARRAY['Entrepreneurship', 'Business Plan', 'Pitch'], 'Global', '$100,000+ in prizes', 'https://diamondchallenge.org/'),

('NFTE World Series of Innovation', 'Entrepreneurship competition for young entrepreneurs', 'Business & Entrepreneurship', 'Network for Teaching Entrepreneurship', '2024-03-15', '2024-10-15', 1, 2, ARRAY['9', '10', '11', '12'], 'hybrid', ARRAY['Entrepreneurship', 'Innovation', 'Business'], 'Global', '$25,000+ in prizes', 'https://www.nfte.com/'),

-- Innovation & Design
('M3 Challenge', 'Mathematical modeling competition', 'Innovation & Design', 'SIAM', '2024-02-01', '2024-03-01', 3, 5, ARRAY['11', '12'], 'virtual', ARRAY['Mathematics', 'Modeling', 'Problem Solving'], 'United States', '$20,000+ in scholarships', 'https://m3challenge.siam.org/'),

('Destination Imagination', 'Creative problem-solving competition', 'Innovation & Design', 'Destination Imagination Inc.', '2024-01-15', '2024-05-15', 2, 7, ARRAY['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 'in-person', ARRAY['Creativity', 'Problem Solving', 'Teamwork'], 'Global', 'Trophies and Recognition', 'https://www.destinationimagination.org/'),

('Future City Competition', 'Engineering competition for middle school students', 'Innovation & Design', 'DiscoverE', '2024-10-01', '2024-02-15', 3, 3, ARRAY['6', '7', '8'], 'hybrid', ARRAY['Engineering', 'Urban Planning', 'Sustainability'], 'United States', '$7,500+ in prizes', 'https://futurecity.org/');
