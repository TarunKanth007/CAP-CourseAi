/*
  # Insert sample learning resources

  1. Sample Data
    - Insert comprehensive learning resources for all career paths
    - Include various types: courses, books, tutorials, certifications
    - Cover different difficulty levels and providers
    - Include both free and paid resources

  2. Categories Covered
    - Software Engineering
    - Data Science
    - Product Management
    - UX/UI Design
    - Digital Marketing
    - Cybersecurity
*/

-- Insert Software Engineering Resources
INSERT INTO learning_resources (title, description, type, provider, url, duration, difficulty, rating, skills, career_paths, price, is_free) VALUES
('Complete JavaScript Course', 'Master JavaScript from beginner to advanced level', 'course', 'Udemy', 'https://udemy.com/javascript-complete', '69 hours', 'beginner', 4.7, ARRAY['JavaScript', 'Web Development', 'Programming'], ARRAY['software-engineer'], 89.99, false),
('React - The Complete Guide', 'Build powerful, fast, user-friendly React.js applications', 'course', 'Udemy', 'https://udemy.com/react-complete', '48 hours', 'intermediate', 4.6, ARRAY['React', 'JavaScript', 'Frontend Development'], ARRAY['software-engineer'], 94.99, false),
('System Design Interview', 'An insider guide to system design interviews', 'book', 'Amazon', 'https://amazon.com/system-design-interview', '320 pages', 'advanced', 4.5, ARRAY['System Design', 'Architecture', 'Scalability'], ARRAY['software-engineer'], 29.99, false),
('freeCodeCamp JavaScript', 'Learn JavaScript fundamentals for free', 'tutorial', 'freeCodeCamp', 'https://freecodecamp.org/javascript', '300+ hours', 'beginner', 4.8, ARRAY['JavaScript', 'Programming', 'Web Development'], ARRAY['software-engineer'], 0, true),
('AWS Certified Developer', 'Prepare for AWS Developer certification', 'certification', 'AWS', 'https://aws.amazon.com/certification/certified-developer-associate/', '3 months', 'intermediate', 4.4, ARRAY['AWS', 'Cloud Computing', 'DevOps'], ARRAY['software-engineer'], 150.00, false);

-- Insert Data Science Resources
INSERT INTO learning_resources (title, description, type, provider, url, duration, difficulty, rating, skills, career_paths, price, is_free) VALUES
('Python for Data Science', 'Complete Python programming for data analysis', 'course', 'Coursera', 'https://coursera.org/python-data-science', '40 hours', 'beginner', 4.8, ARRAY['Python', 'Data Analysis', 'Pandas'], ARRAY['data-scientist'], 49.99, false),
('Machine Learning Specialization', 'Stanford University ML course by Andrew Ng', 'certification', 'Coursera', 'https://coursera.org/specializations/machine-learning', '3 months', 'intermediate', 4.9, ARRAY['Machine Learning', 'Statistics', 'Python'], ARRAY['data-scientist'], 79.99, false),
('Hands-On Machine Learning', 'Practical ML with Scikit-Learn and TensorFlow', 'book', 'O''Reilly', 'https://oreilly.com/hands-on-ml', '850 pages', 'intermediate', 4.7, ARRAY['Machine Learning', 'TensorFlow', 'Scikit-Learn'], ARRAY['data-scientist'], 44.99, false),
('Kaggle Learn', 'Free micro-courses in data science', 'tutorial', 'Kaggle', 'https://kaggle.com/learn', '50+ hours', 'beginner', 4.6, ARRAY['Data Science', 'Machine Learning', 'Python'], ARRAY['data-scientist'], 0, true),
('Google Data Analytics Certificate', 'Professional certificate in data analytics', 'certification', 'Google', 'https://coursera.org/google-data-analytics', '6 months', 'beginner', 4.5, ARRAY['Data Analysis', 'SQL', 'Tableau'], ARRAY['data-scientist'], 49.99, false);

-- Insert Product Management Resources
INSERT INTO learning_resources (title, description, type, provider, url, duration, difficulty, rating, skills, career_paths, price, is_free) VALUES
('Product Management Fundamentals', 'Learn the basics of product management', 'course', 'LinkedIn Learning', 'https://linkedin.com/learning/product-management', '12 hours', 'beginner', 4.4, ARRAY['Strategic Planning', 'Leadership', 'Market Research'], ARRAY['product-manager'], 29.99, false),
('Agile Project Management', 'Master agile methodologies for product development', 'certification', 'PMI', 'https://pmi.org/agile', '6 weeks', 'intermediate', 4.6, ARRAY['Agile Methodology', 'Scrum', 'Project Management'], ARRAY['product-manager'], 399.99, false),
('Inspired: How to Create Products', 'Essential reading for product managers', 'book', 'Amazon', 'https://amazon.com/inspired-products-customers-love', '368 pages', 'intermediate', 4.3, ARRAY['Product Strategy', 'Innovation', 'Leadership'], ARRAY['product-manager'], 24.99, false),
('Google Product Management', 'Free course on product management basics', 'tutorial', 'Google', 'https://grow.google/product-management', '20 hours', 'beginner', 4.2, ARRAY['Product Strategy', 'Analytics', 'User Research'], ARRAY['product-manager'], 0, true),
('Product School Certification', 'Comprehensive product management certification', 'certification', 'Product School', 'https://productschool.com/certification', '8 weeks', 'intermediate', 4.5, ARRAY['Product Strategy', 'Analytics', 'Leadership'], ARRAY['product-manager'], 1999.99, false);

