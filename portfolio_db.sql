-- Portfolio Database Schema
-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS portfolio_db;
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- Profile Table
CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    role VARCHAR(100),
    location VARCHAR(100),
    contact_email VARCHAR(150),
    phone VARCHAR(20),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255),
    photo VARCHAR(255),
    years_experience INT DEFAULT 0,
    projects_completed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Skills Table
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    proficiency INT NOT NULL CHECK (proficiency BETWEEN 0 AND 100),
    type ENUM('programming', 'tool', 'soft') DEFAULT 'programming',
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile (profile_id),
    INDEX idx_type (type)
) ENGINE=InnoDB;

-- Projects Table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(255),
    image VARCHAR(255),
    tags VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile (profile_id),
    INDEX idx_order (display_order)
) ENGINE=InnoDB;

-- Hobbies/Tools Table
CREATE TABLE hobbies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    category ENUM('hobby', 'tool') DEFAULT 'hobby',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile (profile_id),
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- Education Table
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255),
    field VARCHAR(255),
    start_year INT,
    end_year VARCHAR(20),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE,
    INDEX idx_profile (profile_id),
    INDEX idx_order (display_order)
) ENGINE=InnoDB;

-- Contacts Table (for storing messages)
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Insert sample data for Diana's portfolio
INSERT INTO profile (name, bio, role, location, contact_email, phone, linkedin, github, facebook, photo, years_experience, projects_completed) 
VALUES (
    'Diana Mae Castillon',
    'I love design and everything related to art. I approach problems in a rational and practical way and seek the simplest and most functional solutions possible.',
    'FrontEnd Designer',
    'Zamboanga City, Philippines',
    'dianacast555@gmail.com',
    '+63 993 592 9465',
    'https://www.linkedin.com/in/diana-castillon-5603262a4/',
    'https://github.com/Dianacast6',
    'https://www.facebook.com/igivebackshots/',
    'img/frontme.png',
    2,
    7
);

-- Insert skills
INSERT INTO skills (profile_id, name, proficiency, type, icon) VALUES
(1, 'HTML', 85, 'programming', 'img/html_icon.png'),
(1, 'CSS', 71, 'programming', 'img/css_icon.png'),
(1, 'JavaScript', 39, 'programming', 'img/js_icon.png'),
(1, 'PHP', 29, 'programming', 'img/php_icon.png'),
(1, 'Python', 62, 'programming', 'img/python_icon.png'),
(1, 'Django', 82, 'programming', 'img/django_icon.png'),
(1, 'C++', 30, 'programming', 'img/c++_icon.png'),
(1, 'MySQL', 35, 'programming', 'img/mysql_icon.png');

-- Insert tools
INSERT INTO hobbies (profile_id, name, description, icon, category) VALUES
(1, 'Figma', 'Design and prototyping tool', 'img/figma_icon.png', 'tool'),
(1, 'Sketch', 'Vector graphics editor', 'img/sketch_icon.png', 'tool');

-- Insert projects
INSERT INTO projects (profile_id, title, description, link, image, tags, display_order) VALUES
(1, 'Cake Shop Website - cakes & co.', 'A beautiful e-commerce website for a cake shop', '#', 'img/cakeshop.png', 'UI/UX Design,Wireframe,Web Design', 1),
(1, 'NFT Trading Platform - Crypt ART', 'Modern NFT marketplace platform', '#', 'img/nftsite.png', 'UI Design,Wireframe,Web Design', 2),
(1, 'Scheduling Website - SyncSched', 'Scheduling and calendar management system', '#', 'img/syncsched.png', 'UI/UX Design,Wireframe,Web Design', 3),
(1, 'Animal Shelter App Page Design - StrayHaven', 'Mobile app design for animal shelter', '#', 'img/petsim.png', 'UI/UX Design,Wireframe,App Design', 4);

-- Insert education
INSERT INTO education (profile_id, institution, degree, field, start_year, end_year, description, display_order) VALUES
(1, 'Western Mindanao State University', 'BS in Computer Science', 'Computer Science', 2020, 'Present', 'Currently pursuing a degree in BS in Computer Science with a focus in Web Development and Software engineering', 1),
(1, 'FreeCodeCamp', 'Certificate', 'Responsive Web Design', 2025, '2025', 'Learned fundamental Web Development concepts, including HTML structure, CSS styling, and JavaScript interactivity. Gained practical experience in creating dynamic and interactive user interfaces. Built responsive mobile-friendly web pages using modern HTML and techniques.', 2);

-- Create view for complete profile data (demonstrates JOIN)
CREATE VIEW complete_profile AS
SELECT 
    p.id,
    p.name,
    p.bio,
    p.role,
    p.location,
    p.contact_email,
    p.phone,
    p.years_experience,
    p.projects_completed,
    COUNT(DISTINCT s.id) as total_skills,
    COUNT(DISTINCT pr.id) as total_projects,
    AVG(s.proficiency) as avg_skill_proficiency
FROM profile p
LEFT JOIN skills s ON p.id = s.profile_id
LEFT JOIN projects pr ON p.id = pr.profile_id
GROUP BY p.id;

-- Query examples demonstrating SQL requirements:

-- 1. Basic SELECT with WHERE
-- SELECT * FROM skills WHERE proficiency > 50;

-- 2. JOIN example
-- SELECT p.name, s.name as skill, s.proficiency 
-- FROM profile p 
-- INNER JOIN skills s ON p.id = s.profile_id;

-- 3. Aggregate with GROUP BY and HAVING
-- SELECT type, COUNT(*) as count, AVG(proficiency) as avg_proficiency
-- FROM skills
-- GROUP BY type
-- HAVING AVG(proficiency) > 40;

-- 4. Subquery example
-- SELECT * FROM projects 
-- WHERE profile_id IN (SELECT id FROM profile WHERE years_experience > 1);

-- 5. CTE (Common Table Expression) example
-- WITH HighSkills AS (
--     SELECT profile_id, COUNT(*) as high_skill_count
--     FROM skills
--     WHERE proficiency > 70
--     GROUP BY profile_id
-- )
-- SELECT p.name, h.high_skill_count
-- FROM profile p
-- JOIN HighSkills h ON p.id = h.profile_id;

-- 6. ORDER BY with multiple columns
-- SELECT * FROM projects ORDER BY display_order ASC, created_at DESC;