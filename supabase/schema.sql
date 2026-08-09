-- Reclaim Database Schema
-- This file serves as a documentary record of the database structure 
-- set up in the Supabase SQL Editor.

-- ==========================================
-- 1. Tables
-- ==========================================

CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Core details
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  photo_url TEXT,
  
  -- User who posted it (since we don't use strict auth, we store their chosen name)
  reported_by TEXT NOT NULL,
  
  -- Claim tracking
  status TEXT DEFAULT 'open'::text CHECK (status IN ('open', 'pending', 'more_info_needed', 'claimed','returned')),
  
  -- JSON string containing claim requester name, proof text, photos, and meetup instructions
  claimed_by TEXT
);

-- ==========================================
-- 2. Row Level Security (RLS)
-- ==========================================

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reports (public feed)
CREATE POLICY "Allow public read access" ON reports
  FOR SELECT USING (true);

-- Allow anyone to insert reports
CREATE POLICY "Allow public insert access" ON reports
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update reports (needed for updating claim statuses)
CREATE POLICY "Allow public update access" ON reports
  FOR UPDATE USING (true);

-- Allow anyone to delete reports
CREATE POLICY "Allow public delete access" ON reports
  FOR DELETE USING (true);


-- ==========================================
-- 3. Storage
-- ==========================================

-- Note: The following represents the configuration of the 'item-images' bucket
-- which was created in the Supabase Storage Dashboard.

-- Bucket Name: 'item-images'
-- Public Access: Enabled

-- Example Storage Policies (applied to storage.objects):
-- 
-- CREATE POLICY "Give public access to item-images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'item-images');
-- 
-- CREATE POLICY "Allow public upload to item-images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'item-images');
