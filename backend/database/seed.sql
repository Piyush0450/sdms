-- Insert Super Admin into admin table
INSERT INTO admin (admin_id, name, username, role, dob, email) 
VALUES ('A_001', 'System Super Admin', 'piyush_admin', 'super_admin', '25/09/2005', 'piyushchaurasiya348@gmail.com');

-- Insert User entry for Firebase authentication
INSERT INTO users (email, role, related_id) 
VALUES ('piyushchaurasiya348@gmail.com', 'super_admin', 'A_001');
