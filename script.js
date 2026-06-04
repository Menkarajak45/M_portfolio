// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const resumeInput = document.getElementById('resumeUpload');
const downloadSelectedResume = document.getElementById('downloadSelectedResume');
const resumeStatus = document.getElementById('resumeUploadStatus');
const clearResumeBtn = document.getElementById('clearResumeBtn');
const resumeFileCard = document.getElementById('resumeFileCard');
const resumeFileName = document.getElementById('resumeFileName');

const RESUME_STORAGE_KEY = 'portfolioResume';

function setResumeMessage(message, type = 'info') {
  if (!resumeStatus) return;
  resumeStatus.textContent = message;
  resumeStatus.classList.remove('success', 'error');
  if (type === 'success') resumeStatus.classList.add('success');
  if (type === 'error') resumeStatus.classList.add('error');
}

function loadStoredResume() {
  try {
    return JSON.parse(localStorage.getItem(RESUME_STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveStoredResume(resume) {
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
    return true;
  } catch (error) {
    setResumeMessage('This file is too large to save in your browser storage.', 'error');
    return false;
  }
}

function dataURLToBlob(dataURL) {
  const [header, body] = dataURL.split(',');
  const mime = header.match(/data:(.*?);/)?.[1] || 'application/octet-stream';
  const binary = atob(body);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}

function updateResumeUI(resume) {
  if (!resumeInput || !downloadSelectedResume || !resumeStatus) return;

  if (resume && resume.name && resume.data) {
    downloadSelectedResume.disabled = false;
    if (resumeFileCard) resumeFileCard.hidden = false;
    if (resumeFileName) resumeFileName.textContent = resume.name;
    return;
  }

  downloadSelectedResume.disabled = true;
  if (resumeFileCard) resumeFileCard.hidden = true;
  if (resumeFileName) resumeFileName.textContent = 'No resume uploaded yet';
}

function downloadStoredResume(resume) {
  if (!resume || !resume.data) return;

  try {
    const blob = dataURLToBlob(resume.data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resume.name || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return;
  } catch (error) {
    // Fallback for browsers that block blob downloads from file:// pages.
  }

  const fallbackLink = document.createElement('a');
  fallbackLink.href = resume.data;
  fallbackLink.download = resume.name || 'resume.pdf';
  document.body.appendChild(fallbackLink);
  fallbackLink.click();
  fallbackLink.remove();
}

if (resumeInput && downloadSelectedResume && resumeStatus) {
  let selectedResume = loadStoredResume();

  updateResumeUI(selectedResume);

  if (selectedResume) {
    setResumeMessage(`Stored resume ready: ${selectedResume.name}`, 'success');
  } else {
    setResumeMessage('Choose a PDF file to enable download and storage.', 'info');
  }

  resumeInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setResumeMessage('Only PDF files are allowed for the resume.', 'error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resumeData = {
        name: file.name,
        type: file.type || 'application/pdf',
        data: reader.result
      };

      const saved = saveStoredResume(resumeData);
      if (!saved) return;

      selectedResume = resumeData;
      updateResumeUI(selectedResume);
      setResumeMessage(`Resume uploaded successfully: ${file.name}`, 'success');
    };

    reader.onerror = () => {
      setResumeMessage('Unable to read the selected file. Please try again.', 'error');
    };

    reader.readAsDataURL(file);
  });

  downloadSelectedResume.addEventListener('click', () => {
    if (!selectedResume || !selectedResume.data) {
      setResumeMessage('Upload a PDF first to enable the download button.', 'error');
      return;
    }

    downloadStoredResume(selectedResume);
    setResumeMessage(`Downloading: ${selectedResume.name}`, 'success');
  });

  if (clearResumeBtn) {
    clearResumeBtn.addEventListener('click', () => {
      const confirmed = window.confirm('Remove the uploaded resume from your portfolio?');
      if (!confirmed) return;

      localStorage.removeItem(RESUME_STORAGE_KEY);
      selectedResume = null;
      updateResumeUI(null);
      resumeInput.value = '';
      setResumeMessage('Resume deleted successfully.', 'success');
    });
  }
}

const projectForm = document.getElementById('projectForm');
const projectList = document.getElementById('projectList');
const projectStatus = document.getElementById('projectStatus');

const PROJECT_STORAGE_KEY = 'portfolioProjects';

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECT_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
  const projects = loadProjects();

  if (!projects.length) {
    projectList.innerHTML = '<article class="project-card"><h4>No projects added yet</h4><p>Use the form above to upload your first project screenshot and details.</p></article>';
    return;
  }

  projectList.innerHTML = projects
    .slice()
    .reverse()
    .map((project) => `
      <article class="project-card">
        <button class="delete-project-btn" data-id="${project.id}" type="button" aria-label="Delete ${project.title}">×</button>
        <img src="${project.image}" alt="${project.title}" />
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="project-meta">${project.tech}</div>
        <a href="${project.link}" target="_blank" rel="noreferrer">View Project →</a>
      </article>
    `)
    .join('');

  projectList.querySelectorAll('.delete-project-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const updatedProjects = loadProjects().filter((project) => project.id !== id);
      saveProjects(updatedProjects);
      renderProjects();
      if (projectStatus) projectStatus.textContent = 'Project deleted.';
    });
  });
}

if (projectForm && projectList) {
  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('projectTitle').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const tech = document.getElementById('projectTech').value.trim();
    const link = document.getElementById('projectLink').value.trim();
    const imageFile = document.getElementById('projectImage').files[0];

    if (!title || !description || !tech || !link || !imageFile) {
      if (projectStatus) projectStatus.textContent = 'Please fill in all fields and choose an image.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newProject = {
        id: Date.now(),
        title,
        description,
        tech,
        link,
        image: reader.result
      };

      const projects = loadProjects();
      projects.push(newProject);
      saveProjects(projects);
      renderProjects();
      projectForm.reset();
      if (projectStatus) projectStatus.textContent = 'Project added successfully!';
    };

    reader.readAsDataURL(imageFile);
  });

  renderProjects();
}

// Animate skill bars on scroll
const skillFills = document.querySelectorAll('.skill-fill');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.width = el.dataset.width;
      observer.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => observer.observe(fill));

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach((element) => revealObserver.observe(element));
