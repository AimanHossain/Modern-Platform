/*
  # Create storage buckets for file uploads

  1. New Storage Buckets
    - avatars: For user profile pictures
    - covers: For profile cover photos
    - posts: For post images

  2. Security
    - Public read access for all buckets
    - Upload access restricted to authenticated users
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png']),  -- 5MB limit
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png']),   -- 10MB limit
  ('posts', 'posts', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif']) -- 10MB limit
ON CONFLICT (id) DO NOTHING;

-- Create storage.objects SECURITY POLICIES
CREATE POLICY "Public Access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('avatars', 'covers', 'posts'));

CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('avatars', 'covers', 'posts'));

CREATE POLICY "Users can update own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner)
  WITH CHECK (bucket_id IN ('avatars', 'covers', 'posts'));

CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner AND bucket_id IN ('avatars', 'covers', 'posts'));