-- Insert UX/UI Design Resources
INSERT INTO learning_resources (title, description, type, provider, url, duration, difficulty, rating, skills, career_paths, price, is_free) VALUES
('Google UX Design Certificate', 'Professional certificate in UX design', 'certification', 'Google', 'https://coursera.org/google-ux-design', '6 months', 'beginner', 4.7, ARRAY['User Research', 'Design Tools', 'Prototyping'], ARRAY['ux-designer'], 49.99, false),
('Advanced Figma Masterclass', 'Master Figma for professional design work', 'course', 'Skillshare', 'https://skillshare.com/figma-masterclass', '8 hours', 'intermediate', 4.5, ARRAY['Design Tools', 'Prototyping', 'UI Design'], ARRAY['ux-designer'], 19.99, false),
('Don''t Make Me Think', 'Classic book on web usability', 'book', 'Amazon', 'https://amazon.com/dont-make-me-think', '216 pages', 'beginner', 4.6, ARRAY['Usability Testing', 'User Experience', 'Web Design'], ARRAY['ux-designer'], 19.99, false),
('Adobe XD Free Tutorials', 'Learn Adobe XD for free', 'tutorial', 'Adobe', 'https://adobe.com/xd/tutorials', '30+ hours', 'beginner', 4.3, ARRAY['Design Tools', 'Prototyping', 'UI Design'], ARRAY['ux-designer'], 0, true),
('Nielsen Norman Group UX', 'Professional UX training and certification', 'certification', 'Nielsen Norman Group', 'https://nngroup.com/ux-certification', '40 hours', 'advanced', 4.8, ARRAY['User Research', 'Usability Testing', 'UX Strategy'], ARRAY['ux-designer'], 4900.00, false);

-- Insert Digital Marketing Resources
INSERT INTO learning_resources (title, description, type, provider, url, duration, difficulty, rating, skills, career_paths, price, is_free) VALUES
('Google Digital Marketing Certificate', 'Comprehensive digital marketing training', 'certification', 'Google', 'https://coursera.org/google-digital-marketing', '4 months', 'beginner', 4.6, ARRAY['SEO/SEM', 'Analytics', 'Social Media Marketing'], ARRAY['digital-marketer'], 49.99, false),
('Social Media Marketing Mastery', 'Master social media marketing strategies', 'course', 'HubSpot Academy', 'https://academy.hubspot.com/social-media', '15 hours', 'intermediate', 4.4, ARRAY['Social Media Marketing', 'Content Marketing', 'Brand Strategy'], ARRAY['digital-marketer'], 0, true),
('Content Marketing Institute', 'Advanced content marketing strategies', 'course', 'Content Marketing Institute', 'https://contentmarketinginstitute.com/training', '20 hours', 'intermediate', 4.3, ARRAY['Content Marketing', 'SEO/SEM', 'Brand Strategy'], ARRAY['digital-marketer'], 297.00, false),
('Facebook Blueprint', 'Free Facebook and Instagram advertising courses', 'tutorial', 'Facebook', 'https://facebook.com/business/learn', '100+ hours', 'beginner', 4.2, ARRAY['PPC Advertising', 'Social Media Marketing', 'Analytics'], ARRAY['digital-marketer'], 0, true),
('HubSpot Inbound Marketing', 'Inbound marketing methodology certification', 'certification', 'HubSpot', 'https://academy.hubspot.com/inbound-marketing', '4 hours', 'beginner', 4.5, ARRAY['Content Marketing', 'Email Marketing', 'Marketing Automation'], ARRAY['digital-marketer'], 0, true);

-- Insert Cybersecurity Resources
INSERT INTO learning_resources (title, description, type, provider, url, duration, difficulty, rating, skills, career_paths, price, is_free) VALUES
('CompTIA Security+ Certification', 'Industry-standard cybersecurity certification', 'certification', 'CompTIA', 'https://comptia.org/security-plus', '3 months', 'intermediate', 4.7, ARRAY['Network Security', 'Security Tools', 'Risk Assessment'], ARRAY['cybersecurity-analyst'], 370.00, false),
('Ethical Hacking Course', 'Learn ethical hacking and penetration testing', 'course', 'Cybrary', 'https://cybrary.it/ethical-hacking', '20 hours', 'advanced', 4.5, ARRAY['Ethical Hacking', 'Threat Analysis', 'Penetration Testing'], ARRAY['cybersecurity-analyst'], 0, true),
('CISSP Study Guide', 'Comprehensive guide for CISSP certification', 'book', 'Amazon', 'https://amazon.com/cissp-study-guide', '1000+ pages', 'advanced', 4.4, ARRAY['Security Policies', 'Risk Assessment', 'Compliance'], ARRAY['cybersecurity-analyst'], 59.99, false),
('SANS Cyber Aces', 'Free cybersecurity tutorials', 'tutorial', 'SANS', 'https://cyberaces.org', '50+ hours', 'beginner', 4.3, ARRAY['Network Security', 'Digital Forensics', 'Incident Response'], ARRAY['cybersecurity-analyst'], 0, true),
('Certified Ethical Hacker (CEH)', 'Professional ethical hacking certification', 'certification', 'EC-Council', 'https://eccouncil.org/ceh', '5 days', 'advanced', 4.6, ARRAY['Ethical Hacking', 'Penetration Testing', 'Vulnerability Assessment'], ARRAY['cybersecurity-analyst'], 1199.00, false);