-- Add role-based access control. Existing accounts become regular users.
ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

-- After the migration, promote the intended account explicitly:
-- UPDATE users SET role = 'admin' WHERE username = 'YOUR_USERNAME';
