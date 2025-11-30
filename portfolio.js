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

// 3. Load Data into Modal
async function loadManageTab(tabName) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '<p>Loading...</p>';

    let html = '';

    // --- PROJECTS TAB ---
    if (tabName === 'projects') {
        const result = await apiCall('projects_api.php', 'read', { params: `&profile_id=${PROFILE_ID}` });
        
        html = `<button class="btn btn-orange" onclick="openForm('projects')" style="margin-bottom: 1rem;">+ Add New Project</button>
                <table class="crud-table">
                <thead><tr><th>Title</th><th>Tags</th><th>Actions</th></tr></thead><tbody>`;

        if (result.success && result.data) {
            result.data.forEach(p => {
                html += `<tr>
                    <td>${p.title}</td>
                    <td>${p.tags}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('projects', ${p.id})">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('projects', ${p.id})">Delete</button>
                    </td>
                </tr>`;
            });
        }
        html += '</tbody></table>';
    } 
    
    // --- SKILLS TAB ---
    else if (tabName === 'skills') {
        const result = await apiCall('skills_api.php', 'read', { params: `&profile_id=${PROFILE_ID}` });

        html = `<button class="btn btn-orange" onclick="openForm('skills')" style="margin-bottom: 1rem;">+ Add New Skill</button>
                <table class="crud-table">
                <thead><tr><th>Skill</th><th>%</th><th>Type</th><th>Actions</th></tr></thead><tbody>`;

        if (result.success && result.data) {
            result.data.forEach(s => {
                html += `<tr>
                    <td>${s.name}</td>
                    <td>${s.proficiency}%</td>
                    <td>${s.type}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('skills', ${s.id})">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('skills', ${s.id})">Delete</button>
                    </td>
                </tr>`;
            });
        }
        html += '</tbody></table>';
    }

    // --- EDUCATION TAB ---
    else if (tabName === 'education') {
        const result = await apiCall('education_api.php', 'read', { params: `&profile_id=${PROFILE_ID}` });

        html = `<button class="btn btn-orange" onclick="openForm('education')" style="margin-bottom: 1rem;">+ Add Education</button>
                <table class="crud-table">
                <thead><tr><th>Institution</th><th>Degree</th><th>Year</th><th>Actions</th></tr></thead><tbody>`;

        if (result.success && result.data) {
            result.data.forEach(e => {
                html += `<tr>
                    <td>${e.institution}</td>
                    <td>${e.degree}</td>
                    <td>${e.end_year}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('education', ${e.id})">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('education', ${e.id})">Delete</button>
                    </td>
                </tr>`;
            });
        }
        html += '</tbody></table>';
    }

    // --- PROFILE TAB ---
    else if (tabName === 'profile') {
        const result = await apiCall('profile_api.php', 'read', { params: `&id=${PROFILE_ID}` });

        if (result.success && result.data) {
            const p = result.data;
            html = `
                <div style="margin-bottom: 20px;">
                    <h3>${p.name}</h3>
                    <p><strong>Role:</strong> ${p.role}</p>
                    <p><strong>Bio:</strong> ${p.bio}</p>
                    <p><strong>Email:</strong> ${p.contact_email}</p>
                    <p><strong>Phone:</strong> ${p.phone}</p>
                </div>
                <button class="btn btn-orange" onclick="openForm('profile', ${p.id})">Edit Profile Information</button>
            `;
        } else {
            html = '<p>Profile not found.</p>';
        }
    }

    modalBody.innerHTML = html;
}

