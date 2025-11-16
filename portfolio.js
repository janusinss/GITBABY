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