# Diana's Online Portfolio Application

A dynamic full-stack web application that transforms a static portfolio into a database-driven system with PHP API backend, MySQL database, and dynamic frontend.

## 📋 Project Overview

This project demonstrates a complete end-to-end web application architecture that includes:
- **Frontend**: HTML, CSS, JavaScript (Fetch API)
- **Backend**: PHP 8+ with PDO
- **Database**: MySQL with relational design
- **API**: RESTful JSON endpoints

## 🏗️ Architecture

```
portfolio/
├── api/                      # API Endpoints
│   ├── profile_api.php
│   ├── skills_api.php
│   ├── projects_api.php
│   ├── hobbies_api.php
│   ├── contacts_api.php
│   └── education_api.php
├── classes/                  # PHP Classes (Business Logic)
│   ├── Profile.php
│   ├── Skill.php
│   ├── Project.php
│   ├── Hobby.php
│   ├── Contact.php
│   └── Education.php
├── img/                      # Images and icons
├── database.php              # Database connection
├── portfolio_schema.sql      # Database schema
├── index.html               # Main frontend
├── portfolio.js             # Dynamic content loader
├── styles.css               # Existing styles
└── README.md                # This file
```

## 🚀 Installation & Setup

### Prerequisites
- **XAMPP** / **WAMP** / **LAMP** installed
- PHP 8.0 or higher
- MySQL 5.7 or higher
- Web browser

### Step 1: Database Setup

1. Start **Apache** and **MySQL** in XAMPP Control Panel
2. Open **phpMyAdmin** (http://localhost/phpmyadmin)
3. Create database:
   - Click "New" in left sidebar
   - Or import `portfolio_schema.sql` directly (it includes DROP/CREATE)
4. Import schema:
   - Select `portfolio_db` database
   - Click "Import" tab
   - Choose `portfolio_schema.sql` file
   - Click "Go"

### Step 2: Configure Database Connection

1. Open `database.php`
2. Update credentials if needed:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'root');      // Your MySQL username
define('DB_PASS', '');          // Your MySQL password
```

### Step 3: File Structure

Place files in your XAMPP htdocs folder:
```
C:\xampp\htdocs\portfolio\
```

### Step 4: Update Frontend

1. In `index.html`, replace the existing `script.js` script tag with:
```html
<!-- Portfolio API Script -->
<script src="portfolio.js"></script>
```

2. Keep the EmailJS scripts if you want to use the email functionality
3. Remove the `script.js` reference if you're fully replacing with `portfolio.js`

### Step 5: Test the Application

1. Open browser and navigate to: `http://localhost/portfolio/`
2. Verify that:
   - Profile data loads dynamically
   - Skills display with percentages
   - Projects show with images and tags
   - Tools section populates
   - Education timeline appears
   - Contact form submits to database

## 🧪 Testing API Endpoints

### Using Browser

Test read endpoints directly:
```
http://localhost/portfolio/api/profile_api.php?action=read&id=1
http://localhost/portfolio/api/skills_api.php?action=read&profile_id=1
http://localhost/portfolio/api/projects_api.php?action=read&profile_id=1
http://localhost/portfolio/api/hobbies_api.php?action=read&profile_id=1&category=tool
http://localhost/portfolio/api/education_api.php?action=read&profile_id=1
http://localhost/portfolio/api/contacts_api.php?action=stats
```

### Using Postman

#### GET Profile
```
GET http://localhost/portfolio/api/profile_api.php?action=read&id=1
```

#### GET Complete Profile (with stats)
```
GET http://localhost/portfolio/api/profile_api.php?action=complete&id=1
```

#### ADD Skill (POST)
```
POST http://localhost/portfolio/api/skills_api.php?action=add
Content-Type: application/json

{
    "profile_id": 1,
    "name": "React",
    "proficiency": 75,
    "type": "programming",
    "icon": "img/react_icon.png"
}
```

#### UPDATE Skill (POST)
```
POST http://localhost/portfolio/api/skills_api.php?action=update&id=1
Content-Type: application/json

{
    "name": "HTML5",
    "proficiency": 90,
    "type": "programming",
    "icon": "img/html_icon.png"
}
```

#### DELETE Skill (POST)
```
POST http://localhost/portfolio/api/skills_api.php?action=delete&id=9
```

#### SUBMIT Contact Form (POST)
```
POST http://localhost/portfolio/api/contacts_api.php?action=submit
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "I would like to work with you!"
}
```

### Using cURL

#### Get Profile
```bash
curl http://localhost/portfolio/api/profile_api.php?action=read&id=1
```

#### Add Project
```bash
curl -X POST http://localhost/portfolio/api/projects_api.php?action=add \
  -H "Content-Type: application/json" \
  -d '{
    "profile_id": 1,
    "title": "New Project",
    "description": "Project description",
    "link": "https://example.com",
    "image": "img/project.png",
    "tags": "Web,Design",
    "display_order": 5
  }'
```

## 📊 Database Schema Highlights

### Tables
1. **profile** - Personal information
2. **skills** - Programming languages & proficiency levels
3. **projects** - Portfolio projects
4. **hobbies** - Hobbies and tools (Figma, Sketch)
5. **education** - Academic background
6. **contacts** - Contact form submissions

