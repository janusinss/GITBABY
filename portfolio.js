/**
 * Portfolio Application - Frontend JavaScript
 * Connects to PHP API endpoints to load and manage dynamic content
 */

const API_BASE = 'api'; // Adjust this path based on your folder structure
const PROFILE_ID = 1; // Default profile ID

// Helper function to make API calls
async function apiCall(endpoint, action = 'read', options = {}) {
    try {
        const url = `${API_BASE}/${endpoint}?action=${action}${options.params || ''}`;
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }
        
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!data.success) {
            console.error(`API Error (${endpoint}):`, data.message);
        }
        
        return data;
        
    } catch (error) {
        console.error(`Network Error (${endpoint}):`, error);
        return { success: false, message: error.message };
    }
}

// Load Profile Data
async function loadProfile() {
    const result = await apiCall('profile_api.php', 'read', {
        params: `&id=${PROFILE_ID}`
    });
    
    if (result.success && result.data) {
        const profile = result.data;
        
        // Update hero section
        document.querySelector('.hero-title .highlight').textContent = profile.name.split(' ')[0] + ',';
        document.querySelector('.hero-subtitle').textContent = profile.role;
        document.querySelector('.hero-text').textContent = profile.bio;
        
        // Update search bar link
        const searchLink = document.querySelector('.search-input');
        if (searchLink) {
            searchLink.href = profile.linkedin;
            searchLink.textContent = profile.linkedin.replace('https://www.', '');
        }
        
        // Update about section
        document.querySelector('.about-description').textContent = profile.bio;
        
        // Update stats
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length >= 2) {
            stats[0].textContent = profile.projects_completed + '+';
            stats[1].textContent = profile.years_experience + '+';
        }
        
        // Update social links
        updateSocialLinks(profile);
        
        // Update contact section
        updateContactInfo(profile);
    }
}

// Update social links
function updateSocialLinks(profile) {
    const socialLinks = {
        facebook: profile.facebook,
        github: profile.github,
        linkedin: profile.linkedin
    };
    
    document.querySelectorAll('.social-link, .footer-social-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('facebook')) link.href = socialLinks.facebook;
        if (href && href.includes('github')) link.href = socialLinks.github;
        if (href && href.includes('linkedin')) link.href = socialLinks.linkedin;
    });
}

// Update contact information
function updateContactInfo(profile) {
    const contactItems = document.querySelectorAll('.contact-item .contact-text');
    if (contactItems.length >= 3) {
        contactItems[0].textContent = profile.phone;
        contactItems[1].textContent = profile.contact_email;
        contactItems[2].textContent = profile.location;
    }
}

// Load Skills
async function loadSkills() {
    const result = await apiCall('skills_api.php', 'read', {
        params: `&profile_id=${PROFILE_ID}`
    });
    
    if (result.success && result.data) {
        const languagesGrid = document.querySelector('.languages-grid');
        if (!languagesGrid) return;
        
        languagesGrid.innerHTML = '';
        
        result.data.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'language';
            skillElement.innerHTML = `
                <div class="language-icon">
                    <img src="${skill.icon || 'img/default_icon.png'}" alt="${skill.name}">
                </div>
                <div class="language-percentage">${skill.proficiency}%</div>
                <div class="language-name">${skill.name}</div>
            `;
            languagesGrid.appendChild(skillElement);
        });
    }
}

