-- TrialBridge: Storage bucket for pathology report PDFs
-- Run after 20250227000000_initial_schema.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports',
  false,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS: users can upload and read only their own files (path prefix = user id)
CREATE POLICY "Users can upload own reports"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'reports' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can read own reports"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'reports' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Service role full access to reports bucket"
  ON storage.objects FOR ALL
  TO service_role
  USING (bucket_id = 'reports')
  WITH CHECK (bucket_id = 'reports');
