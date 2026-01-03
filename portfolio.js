/**
 * Portfolio Application - Frontend JavaScript
 * Connects to PHP API endpoints to load and manage dynamic content
 */

const API_BASE = "api"; // Adjust this path based on your folder structure
const PROFILE_ID = 1; // Default profile ID

// Helper function to make API calls
async function apiCall(endpoint, action = "read", options = {}) {
  try {
    const url = `${API_BASE}/${endpoint}?action=${action}${
      options.params || ""
    }`;
    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
  const result = await apiCall("profile_api.php", "read", {
    params: `&id=${PROFILE_ID}`,
  });

  if (result.success && result.data) {
    const profile = result.data;

    // Update hero section
    document.querySelector(".hero-title .highlight").textContent =
      profile.name.split(" ")[0] + ",";
    document.querySelector(".hero-subtitle").textContent = profile.role;
    // Use hero_bio if available, otherwise fallback to bio
    document.querySelector(".hero-text").textContent =
      profile.hero_bio || profile.bio;

    // Update hero image
    const heroImg = document.querySelector(".photo img");
    if (heroImg && profile.hero_image) {
      heroImg.src = profile.hero_image;
    }

    // Update search bar link
    const searchLink = document.querySelector(".search-input");
    if (searchLink) {
      searchLink.href = profile.linkedin;
      searchLink.textContent = profile.linkedin.replace("https://www.", "");
    }

    // Update about section
    document.querySelector(".about-description").textContent = profile.bio;

    // Update About Me Image
    const aboutImg = document.querySelector(".about-profile-image");
    if (aboutImg && profile.photo) {
      aboutImg.src = profile.photo;
    }

    // Update About Me Name
    const aboutName = document.querySelector(
      ".about-text .section-title .highlight"
    );
    if (aboutName) {
      aboutName.textContent = profile.name + "?";
    }

    // Update stats
    const stats = document.querySelectorAll(".stat-number");
    if (stats.length >= 2) {
      stats[0].textContent = profile.projects_completed + "+";
      stats[1].textContent = profile.years_experience + "+";
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
    linkedin: profile.linkedin,
  };

  document
    .querySelectorAll(".social-link, .footer-social-link")
    .forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.includes("facebook")) link.href = socialLinks.facebook;
      if (href && href.includes("github")) link.href = socialLinks.github;
      if (href && href.includes("linkedin")) link.href = socialLinks.linkedin;
    });
}

// Update contact information
function updateContactInfo(profile) {
  const contactItems = document.querySelectorAll(".contact-item .contact-text");
  if (contactItems.length >= 3) {
    contactItems[0].textContent = profile.phone;
    contactItems[1].textContent = profile.contact_email;
    contactItems[2].textContent = profile.location;
  }
}

// Load Skills
async function loadSkills() {
  const result = await apiCall("skills_api.php", "read", {
    params: `&profile_id=${PROFILE_ID}`,
  });

  if (result.success && result.data) {
    const languagesGrid = document.querySelector(".languages-grid");
    if (!languagesGrid) return;

    languagesGrid.innerHTML = "";

    result.data.forEach((skill) => {
      const skillElement = document.createElement("div");
      skillElement.className = "language";
      skillElement.innerHTML = `
                <div class="language-icon">
                    <img src="${skill.icon || "img/default_icon.png"}" alt="${
        skill.name
      }">
                </div>
                <div class="language-name">${skill.name}</div>
            `;
      languagesGrid.appendChild(skillElement);
    });
  }
}