// 4. Delete Functionality
async function deleteItem(type, id) {
    if(!confirm('Are you sure you want to delete this item?')) return;

    // UPDATED API MAP
    const apiMap = {
        'projects': 'projects_api.php',
        'skills': 'skills_api.php',
        'education': 'education_api.php' // Added education
    };

    const result = await apiCall(apiMap[type], 'delete', {
        method: 'POST',
        body: { id: id }
    });

    if (result.success) {
        alert('Item deleted!');
        loadManageTab(type);
        
        if (type === 'projects') loadProjects(); 
        if (type === 'skills') loadSkills();
        if (type === 'education') loadEducation();
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
    
    if (id) {
        action = 'update';
        // UPDATED API MAP
        const apiMap = {
            'projects': 'projects_api.php',
            'skills': 'skills_api.php',
            'education': 'education_api.php',
            'profile': 'profile_api.php'
        };
        
        // Note: Profile API uses 'id', others use 'profile_id' generally, 
        // but 'read' with specific ID works for all based on your PHP code.
        const result = await apiCall(apiMap[type], 'read', { params: `&id=${id}` });
        if (result.success && result.data) {
            data = result.data;
        }
    }

    const formHTML = generateFormHTML(type, data, action);
    modalBody.innerHTML = formHTML;

    const form = document.getElementById('crud-form');
    form.addEventListener('submit', (e) => handleFormSubmit(e, type, action, id));
}

/**
 * Generates HTML input fields based on the table type
 */
function generateFormHTML(type, data, action) {
    const val = (key) => data && data[key] ? data[key] : '';
    let fields = '';

    // --- PROJECTS ---
    if (type === 'projects') {
        fields = `
            <div class="form-group"><label>Title</label><input type="text" name="title" value="${val('title')}" required></div>
            <div class="form-group"><label>Description</label><textarea name="description" rows="3">${val('description')}</textarea></div>
            <div class="form-group"><label>Image Path</label><input type="text" name="image" value="${val('image')}"></div>
            <div class="form-group"><label>Link</label><input type="text" name="link" value="${val('link')}"></div>
            <div class="form-group"><label>Tags</label><input type="text" name="tags" value="${val('tags')}"></div>
        `;
    } 
    // --- SKILLS ---
    else if (type === 'skills') {
        const isProg = val('type') === 'programming' ? 'selected' : '';
        const isTool = val('type') === 'tool' ? 'selected' : '';
        fields = `
            <div class="form-group"><label>Name</label><input type="text" name="name" value="${val('name')}" required></div>
            <div class="form-group"><label>Proficiency (0-100)</label><input type="number" name="proficiency" value="${val('proficiency')}" required></div>
            <div class="form-group"><label>Type</label><select name="type"><option value="programming" ${isProg}>Programming</option><option value="tool" ${isTool}>Tool</option></select></div>
            <div class="form-group"><label>Icon Path</label><input type="text" name="icon" value="${val('icon')}"></div>
        `;
    }
    // --- EDUCATION ---
    else if (type === 'education') {
        fields = `
            <div class="form-group"><label>Institution</label><input type="text" name="institution" value="${val('institution')}" required></div>
            <div class="form-group"><label>Degree</label><input type="text" name="degree" value="${val('degree')}"></div>
            <div class="form-group"><label>Field</label><input type="text" name="field" value="${val('field')}"></div>
            <div class="form-row">
                <div class="form-group"><label>Start Year</label><input type="number" name="start_year" value="${val('start_year')}"></div>
                <div class="form-group"><label>End Year</label><input type="text" name="end_year" value="${val('end_year')}"></div>
            </div>
            <div class="form-group"><label>Description</label><textarea name="description">${val('description')}</textarea></div>
        `;
    }
    // --- PROFILE (New Added Block) ---
    else if (type === 'profile') {
        fields = `
            <div class="form-group"><label>Name</label><input type="text" name="name" value="${val('name')}" required></div>
            <div class="form-group"><label>Role</label><input type="text" name="role" value="${val('role')}"></div>
            <div class="form-group"><label>Bio</label><textarea name="bio" rows="4">${val('bio')}</textarea></div>
            <div class="form-row">
                <div class="form-group"><label>Email</label><input type="email" name="contact_email" value="${val('contact_email')}"></div>
                <div class="form-group"><label>Phone</label><input type="text" name="phone" value="${val('phone')}"></div>
            </div>
            <div class="form-group"><label>Location</label><input type="text" name="location" value="${val('location')}"></div>
            <div class="form-group"><label>Experience (Years)</label><input type="number" name="years_experience" value="${val('years_experience')}"></div>
            <div class="form-group"><label>Projects Completed</label><input type="number" name="projects_completed" value="${val('projects_completed')}"></div>
        `;
    }

    return `
        <div class="form-header">
            <h3>${action === 'add' ? 'Add' : 'Edit'} ${type}</h3>
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
    const data = Object.fromEntries(formData.entries());

    data.profile_id = PROFILE_ID; 
    if (id) data.id = id;

    // UPDATED API MAP
    const apiMap = {
        'projects': 'projects_api.php',
        'skills': 'skills_api.php',
        'education': 'education_api.php',
        'profile': 'profile_api.php' // Added profile
    };

    const result = await apiCall(apiMap[type], action, {
        method: 'POST',
        body: data
    });

    if (result.success) {
        alert('Saved successfully!');
        loadManageTab(type); 
        
        // Reload main site content
        if (type === 'projects') loadProjects();
        if (type === 'skills') loadSkills();
        if (type === 'education') loadEducation();
        if (type === 'profile') loadProfile(); // Added loadProfile
    } else {
        alert('Error: ' + result.message);
    }
}