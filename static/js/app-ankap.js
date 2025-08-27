// Czech Election Calculator 2025 - Ankap Style JavaScript
// Industrial minimalist interaction with theme switching

// State management
let currentQuestion = 0;
let questions = [];
let answers = {};
let parties = [];

// Theme management
let currentTheme = 'dark';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    await loadParties();
    showSection('welcome');
    initializeMobileMenu();
    initializeKeyboardNavigation();
    initializeThemeToggle();
    initializeSmoothScroll();
    initializeActiveNavigation();
});

// Load questions from API
async function loadQuestions() {
    try {
        const response = await fetch('/.netlify/functions/api-questions');
        questions = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Nepodařilo se načíst otázky. Zkuste to prosím znovu.');
    }
}

// Load parties from API
async function loadParties() {
    try {
        const response = await fetch('/.netlify/functions/api-parties');
        parties = await response.json();
    } catch (error) {
        console.error('Error loading parties:', error);
    }
}

// Navigation with smooth transitions
function showSection(sectionId) {
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Fade out current section
    const currentSection = document.querySelector('.section.active');
    if (currentSection) {
        currentSection.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            currentSection.classList.remove('active');
            currentSection.style.animation = '';
            
            // Fade in new section
            const newSection = document.getElementById(sectionId);
            if (newSection) {
                newSection.classList.add('active');
                newSection.style.animation = 'fadeIn 0.5s ease';
            }
        }, 300);
    } else {
        const newSection = document.getElementById(sectionId);
        if (newSection) {
            newSection.classList.add('active');
        }
    }
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Update URL hash
    window.location.hash = sectionId;
}

// Start calculator
function startCalculator() {
    currentQuestion = 0;
    answers = {};
    showSection('calculator');
    displayQuestion();
}

// Display current question with smooth transition
function displayQuestion() {
    if (currentQuestion >= questions.length) {
        calculateResults();
        return;
    }
    
    const question = questions[currentQuestion];
    
    // Update progress with animation - show progress based on completed questions
    const completedQuestions = Object.keys(answers).length;
    const progress = (completedQuestions / questions.length) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressPercentage = document.getElementById('progressPercentage');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Otázka ${currentQuestion + 1} z ${questions.length}`;
    progressPercentage.textContent = `${Math.round(progress)}%`;
    
    // Update progress bar aria attributes
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', currentQuestion + 1);
    }
    
    // Fade transition for question
    const questionCard = document.querySelector('.question-card');
    questionCard.style.animation = 'slideInUp 0.4s ease';
    
    // Update question content
    document.getElementById('questionCategory').textContent = question.category;
    document.getElementById('questionText').textContent = question.text;
    
    // Clear previous selection
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Check if question was already answered
    if (answers[question.id]) {
        const answer = answers[question.id];
        if (answer.value !== null) {
            const selectedBtn = document.querySelectorAll('.answer-btn')[answer.value - 1];
            selectedBtn.classList.add('selected');
            selectedBtn.setAttribute('aria-pressed', 'true');
            document.getElementById('importantCheckbox').checked = answer.important;
            document.getElementById('nextBtn').disabled = false;
        }
    } else {
        document.getElementById('importantCheckbox').checked = false;
        document.getElementById('nextBtn').disabled = true;
    }
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
}

// Select answer with visual feedback
function selectAnswer(position) {
    const question = questions[currentQuestion];
    
    // Update UI with smooth transition
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
        if (index === position - 1) {
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    // Save answer
    const isImportant = document.getElementById('importantCheckbox').checked;
    answers[question.id] = {
        value: position,
        important: isImportant
    };
    
    // Enable next button
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = false;
}

// Skip question with animation
function skipQuestion() {
    const question = questions[currentQuestion];
    answers[question.id] = {
        value: null,
        important: false
    };
    
    // Add skip animation
    const questionCard = document.querySelector('.question-card');
    questionCard.style.animation = 'slideOutLeft 0.3s ease';
    
    setTimeout(() => {
        nextQuestion();
    }, 300);
}

// Next question
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        calculateResults();
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

// Calculate results with loading animation
async function calculateResults() {
    // Hide question container with fade
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(async () => {
        questionContainer.style.display = 'none';
        
        // Show loading with spinner
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = `
            <div class="loading-container" style="text-align: center; padding: 3rem;">
                <div class="spinner"></div>
                <h2>Počítám výsledky...</h2>
                <p>Analyzuji vaše odpovědi pomocí hybridního algoritmu</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        resultsContainer.style.animation = 'fadeIn 0.3s ease';
        
        try {
            // Debug: Log what we're sending
            console.log('Sending answers to API:', answers);
            
            // Send answers to API
            const response = await fetch('/.netlify/functions/api-calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answers)
            });
            
            const data = await response.json();
            
            // Debug: Log what we received
            console.log('Received from API:', data);
            console.log('User compass position:', data.user_compass);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Add slight delay for better UX
            setTimeout(() => {
                displayResults(data.results, data.user_compass, data.compass_description);
            }, 1000);
            
        } catch (error) {
            console.error('Error calculating results:', error);
            resultsContainer.innerHTML = `
                <div class="error-container" style="text-align: center; padding: 3rem;">
                    <h2 style="color: var(--color-error);">Chyba při výpočtu</h2>
                    <p>${error.message}</p>
                    <button class="btn btn-primary" onclick="resetCalculator()">Zkusit znovu</button>
                </div>
            `;
        }
    }, 300);
}