// Load Projects
async function loadProjects() {
  const result = await apiCall("projects_api.php", "read", {
    params: `&profile_id=${PROFILE_ID}`,
  });

  if (result.success && result.data) {
    const projectsGrid = document.querySelector(".projects-grid");
    if (!projectsGrid) return;

    projectsGrid.innerHTML = "";

    result.data.forEach((project) => {
      const tags = project.tags ? project.tags.split(",") : [];
      const tagsHTML = tags
        .map((tag) => `<span class="project-tag">${tag.trim()}</span>`)
        .join("");

      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${
                      project.image || "img/default_project.png"
                    }" alt="${project.title}">
                </div>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <h3 class="project-title">${project.title}</h3>
            `;

      if (project.link && project.link !== "#") {
        projectCard.style.cursor = "pointer";
        projectCard.addEventListener("click", () => {
          window.open(project.link, "_blank");
        });
      }

      projectsGrid.appendChild(projectCard);
    });
  }
}

// Load Tools
async function loadTools() {
  const result = await apiCall("hobbies_api.php", "read", {
    params: `&profile_id=${PROFILE_ID}`,
  });

  if (result.success && result.data) {
    const toolsGrid = document.querySelector(".tools-grid");
    if (!toolsGrid) return;

    toolsGrid.innerHTML = "";

    result.data.forEach((tool) => {
      const toolElement = document.createElement("div");
      toolElement.className = "tool";
      toolElement.innerHTML = `
                <div class="tool-icon">
                    <div class="tool-icon-inner">
                        <img src="${
                          tool.icon || "img/default_icon.png"
                        }" alt="${tool.name}">
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
  const result = await apiCall("education_api.php", "read", {
    params: `&profile_id=${PROFILE_ID}`,
  });

  if (result.success && result.data) {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;

    // Clear existing timeline items (keep decorations)
    const items = timeline.querySelectorAll(".timeline-item");
    items.forEach((item) => item.remove());

    result.data.forEach((edu, index) => {
      const position = index % 2 === 0 ? "left" : "right";
      const yearDisplay =
        edu.end_year === "Present"
          ? `${edu.start_year} - ${edu.end_year}`
          : edu.end_year;

      const eduElement = document.createElement("div");
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
      const bottomDecoration = timeline.querySelector(
        ".timeline-decoration.bottom"
      );
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
    name: form.querySelector("#name").value,
    email: form.querySelector("#email").value,
    subject: form.querySelector("#subject").value,
    message: form.querySelector("#message").value,
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  const result = await apiCall("contacts_api.php", "submit", {
    method: "POST",
    body: formData,
  });

  const messageDiv = form.querySelector("#form-message");

  if (result.success) {
    messageDiv.textContent = result.message;
    messageDiv.className = "form-message success";
    form.reset();

    setTimeout(() => {
      messageDiv.textContent = "";
      messageDiv.className = "form-message";
    }, 5000);
  } else {
    messageDiv.textContent =
      result.message || "Error sending message. Please try again.";
    messageDiv.className = "form-message error";
  }

  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
}

// Initialize portfolio when DOM is loaded
// Initialize portfolio when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  console.log("Loading portfolio data from API...");

  // Initialize Nav Slider
  setupNavSlider();

  try {
    // Load all dynamic content
    await Promise.all([
      loadProfile(),
      loadSkills(),
      loadProjects(),
      loadTools(),
      loadEducation(),
    ]);

    console.log("Portfolio data loaded successfully");

    // Setup contact form if it exists
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", handleContactSubmit);
    }
  } catch (error) {
    console.error("Error loading portfolio:", error);
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
  PROFILE_ID,
};

// ==========================================
// MANAGE BUTTON LOGIC
// ==========================================

// 1. Global state to remember the active tab
let currentActiveTab = "projects";

document.addEventListener("DOMContentLoaded", () => {
  const manageBtn = document.getElementById("manage-btn");
  const modal = document.getElementById("manage-modal");
  const closeBtn = document.getElementById("close-modal");

  if (manageBtn) {
    manageBtn.addEventListener("click", () => {
      modal.style.display = "flex";
      // Open the last saved tab instead of defaulting to projects
      switchTab(currentActiveTab);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});

// 2. Switch Tabs
function switchTab(tabName) {
  // Save the state
  currentActiveTab = tabName;

  // Update UI: Remove 'active' from all buttons, add to current
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    // Check if the button's onclick attribute contains the current tab name
    if (btn.getAttribute("onclick").includes(tabName)) {
      btn.classList.add("active");
    }
  });

  // Load content
  loadManageTab(tabName);
}

// 3. Load Data into Modal
async function loadManageTab(tabName) {
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = '<div class="loading-spinner">Loading...</div>';

  let html = "";

  // --- PROJECTS TAB ---
  if (tabName === "projects") {
    const result = await apiCall("projects_api.php", "read", {
      params: `&profile_id=${PROFILE_ID}`,
    });

    html = `<div class="tab-actions"><button class="btn btn-orange" onclick="openForm('projects')">+ Add New Project</button></div>
                <div class="table-responsive">
                <table class="crud-table">
                <thead><tr><th>Title</th><th>Tags</th><th>Actions</th></tr></thead><tbody>`;

    if (result.success && result.data) {
      result.data.forEach((p) => {
        html += `<tr>
                    <td><strong>${p.title}</strong></td>
                    <td><span class="tag-badge">${p.tags}</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('projects', ${p.id})">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('projects', ${p.id})">Delete</button>
                    </td>
                </tr>`;
      });
    }
    html += "</tbody></table></div>";
  }

  // --- SKILLS TAB ---
  else if (tabName === "skills") {
    const result = await apiCall("skills_api.php", "read", {
      params: `&profile_id=${PROFILE_ID}`,
    });

    html = `<div class="tab-actions"><button class="btn btn-orange" onclick="openForm('skills')">+ Add New Skill</button></div>
                <div class="table-responsive">
                <table class="crud-table">
                <thead><tr><th>Skill</th><th>Type</th><th>Actions</th></tr></thead><tbody>`;

    if (result.success && result.data) {
      result.data.forEach((s) => {
        html += `<tr>
                    <td><div class="flex-align"><img src="${
                      s.icon || "img/default_icon.png"
                    }" class="mini-icon"> ${s.name}</div></td>
                    <td>${s.type}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('skills', ${
                          s.id
                        })">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('skills', ${
                          s.id
                        })">Delete</button>
                    </td>
                </tr>`;
      });
    }
    html += "</tbody></table></div>";
  }

  // --- HOBBIES TAB ---
  else if (tabName === "hobbies") {
    const result = await apiCall("hobbies_api.php", "read", {
      params: `&profile_id=${PROFILE_ID}`,
    });

    html = `<div class="tab-actions"><button class="btn btn-orange" onclick="openForm('hobbies')">+ Add New Hobby</button></div>
                <div class="table-responsive">
                <table class="crud-table">
                <thead><tr><th>Name</th><th>Category</th><th>Actions</th></tr></thead><tbody>`;

    if (result.success && result.data) {
      result.data.forEach((h) => {
        html += `<tr>
                    <td><div class="flex-align"><img src="${
                      h.icon || "img/default_icon.png"
                    }" class="mini-icon"> ${h.name}</div></td>
                    <td><span class="tag-badge">${h.category}</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('hobbies', ${
                          h.id
                        })">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('hobbies', ${
                          h.id
                        })">Delete</button>
                    </td>
                </tr>`;
      });
    }
    html += "</tbody></table></div>";
  }

  // --- EDUCATION TAB ---
  else if (tabName === "education") {
    const result = await apiCall("education_api.php", "read", {
      params: `&profile_id=${PROFILE_ID}`,
    });

    html = `<div class="tab-actions"><button class="btn btn-orange" onclick="openForm('education')">+ Add Education</button></div>
                <div class="table-responsive">
                <table class="crud-table">
                <thead><tr><th>Institution</th><th>Degree</th><th>Actions</th></tr></thead><tbody>`;

    if (result.success && result.data) {
      result.data.forEach((e) => {
        html += `<tr>
                    <td>${e.institution}</td>
                    <td>${e.degree}<br><small>${e.end_year}</small></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="openForm('education', ${e.id})">Edit</button>
                        <button class="action-btn btn-delete" onclick="deleteItem('education', ${e.id})">Delete</button>
                    </td>
                </tr>`;
      });
    }
    html += "</tbody></table></div>";
  }

  // --- PROFILE TAB (Beautified Design) ---
  else if (tabName === "profile") {
    const result = await apiCall("profile_api.php", "read", {
      params: `&id=${PROFILE_ID}`,
    });

    if (result.success && result.data) {
      const p = result.data;
      html = `
                <div class="profile-view-card">
                    <div class="profile-view-header">
                        <div class="profile-avatar-large">
                            <img src="${
                              p.photo || "img/default_avatar.png"
                            }" alt="Profile">
                        </div>
                        <div class="profile-header-info">
                            <h2>${p.name}</h2>
                            <span class="role-badge">${p.role}</span>
                        </div>
                        <button class="btn btn-orange edit-profile-btn" onclick="openForm('profile', ${
                          p.id
                        })">
                            Edit Profile
                        </button>
                    </div>
                    
                    <div class="profile-grid">
                        <div class="profile-item">
                            <label>Email</label>
                            <p>${p.contact_email}</p>
                        </div>
                        <div class="profile-item">
                            <label>Phone</label>
                            <p>${p.phone}</p>
                        </div>
                        <div class="profile-item">
                            <label>Location</label>
                            <p>${p.location}</p>
                        </div>
                        <div class="profile-item">
                            <label>Experience</label>
                            <p>${p.years_experience} Years</p>
                        </div>
                    </div>

                    <div class="profile-full-width">
                        <label>Main Profile</label>
                        <p class="bio-text">${
                          p.hero_bio || "No hero bio set."
                        }</p>
                    </div>

                    <div class="profile-full-width" style="margin-top: 1rem;">
                        <label>Biography</label>
                        <p class="bio-text">${p.bio}</p>
                    </div>
                </div>
            `;
    } else {
      html = "<p>Profile not found.</p>";
    }
  }

  modalBody.innerHTML = html;
}

// 4. Delete Functionality
async function deleteItem(type, id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  const apiMap = {
    projects: "projects_api.php",
    skills: "skills_api.php",
    hobbies: "hobbies_api.php",
    education: "education_api.php",
  };

  // FIX: Pass ID in URL params as well
  const result = await apiCall(apiMap[type], "delete", {
    params: `&id=${id}`,
    method: "POST",
    body: { id: id },
  });

  if (result.success) {
    // Reload current tab
    loadManageTab(type);

    // Update main site
    if (type === "projects") loadProjects();
    if (type === "skills") loadSkills();
    if (type === "hobbies") loadTools();
    if (type === "education") loadEducation();
  } else {
    alert("Error: " + result.message);
  }
}

// 5. Add/Update Form Logic
function showAddForm(type) {
  // This is a legacy function, we use openForm now
  openForm(type);
}

/**
 * Renders and handles Add/Edit Forms for the Manage Modal
 */
async function openForm(type, id = null) {
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = "<p>Loading form...</p>";

  let data = null;
  let action = "add";

  if (id) {
    action = "update";
    const apiMap = {
      projects: "projects_api.php",
      skills: "skills_api.php",
      hobbies: "hobbies_api.php",
      education: "education_api.php",
      profile: "profile_api.php",
    };

    const result = await apiCall(apiMap[type], "read", { params: `&id=${id}` });
    if (result.success && result.data) {
      data = result.data;
    }
  }

  const formHTML = generateFormHTML(type, data, action);
  modalBody.innerHTML = formHTML;

  const form = document.getElementById("crud-form");
  form.addEventListener("submit", (e) => handleFormSubmit(e, type, action, id));
}

/**
 * Uploads a file to the server
 */
async function uploadFile(input, fieldName) {
  const file = input.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  // Show loading state
  const preview = document.getElementById(`preview-${fieldName}`);
  const originalContent = preview.innerHTML;
  preview.innerHTML = '<div class="loading-spinner">Uploading...</div>';

  try {
    const response = await fetch("api/upload_api.php", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    if (result.success) {
      // Update hidden input
      document.getElementById(`input-${fieldName}`).value = result.path;
      // Update preview
      preview.innerHTML = `<img src="${result.path}" alt="Preview">`;
      showNotification("Image uploaded successfully!");
    } else {
      alert("Upload failed: " + result.message);
      preview.innerHTML = originalContent;
      input.value = ""; // Clear input
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed. See console for details.");
    preview.innerHTML = originalContent;
  }
}

/**
 * Generates HTML input fields based on the table type
 */
function generateFormHTML(type, data, action) {
  const val = (key) => (data && data[key] ? data[key] : "");
  let fields = "";

  const createFileInput = (label, name, value) => `
        <div class="form-group">
            <label>${label}</label>
            <div class="file-upload-container">
                <div class="image-preview" id="preview-${name}">
                    ${
                      value
                        ? `<img src="${value}" alt="Preview">`
                        : '<span style="color:#9ca3af">No image selected</span>'
                    }
                </div>
                <input type="file" id="file-${name}" accept="image/*" onchange="uploadFile(this, '${name}')">
                <input type="hidden" name="${name}" id="input-${name}" value="${value}">
                <label for="file-${name}" class="upload-btn">Choose Image</label>
            </div>
        </div>
    `;

  // --- PROJECTS ---
  if (type === "projects") {
    fields = `
        <div class="form-group"><label>Title</label><input type="text" name="title" value="${val(
          "title"
        )}" required></div>
        <div class="form-group"><label>Description</label><textarea name="description" rows="3">${val(
          "description"
        )}</textarea></div>
        ${createFileInput("Project Image", "image", val("image"))}
        <div class="form-group"><label>Link</label><input type="text" name="link" value="${val(
          "link"
        )}"></div>
        <div class="form-group"><label>Tags</label><input type="text" name="tags" value="${val(
          "tags"
        )}"></div>
    `;
  }
  // --- SKILLS ---
  else if (type === "skills") {
    const isProg = val("type") === "programming" ? "selected" : "";
    const isTool = val("type") === "tool" ? "selected" : "";
    fields = `
        <div class="form-group"><label>Name</label><input type="text" name="name" value="${val(
          "name"
        )}" required></div>
        <div class="form-group"><label>Type</label><select name="type"><option value="programming" ${isProg}>Programming</option><option value="tool" ${isTool}>Tool</option></select></div>
        ${createFileInput("Skill Icon", "icon", val("icon"))}
    `;
  }
  // --- HOBBIES ---
  else if (type === "hobbies") {
    fields = `
        <div class="form-group"><label>Name</label><input type="text" name="name" value="${val(
          "name"
        )}" required></div>
        <div class="form-group"><label>Description</label><textarea name="description" rows="2">${val(
          "description"
        )}</textarea></div>
        ${createFileInput("Hobby Icon", "icon", val("icon"))}
    `;
  }
  // --- EDUCATION ---
  else if (type === "education") {
    fields = `
        <div class="form-group"><label>Institution</label><input type="text" name="institution" value="${val(
          "institution"
        )}" required></div>
        <div class="form-group"><label>Degree</label><input type="text" name="degree" value="${val(
          "degree"
        )}"></div>
        <div class="form-group"><label>Field</label><input type="text" name="field" value="${val(
          "field"
        )}"></div>
        <div class="form-row">
            <div class="form-group"><label>Start Year</label><input type="number" name="start_year" value="${val(
              "start_year"
            )}"></div>
            <div class="form-group"><label>End Year</label><input type="text" name="end_year" value="${val(
              "end_year"
            )}"></div>
        </div>
        <div class="form-group"><label>Description</label><textarea name="description">${val(
          "description"
        )}</textarea></div>
    `;
  }
  // --- PROFILE ---
  else if (type === "profile") {
    fields = `
        <div class="form-group"><label>Name</label><input type="text" name="name" value="${val(
          "name"
        )}" required></div>
        <div class="form-group"><label>Role</label><input type="text" name="role" value="${val(
          "role"
        )}"></div>
        
        <div class="form-group"><label>Main Profile Bio</label><textarea name="hero_bio" rows="3">${val(
          "hero_bio"
        )}</textarea></div>
        ${createFileInput(
          "Main Profile Image",
          "hero_image",
          val("hero_image")
        )}
        
        <div class="form-group"><label>About me Biography</label><textarea name="bio" rows="5">${val(
          "bio"
        )}</textarea></div>

        <div class="form-row">
            <div class="form-group"><label>Email</label><input type="email" name="contact_email" value="${val(
              "contact_email"
            )}"></div>
            <div class="form-group"><label>Phone</label><input type="text" name="phone" value="${val(
              "phone"
            )}"></div>
        </div>
        
        <div class="form-group"><label>Location</label><input type="text" name="location" value="${val(
          "location"
        )}"></div>
        
        <div class="form-row">
            <div class="form-group"><label>Experience (Years)</label><input type="number" name="years_experience" value="${val(
              "years_experience"
            )}"></div>
            <div class="form-group"><label>Projects Completed</label><input type="number" name="projects_completed" value="${val(
              "projects_completed"
            )}"></div>
        </div>

        <div class="form-group"><label>Social Links</label></div>
        <div class="form-row">
            <div class="form-group"><label>Facebook</label><input type="text" name="facebook" value="${val(
              "facebook"
            )}"></div>
            <div class="form-group"><label>GitHub</label><input type="text" name="github" value="${val(
              "github"
            )}"></div>
        </div>
        <div class="form-group"><label>LinkedIn</label><input type="text" name="linkedin" value="${val(
          "linkedin"
        )}"></div>

        ${createFileInput("About Me Photo", "photo", val("photo"))}
    `;
  }

  return `
    <div class="form-header">
        <h3>${action === "add" ? "Add" : "Edit"} ${type}</h3>
        <button class="btn-cancel" type="button" onclick="switchTab('${type}')">Cancel</button>
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

  // FIX: Add ID to URL params for Updates
  let params = "";
  if (id) {
    data.id = id;
    params = `&id=${id}`; // This fixes the "ID is required" error
  }

  const apiMap = {
    projects: "projects_api.php",
    skills: "skills_api.php",
    hobbies: "hobbies_api.php",
    education: "education_api.php",
    profile: "profile_api.php",
  };

  const result = await apiCall(apiMap[type], action, {
    params: params, // Pass the ID in URL
    method: "POST",
    body: data,
  });

  if (result.success) {
    // Show creative notification instead of alert
    showNotification("Saved Successfully!");

    switchTab(type); // Return to the list view using global state

    // Reload main site content
    if (type === "projects") loadProjects();
    if (type === "skills") loadSkills();
    if (type === "hobbies") loadTools();
    if (type === "education") loadEducation();
    if (type === "profile") loadProfile();
  } else {
    alert("Error: " + result.message);
  }
}

/**
 * Displays a creative success notification overlay
 */
function showNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector(".success-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "success-overlay";

  overlay.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <span>✓</span>
            </div>
            <p class="success-text">${message}</p>
        </div>
    `;

  document.body.appendChild(overlay);

  // Remove after 2 seconds with fade out
  setTimeout(() => {
    overlay.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }, 750);
}

/**
 * Setup Navigation Slider & Smooth Scroll
 */
function setupNavSlider() {
  // Scoped specifically to header navigation
  const nav = document.querySelector(".header .nav");
  const slider = document.querySelector(".header .nav-slider");
  const links = document.querySelectorAll(".header .nav .nav-link");
  const contactBtn = document.querySelector(".contact-btn");

  // State to prevent ScrollSpy from interfering with Click Scroll
  let isManualScrolling = false;

  if (!nav || !slider) return;

  function moveSlider(link) {
    if (!link) {
      slider.style.width = "0";
      return;
    }

    // Remove active class from all header links
    links.forEach((l) => l.classList.remove("active"));
    // Add to current
    link.classList.add("active");

    // Calculate position
    const rect = link.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    // Apply styles with transition
    slider.style.width = `${rect.width}px`;
    slider.style.transform = `translateX(${rect.left - navRect.left}px)`;
  }

  // Custom Smooth Scroll Function (Forces Animation)
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Lock scroll spy updates
    isManualScrolling = true;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // Unlock after animation finishes
        setTimeout(() => {
          isManualScrolling = false;
        }, 100);
      }
    }

    // Quadratic Ease In Out
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Helper to trigger smooth scroll
  function triggerScroll(targetId) {
    let offsetPosition = 0;
    if (targetId !== "#top") {
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = 100;
        const elementPosition = targetSection.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      }
    }
    smoothScrollTo(offsetPosition, 500);
  }

  // Click event for Smooth Scroll & Slider (Nav Links)
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      moveSlider(link);
      triggerScroll(targetId);
    });
  });

  // Click event for Contact Button (Special Case)
  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = contactBtn.getAttribute("href");

      // Hide slider
      moveSlider(null);
      // Remove active from any links
      links.forEach((l) => l.classList.remove("active"));

      triggerScroll(targetId);
    });
  }

  // Click event for Logo (Home) - Add Smooth Scroll
  const logoLink = document.querySelector(".logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Hide slider
      moveSlider(null);
      // Remove active from any links
      links.forEach((l) => l.classList.remove("active"));

      triggerScroll("#top");
    });
  }

  // Scroll Spy (IntersectionObserver)
  const sections = [
    "hero",
    "about",
    "tools",
    "projects",
    "skills",
    "education",
    "contact", // Added contact
  ];
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "-100px 0px 0px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    if (isManualScrolling) return;

    // Force hide if at top (overrides intersection logic)
    if (window.scrollY < 100) {
      moveSlider(null);
      links.forEach((l) => l.classList.remove("active"));
      return;
    }

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        if (id === "hero" || id === "contact") {
          // Hide slider when at top or contact
          moveSlider(null);
          links.forEach((l) => l.classList.remove("active"));
        } else {
          const activeLink = document.querySelector(
            `.header .nav .nav-link[href="#${id}"]`
          );
          if (activeLink) moveSlider(activeLink);
        }
      }
    });
  }, observerOptions);

  sections.forEach((id) => {
    const sect = document.getElementById(id);
    if (sect) observer.observe(sect);
  });

  // Initial check to ensure slider is hidden at the top
  if (window.scrollY < 50) {
    moveSlider(null);
    links.forEach((l) => l.classList.remove("active"));
  }
}
