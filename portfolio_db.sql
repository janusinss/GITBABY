-- ==========================================
-- DIANA'S PORTFOLIO DATABASE (Enhanced)
-- Includes: Tables, Views, Triggers, and Data
-- ==========================================

-- 1. SETUP DATABASE
DROP DATABASE IF EXISTS portfolio_db;
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- Profile Table: Stores main user details
CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    hero_bio TEXT,
    hero_image VARCHAR(255),
    role VARCHAR(100),
    location VARCHAR(100),
    contact_email VARCHAR(150),
    phone VARCHAR(20),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255),
    photo VARCHAR(255),
    years_experience INT DEFAULT 0,
    projects_completed INT DEFAULT 0, -- This will be auto-updated by triggers
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Skills Table: Programming languages and proficiency
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    proficiency INT NOT NULL CHECK (proficiency BETWEEN 0 AND 100),
    type ENUM('programming', 'tool', 'soft') DEFAULT 'programming',
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Projects Table: Portfolio items
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
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Hobbies/Tools Table: Design tools like Figma
CREATE TABLE hobbies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    category ENUM('hobby', 'tool') DEFAULT 'hobby',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Education Table: Academic history
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
    FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Contacts Table: Stores form submissions
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ==========================================
-- 3. ADVANCED SQL: TRIGGERS
-- ==========================================

-- Trigger 1: Auto-Increase 'projects_completed' when a new project is added
DELIMITER //
CREATE TRIGGER after_project_insert 
AFTER INSERT ON projects
FOR EACH ROW 
BEGIN
    UPDATE profile 
    SET projects_completed = (SELECT COUNT(*) FROM projects WHERE profile_id = NEW.profile_id)
    WHERE id = NEW.profile_id;
END //
DELIMITER ;

-- Trigger 2: Auto-Decrease 'projects_completed' when a project is deleted
DELIMITER //
CREATE TRIGGER after_project_delete
AFTER DELETE ON projects
FOR EACH ROW 
BEGIN
    UPDATE profile 
    SET projects_completed = (SELECT COUNT(*) FROM projects WHERE profile_id = OLD.profile_id)
    WHERE id = OLD.profile_id;
END //
DELIMITER ;

-- ==========================================
-- 4. INSERT DATA (Matching index.html)
-- ==========================================

-- Profile Data
INSERT INTO profile (name, bio, hero_bio, hero_image, role, location, contact_email, phone, linkedin, github, facebook, photo, years_experience) 
VALUES (
    'Diana Mae Castillon',
    'I love design and everything related to art. I approach problems in a rational and practical way and seek the simplest and most functional solutions possible.',
    "Hi! I'm Diana Mae Castillon, a Frontend Designer based in the Philippines with experience in tech and apassion for creating visually appealing interfaces. I am currently living in Zamboanga City Philippines and pursuing a degree in Computer Science.",
    'img/frontme.png',
    'FrontEnd Designer',
    'Zamboanga City, Philippines',
    'dianacast555@gmail.com',
    '+63 993 592 9465',
    'https://www.linkedin.com/in/diana-castillon-5603262a4/',
    'https://github.com/Dianacast6',
    'https://www.facebook.com/igivebackshots/',
    'img/frontme.png',
    2
    -- Note: projects_completed will be updated automatically by triggers when we insert projects below!
);

-- Skills Data
INSERT INTO skills (profile_id, name, proficiency, type, icon) VALUES
(1, 'HTML', 85, 'programming', 'img/html_icon.png'),
(1, 'CSS', 71, 'programming', 'img/css_icon.png'),
(1, 'C++', 30, 'programming', 'img/c++_icon.png'),
(1, 'JavaScript', 39, 'programming', 'img/js_icon.png'),
(1, 'PHP', 29, 'programming', 'img/php_icon.png'),
(1, 'MySQL', 35, 'programming', 'img/mysql_icon.png'),
(1, 'Python', 62, 'programming', 'img/python_icon.png'),
(1, 'Django', 82, 'programming', 'img/django_icon.png');

-- Tools Data (Hobbies Table with category='tool')
INSERT INTO hobbies (profile_id, name, description, icon, category) VALUES
(1, 'Figma', 'Design and prototyping tool', 'img/figma_icon.png', 'tool'),
(1, 'Sketch', 'Vector graphics editor', 'img/sketch_icon.png', 'tool');

-- Projects Data
INSERT INTO projects (profile_id, title, description, link, image, tags, display_order) VALUES
(1, 'Cake Shop Website - cakes & co.', 'A beautiful e-commerce website for a cake shop', '#', 'img/cakeshop.png', 'UI/UX Design,Wireframe,Web Design', 1),
(1, 'NFT Trading Platform - Crypt ART', 'Modern NFT marketplace platform', '#', 'img/nftsite.png', 'UI Design,Wireframe,Web Design', 2),
(1, 'Scheduling Website - SyncSched', 'Scheduling and calendar management system', '#', 'img/syncsched.png', 'UI/UX Design,Wireframe,Web Design', 3),
(1, 'Animal Shelter App Page Design - StrayHaven', 'Mobile app design for animal shelter', '#', 'img/petsim.png', 'UI/UX Design,Wireframe,App Design', 4);

-- Education Data
INSERT INTO education (profile_id, institution, degree, field, start_year, end_year, description, display_order) VALUES
(1, 'Western Mindanao State University', 'BS in Computer Science', 'Computer Science', 2020, 'Present', 'Currently pursuing a degree in BS in Computer Science with a focus in Web Development and Software engineering', 1),
(1, 'FreeCodeCamp', 'Certificate', 'Responsive Web Design', 2025, '2025', 'Learned fundamental Web Development concepts, including HTML structure, CSS styling, and JavaScript interactivity. Gained practical experience in creating dynamic and interactive user interfaces.', 2);

-- ==========================================
-- 5. ADVANCED SQL: VIEWS
-- ==========================================

-- Complete Profile View: Joins multiple tables to give a summary
CREATE VIEW complete_profile AS
SELECT 
    p.id,
    p.name,
    p.bio,
    p.role,
    p.projects_completed, -- This is now accurate thanks to triggers
    COUNT(DISTINCT s.id) as total_skills,
    ROUND(AVG(s.proficiency), 1) as avg_skill_proficiency
FROM profile p
LEFT JOIN skills s ON p.id = s.profile_id
GROUP BY p.id;