// Display results with animations
function displayResults(results, userCompass, compassDescription) {
    // Sort by match percentage
    results.sort((a, b) => b.match - a.match);
    
    // Save user position to localStorage for compass visualization
    if (userCompass) {
        localStorage.setItem('userCompassPosition', JSON.stringify(userCompass));
        localStorage.setItem('userCompassDescription', compassDescription || '');
    }
    
    // Create HTML for results with staggered animations
    const resultsHTML = `
        <div class="results-header">
            <h2>Vaše výsledky</h2>
            <p class="lead">Shoda s politickými stranami na základě vašich odpovědí</p>
            ${userCompass ? `
                <div class="compass-position-info" style="background: rgba(255,217,61,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--color-primary);">Vaše politická pozice</h4>
                    <p style="margin: 0; font-size: 0.9em;">${compassDescription || 'Pozice vypočítana z vašich odpovědí'}</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.8em; color: var(--color-text-muted);">
                        EKO: ${userCompass.EKO?.toFixed(2) || '0.00'} | SOC: ${userCompass.SOC?.toFixed(2) || '0.00'} | SUV: ${userCompass.SUV?.toFixed(2) || '0.00'}
                    </p>
                </div>
            ` : ''}
        </div>
        
        <div class="results-list">
            ${results.slice(0, 10).map((result, index) => `
                <div class="result-item" style="animation-delay: ${index * 100}ms">
                    <div class="result-rank ${index < 3 ? 'top-three' : ''}">${index + 1}</div>
                    <div class="result-content">
                        <div class="result-party">${result.party}</div>
                        <div class="result-match-container">
                            <div class="result-bar">
                                <div class="result-bar-fill" style="width: 0%; transition-delay: ${500 + index * 100}ms" data-width="${result.match}"></div>
                            </div>
                            <span class="result-percentage">${result.match}%</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <details class="all-results" style="margin-top: 2rem;">
            <summary style="cursor: pointer; padding: 1rem; background: rgba(255,217,61,0.1); border-radius: 4px; margin-bottom: 1rem;">
                Zobrazit všechny strany (${results.length})
            </summary>
            <div class="remaining-results">
                ${results.slice(10).map((result, index) => `
                    <div class="result-item compact" style="padding: 0.5rem 1rem; font-size: 14px;">
                        <span class="result-rank" style="width: 30px; height: 30px; font-size: 12px;">${index + 11}</span>
                        <span class="result-party" style="flex: 1;">${result.party}</span>
                        <span class="result-percentage">${result.match}%</span>
                    </div>
                `).join('')}
            </div>
        </details>
        
        <div class="results-info" style="margin-top: 2rem; text-align: center; color: var(--color-text-muted);">
            <h3>Metodologie</h3>
            <p>3D politický kompas: Euklidovská vzdálenost v prostoru EKO × SOC × SUV</p>
            <p class="disclaimer" style="font-size: 0.9em; margin-top: 1rem;">
                Výsledky jsou orientační a vycházejí z programových priorit stran.
            </p>
        </div>
        
        <div class="results-actions" style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap;">
            <a href="/compass" class="btn btn-primary" style="text-decoration: none; display: inline-block;">
                📍 Zobrazit na kompasu
            </a>
            <button class="btn btn-secondary" onclick="resetCalculator()">
                Spustit znovu
            </button>
            <button class="btn btn-secondary" onclick="shareResults()">
                Sdílet výsledky
            </button>
        </div>
    `;
    
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = resultsHTML;
    
    // Trigger progress bar animations
    setTimeout(() => {
        document.querySelectorAll('.result-bar-fill').forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = `${width}%`;
        });
    }, 100);
}

// Reset calculator
function resetCalculator() {
    currentQuestion = 0;
    answers = {};
    
    const questionContainer = document.getElementById('questionContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    
    resultsContainer.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
        resultsContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        questionContainer.style.animation = 'fadeIn 0.3s ease';
        displayQuestion();
    }, 300);
}

// Share results
function shareResults() {
    const resultsText = Array.from(document.querySelectorAll('.results-list .result-item'))
        .slice(0, 5)
        .map((item, index) => {
            const party = item.querySelector('.result-party').textContent;
            const match = item.querySelector('.result-percentage').textContent;
            return `${index + 1}. ${party}: ${match}`;
        })
        .join('\n');
    
    const text = `Moje výsledky z Volební kalkulačky 2025:\n\n${resultsText}\n\nVyzkoušejte si ji také na volby.kdobystavelsilnice.cz`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Výsledky zkopírovány do schránky!');
        });
    } else {
        alert('Nepodařilo se zkopírovat výsledky.');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Show error
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize mobile menu
function initializeMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const nav = document.querySelector('.nav');
    
    if (menuButton && nav) {
        menuButton.addEventListener('click', () => {
            const isOpen = nav.classList.contains('mobile-menu-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !nav.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

// Open mobile menu
function openMobileMenu() {
    const nav = document.querySelector('.nav');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    nav.classList.add('mobile-menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
}

// Close mobile menu
function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    nav.classList.remove('mobile-menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
}

// Initialize theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
}

// Set theme
function setTheme(theme) {
    currentTheme = theme;
    document.body.className = `theme-${theme}`;
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', 
            theme === 'dark' ? 'Přepnout na světlé téma' : 'Přepnout na tmavé téma'
        );
    }
}

// Initialize smooth scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active navigation
                updateActiveNavigation(targetId);
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Initialize active navigation tracking
function initializeActiveNavigation() {
    // Check current hash on load
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        updateActiveNavigation(sectionId);
    }
    
    // Track scroll position to update active section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavigation(sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const sectionId = window.location.hash.substring(1);
        if (sectionId) {
            updateActiveNavigation(sectionId);
        }
    });
}

// Update active navigation state
function updateActiveNavigation(sectionId) {
    // Remove all active classes
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to matching link
    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Special case for calculator - mark it active
    if (sectionId === 'kalkulacka' || sectionId === 'calculator' || sectionId === 'welcome') {
        const calcLink = document.querySelector('.nav-link[href="#kalkulacka"]');
        if (calcLink) {
            calcLink.classList.add('active');
        }
    }
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Only in calculator section
        if (!document.getElementById('calculator').classList.contains('active')) return;
        
        // Number keys 1-5 for answers
        if (e.key >= '1' && e.key <= '5') {
            selectAnswer(parseInt(e.key));
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' && !document.getElementById('prevBtn').disabled) {
            previousQuestion();
        }
        if (e.key === 'ArrowRight' && !document.getElementById('nextBtn').disabled) {
            nextQuestion();
        }
        
        // Space for skip
        if (e.key === ' ' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            skipQuestion();
        }
    });
}

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['welcome', 'calculator', 'jak-to-funguje', 'metodologie', 'faq'].includes(hash)) {
        if (hash === 'jak-to-funguje') {
            // Scroll to section instead of showing it as calculator section
            const target = document.getElementById(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (hash === 'calculator') {
            showSection('calculator');
        }
    }
});

// Handle importance checkbox with animation
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('importantCheckbox');
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            const question = questions[currentQuestion];
            if (answers[question.id] && answers[question.id].value !== null) {
                answers[question.id].important = checkbox.checked;
                
                // Visual feedback handled by CSS hover states
            }
        });
    }
});

// Initialize intersection observer for animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            }
        });
    });
    
    document.querySelectorAll('.step, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Call after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimations);