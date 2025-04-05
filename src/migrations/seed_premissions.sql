-- seed_permissions.sql

-- Frontend route permissions
INSERT INTO permissions (name, route, type, description)
VALUES
  ('view_home', '/home', 'frontend', 'Access home page'),
  ('view_dashboard', '/dashboard', 'frontend', 'Access dashboard'),
  ('view_post', '/post/:id', 'frontend', 'Read single post'),
  ('admin_login', '/admin/login', 'frontend', 'Admin login'),
  ('admin_register', '/admin/register', 'frontend', 'Admin registration');

-- Role to permission mappings
INSERT INTO role_permissions (role_id, permission_id)
VALUES
  (2, 1), (2, 2), (2, 3),  -- for 'user'
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5); -- for 'admin'
