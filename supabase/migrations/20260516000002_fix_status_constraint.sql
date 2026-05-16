-- Fix: add 'processing' to submissions status CHECK constraint
-- The diagnostic route inserts status='processing' but the constraint didn't allow it

ALTER TABLE submissions
  DROP CONSTRAINT IF EXISTS submissions_status_check;

ALTER TABLE submissions
  ADD CONSTRAINT submissions_status_check
  CHECK (status IN ('pending', 'processing', 'completed', 'error'));
