-- Enable real-time replication for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
 
-- Verify the publication includes the messages table
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages'; 