// Load Projects
async function loadProjects() {
    const result = await apiCall('projects_api.php', 'read', {
        params: `&profile_id=${PROFILE_ID}`
    });
    
    if (result.success && result.data) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        projectsGrid.innerHTML = '';
        
        result.data.forEach(project => {
            const tags = project.tags ? project.tags.split(',') : [];
            const tagsHTML = tags.map(tag => 
                `<span class="project-tag">${tag.trim()}</span>`
            ).join('');
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image || 'img/default_project.png'}" alt="${project.title}">
                </div>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <h3 class="project-title">${project.title}</h3>
            `;
            
            if (project.link && project.link !== '#') {
                projectCard.style.cursor = 'pointer';
                projectCard.addEventListener('click', () => {
                    window.open(project.link, '_blank');
                });
            }
            
            projectsGrid.appendChild(projectCard);
        });
    }
}

// Load Tools
async function loadTools() {
    const result = await apiCall('hobbies_api.php', 'read', {
        params: `&profile_id=${PROFILE_ID}&category=tool`
    });
    
    if (result.success && result.data) {
        const toolsGrid = document.querySelector('.tools-grid');
        if (!toolsGrid) return;
        
        toolsGrid.innerHTML = '';
        
        result.data.forEach(tool => {
            const toolElement = document.createElement('div');
            toolElement.className = 'tool';
            toolElement.innerHTML = `
                <div class="tool-icon">
                    <div class="tool-icon-inner">
                        <img src="${tool.icon || 'img/default_icon.png'}" alt="${tool.name}">
                    </div>
                </div>
                <div class="tool-name">${tool.name}</div>
            `;
            toolsGrid.appendChild(toolElement);
        });
    }
}

// Load Education
async function loadEducation() {
    const result = await apiCall('education_api.php', 'read', {
        params: `&profile_id=${PROFILE_ID}`
    });
    
    if (result.success && result.data) {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        
        // Clear existing timeline items (keep decorations)
        const items = timeline.querySelectorAll('.timeline-item');
        items.forEach(item => item.remove());
        
        result.data.forEach((edu, index) => {
            const position = index % 2 === 0 ? 'left' : 'right';
            const yearDisplay = edu.end_year === 'Present' ? 
                `${edu.start_year} - ${edu.end_year}` : 
                edu.end_year;
            
            const eduElement = document.createElement('div');
            eduElement.className = `timeline-item ${position}`;
            eduElement.innerHTML = `
                <div class="education-card">
                    <div class="education-header">
                        <div class="education-icon">
                            <img src="img/education.png" alt="Education">
                        </div>
                        <div>
                            <p class="education-type">Education</p>
                            <p class="education-date">${yearDisplay}</p>
                        </div>
                    </div>
                    <h3 class="education-title">${edu.institution}</h3>
                    <p class="education-field">${edu.field || edu.degree}</p>
                    <p class="education-description">${edu.description}</p>
                </div>
            `;
            
            // Insert before the bottom decoration
            const bottomDecoration = timeline.querySelector('.timeline-decoration.bottom');
            if (bottomDecoration) {
                timeline.insertBefore(eduElement, bottomDecoration);
            } else {
                timeline.appendChild(eduElement);
            }
        });
    }
}

// Handle Contact Form Submission
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        subject: form.querySelector('#subject').value,
        message: form.querySelector('#message').value
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const result = await apiCall('contacts_api.php', 'submit', {
        method: 'POST',
        body: formData
    });
    
    const messageDiv = form.querySelector('#form-message');
    
    if (result.success) {
        messageDiv.textContent = result.message;
        messageDiv.className = 'form-message success';
        form.reset();
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'form-message';
        }, 5000);
    } else {
        messageDiv.textContent = result.message || 'Error sending message. Please try again.';
        messageDiv.className = 'form-message error';
    }
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Loading portfolio data from API...');
    
    try {
        // Load all dynamic content
        await Promise.all([
            loadProfile(),
            loadSkills(),
            loadProjects(),
            loadTools(),
            loadEducation()
        ]);
        
        console.log('Portfolio data loaded successfully');
        
        // Setup contact form if it exists
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmit);
        }
        
    } catch (error) {
        console.error('Error loading portfolio:', error);
    }
});

// Export functions for admin panel use
window.portfolioAPI = {
    loadProfile,
    loadSkills,
    loadProjects,
    loadTools,
    loadEducation,
    apiCall,
    PROFILE_ID
};

// --- MANAGE BUTTON LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Toggle Modal
    const manageBtn = document.getElementById('manage-btn');
    const modal = document.getElementById('manage-modal');
    const closeBtn = document.getElementById('close-modal');

    manageBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        loadManageTab('projects'); // Load projects by default
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});

// 2. Switch Tabs
function switchTab(tabName) {
    // Update active tab style
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load content
    loadManageTab(tabName);
}

// 3. Load Data into Modal (The "Read" for Admin)
async function loadManageTab(tabName) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '<p>Loading...</p>';

    // Example: PROJECTS CRUD
    if (tabName === 'projects') {
        const result = await apiCall('projects_api.php', 'read', { params: `&profile_id=${PROFILE_ID}` });
        
        let html = `
            <button class="btn btn-orange" onclick="showAddForm('project')" style="margin-bottom: 1rem;">+ Add New Project</button>
            <table class="crud-table">
                <thead><tr><th>Title</th><th>Tags</th><th>Actions</th></tr></thead>
                <tbody>
        `;
        
        if (result.success && result.data) {
            result.data.forEach(p => {
                html += `
                    <tr>
                        <td>${p.title}</td>
                        <td>${p.tags}</td>
                        <td>
                            <button class="action-btn btn-delete" onclick="deleteItem('projects', ${p.id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        }
        html += '</tbody></table>';
        modalBody.innerHTML = html;
    }
    
    // Repeat similar blocks for 'skills', 'education', etc.
}

// 4. Delete Functionality
async function deleteItem(type, id) {
    if(!confirm('Are you sure you want to delete this item?')) return;

    // Map tab name to API file
    const apiMap = {
        'projects': 'projects_api.php',
        'skills': 'skills_api.php'
    };

    const result = await apiCall(apiMap[type], 'delete', {
        method: 'POST',
        body: { id: id } // Using body for POST
    });

    if (result.success) {
        alert('Item deleted!');
        loadManageTab(type); // Refresh list
        // Reload main site content to reflect changes
        loadProjects(); 
        loadSkills();
    } else {
        alert('Error: ' + result.message);
    }
}