### Advanced SQL Features Demonstrated

#### JOINs
```sql
SELECT p.name, s.name as skill, s.proficiency 
FROM profile p 
INNER JOIN skills s ON p.id = s.profile_id;
```

#### Aggregates with GROUP BY
```sql
SELECT type, COUNT(*) as count, AVG(proficiency) as avg_proficiency
FROM skills
GROUP BY type
HAVING AVG(proficiency) > 40;
```

#### Subqueries
```sql
SELECT * FROM projects 
WHERE profile_id IN (SELECT id FROM profile WHERE years_experience > 1);
```

#### CTE (Common Table Expression)
```sql
WITH HighSkills AS (
    SELECT profile_id, COUNT(*) as high_skill_count
    FROM skills
    WHERE proficiency > 70
    GROUP BY profile_id
)
SELECT p.name, h.high_skill_count
FROM profile p
JOIN HighSkills h ON p.id = h.profile_id;
```

## 🔑 Key Features

### Security
- ✅ Prepared statements (SQL injection prevention)
- ✅ Input validation
- ✅ Email validation
- ✅ Error handling
- ✅ PDO with exception mode

### API Features
- ✅ RESTful design
- ✅ JSON responses
- ✅ CORS headers
- ✅ Multiple actions per endpoint
- ✅ Consistent response format

### Database Features
- ✅ Foreign keys with cascading deletes
- ✅ Indexes for performance
- ✅ Timestamp tracking
- ✅ Enum types for categories
- ✅ Aggregate functions
- ✅ Views for complex queries

## 📖 API Documentation

### Standard Response Format
```json
{
    "success": true|false,
    "message": "Description of result",
    "data": [...] or {...}
}
```

### Available Actions

#### Profile API
- `read` - Get profile(s)
- `complete` - Get profile with statistics
- `add` - Add new profile
- `update` - Update profile
- `delete` - Delete profile

#### Skills API
- `read` - Get skills
- `by_type` - Group by type with stats
- `high_proficiency` - Filter by proficiency
- `add` - Add skill
- `update` - Update skill
- `delete` - Delete skill

#### Projects API
- `read` - Get projects
- `search` - Search by tags
- `add` - Add project
- `update` - Update project
- `delete` - Delete project

#### Hobbies/Tools API
- `read` - Get hobbies/tools (filter by category)
- `add` - Add hobby/tool
- `update` - Update hobby/tool
- `delete` - Delete hobby/tool

#### Education API
- `read` - Get education records
- `add` - Add education
- `update` - Update education
- `delete` - Delete education

#### Contacts API
- `read` - Get contact messages (filter by status)
- `stats` - Get statistics
- `submit` / `add` - Submit contact form
- `update_status` - Update message status
- `delete` - Delete message

## 🛠️ Customization

### Adding Your Own Data

1. **Update Profile** (ID=1 in database):
```sql
UPDATE profile SET 
    name = 'Your Name',
    bio = 'Your bio',
    contact_email = 'your@email.com'
WHERE id = 1;
```

2. **Add Skills**:
```sql
INSERT INTO skills (profile_id, name, proficiency, type, icon)
VALUES (1, 'Node.js', 80, 'programming', 'img/node_icon.png');
```

3. **Add Projects**:
```sql
INSERT INTO projects (profile_id, title, description, image, tags, display_order)
VALUES (1, 'My Project', 'Description', 'img/project.png', 'Tag1,Tag2', 1);
```

### Changing API Base URL

In `portfolio.js`, update:
```javascript
const API_BASE = 'api'; // Change to your path
```

### Adding More Fields

1. Add column to database
2. Update PHP class methods
3. Update API endpoint
4. Update frontend to display new field

## 🐛 Troubleshooting

### Database Connection Issues
- Check MySQL is running in XAMPP
- Verify credentials in `database.php`
- Ensure `portfolio_db` database exists

### API Returns Errors
- Check PHP error logs: `C:\xampp\apache\logs\error.log`
- Enable error reporting in `database.php`
- Verify table structure matches schema

### Frontend Not Loading Data
- Open browser console (F12)
- Check for JavaScript errors
- Verify API paths are correct
- Check CORS settings if using different domains

### Images Not Showing
- Ensure `img/` folder has all icons
- Check image paths in database match actual files
- Verify file permissions

## 📚 Learning Outcomes Demonstrated

✅ Database connection using PDO  
✅ PHP class-based architecture  
✅ CRUD operations with prepared statements  
✅ RESTful API design  
✅ JSON data handling  
✅ AJAX/Fetch API implementation  
✅ SQL JOINs and aggregate functions  
✅ Database indexing  
✅ Input validation  
✅ Error handling  
✅ MVC-like separation of concerns  

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review PHP error logs
3. Test API endpoints individually
4. Verify database schema is correct

## 📄 License

Educational project for Computer Science coursework.

## 👤 Author

**Diana Mae Castillon**
- GitHub: [@Dianacast6](https://github.com/Dianacast6)
- LinkedIn: [Diana Castillon](https://www.linkedin.com/in/diana-castillon-5603262a4/)
- Email: dianacast555@gmail.com

---

**Activity**: Building a Simple API and Front-End Application  
**Course**: BS Computer Science - Web Development  
**Institution**: Western Mindanao State University