// 5. Add/Update would require a simple form injection into modalBody
function showAddForm(type) {
    // Simple Prompt-based Add for demonstration (Activity requires Form)
    // Ideally, you inject a <form> HTML string into modalBody here
    // and attach a submit listener to call apiCall(..., 'add', ...)
    alert("You clicked Add! (You need to implement the form HTML here)");
}

/**
 * Renders and handles Add/Edit Forms for the Manage Modal
 */
async function openForm(type, id = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '<p>Loading form...</p>';

    let data = null;
    let action = 'add';
    
    // If ID is provided, we are Editing. Fetch existing data first.
    if (id) {
        action = 'update';
        // Map type to correct API endpoint
        const apiMap = {
            'projects': 'projects_api.php',
            'skills': 'skills_api.php',
            'education': 'education_api.php'
        };
        
        // Fetch the single item data
        const result = await apiCall(apiMap[type], 'read', { params: `&id=${id}` });
        if (result.success && result.data) {
            data = result.data;
        }
    }

    // Generate the Form HTML
    const formHTML = generateFormHTML(type, data, action);
    modalBody.innerHTML = formHTML;

    // Attach Event Listener to the new form
    const form = document.getElementById('crud-form');
    form.addEventListener('submit', (e) => handleFormSubmit(e, type, action, id));
}

/**
 * Generates HTML input fields based on the table type
 */
function generateFormHTML(type, data, action) {
    // Helper to safely get value (empty string if adding)
    const val = (key) => data && data[key] ? data[key] : '';
    
    let fields = '';

    // --- 1. PROJECTS FORM ---
    if (type === 'projects') {
        fields = `
            <div class="form-group">
                <label>Project Title</label>
                <input type="text" name="title" value="${val('title')}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3">${val('description')}</textarea>
            </div>
            <div class="form-group">
                <label>Image Path (e.g., img/project1.png)</label>
                <input type="text" name="image" value="${val('image')}">
            </div>
            <div class="form-group">
                <label>Project Link (URL)</label>
                <input type="text" name="link" value="${val('link')}">
            </div>
            <div class="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" name="tags" value="${val('tags')}" placeholder="UI, Web, App">
            </div>
        `;
    } 
    // --- 2. SKILLS FORM ---
    else if (type === 'skills') {
        const isProg = val('type') === 'programming' ? 'selected' : '';
        const isTool = val('type') === 'tool' ? 'selected' : '';
        
        fields = `
            <div class="form-group">
                <label>Skill Name</label>
                <input type="text" name="name" value="${val('name')}" required>
            </div>
            <div class="form-group">
                <label>Proficiency (0-100)</label>
                <input type="number" name="proficiency" min="0" max="100" value="${val('proficiency')}" required>
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="type">
                    <option value="programming" ${isProg}>Programming Language</option>
                    <option value="tool" ${isTool}>Tool / Software</option>
                </select>
            </div>
            <div class="form-group">
                <label>Icon Path</label>
                <input type="text" name="icon" value="${val('icon')}" placeholder="img/html_icon.png">
            </div>
        `;
    }
    // --- 3. EDUCATION FORM ---
    else if (type === 'education') {
        fields = `
            <div class="form-group">
                <label>Institution / School</label>
                <input type="text" name="institution" value="${val('institution')}" required>
            </div>
            <div class="form-group">
                <label>Degree</label>
                <input type="text" name="degree" value="${val('degree')}">
            </div>
            <div class="form-group">
                <label>Field of Study</label>
                <input type="text" name="field" value="${val('field')}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Year</label>
                    <input type="number" name="start_year" value="${val('start_year')}">
                </div>
                <div class="form-group">
                    <label>End Year (or 'Present')</label>
                    <input type="text" name="end_year" value="${val('end_year')}">
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3">${val('description')}</textarea>
            </div>
        `;
    }

    // Return the complete form wrapper
    return `
        <div class="form-header">
            <h3>${action === 'add' ? 'Add New' : 'Edit'} ${type.slice(0, -1)}</h3>
            <button class="btn-cancel" onclick="loadManageTab('${type}')">Cancel</button>
        </div>
        <form id="crud-form">
            ${fields}
            <button type="submit" class="submit-btn save-btn">Save Changes</button>
        </form>
    `;
}

/**
 * Handles the actual API submission
 */
async function handleFormSubmit(event, type, action, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Convert to JSON object

    // Add necessary IDs
    data.profile_id = PROFILE_ID; 
    if (id) data.id = id;

    // Map type to API file
    const apiMap = {
        'projects': 'projects_api.php',
        'skills': 'skills_api.php',
        'education': 'education_api.php'
    };

    // Send Request
    const result = await apiCall(apiMap[type], action, {
        method: 'POST',
        body: data
    });

    if (result.success) {
        alert('Saved successfully!');
        loadManageTab(type); // Return to table view
        
        // Refresh the main website content behind the modal
        if (type === 'projects') loadProjects();
        if (type === 'skills') loadSkills();
        if (type === 'education') loadEducation();
    } else {
        alert('Error: ' + result.message);
    }
}