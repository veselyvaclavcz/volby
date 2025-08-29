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
        if (!response.ok) throw new Error('API not available');
        questions = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback pro lokální testování
        questions = [
            {id: 1, text: "Výše daní by měla odpovídat rozsahu státních služeb", dimension: "EKO", polarity: 1},
            {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", dimension: "SOC", polarity: 1},
            {id: 23, text: "Česko by mělo přijmout euro", dimension: "SUV", polarity: 1},
            {id: 2, text: "Domácí firmy potřebují státní podporu pro konkurenceschopnost", dimension: "EKO", polarity: -1},
            {id: 14, text: "Společnost funguje nejlépe s tradičním rodinným modelem", dimension: "SOC", polarity: -1}
        ];
        console.log('Using fallback questions for local testing');
    }
}

// Load parties from API
async function loadParties() {
    try {
        const response = await fetch('/.netlify/functions/api-parties');
        if (!response.ok) throw new Error('API not available');
        parties = await response.json();
    } catch (error) {
        console.error('Error loading parties:', error);
        // Fallback pro lokální testování - všech 26 stran
        parties = [
            {code: "ANO", name: "ANO", compass_position: {EKO: -0.36, SOC: 0.23, SUV: 0.41}},
            {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.64, SOC: -0.05, SUV: -0.64}},
            {code: "SPD", name: "SPD", compass_position: {EKO: -0.41, SOC: 0.86, SUV: 0.82}},
            {code: "PIRATI", name: "Piráti", compass_position: {EKO: -0.32, SOC: -0.95, SUV: -0.68}},
            {code: "STAN", name: "STAN", compass_position: {EKO: 0.14, SOC: -0.18, SUV: -0.73}},
            {code: "KSČM", name: "KSČM", compass_position: {EKO: -0.95, SOC: 0.23, SUV: 0.73}},
            {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.77, SOC: 0.82, SUV: 0.68}},
            {code: "PRISAHA", name: "Přísaha", compass_position: {EKO: 0.23, SOC: 0.27, SUV: 0.09}},
            {code: "SOCDEM", name: "SOCDEM", compass_position: {EKO: -0.68, SOC: -0.55, SUV: -0.36}},
            {code: "ZELENI", name: "Zelení", compass_position: {EKO: -0.50, SOC: -1.00, SUV: -1.00}},
            {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.95, SOC: -0.45, SUV: 0.36}},
            {code: "MOTORISTE", name: "Motoristé", compass_position: {EKO: 0.55, SOC: 0.32, SUV: 0.50}},
            {code: "PRO", name: "PRO", compass_position: {EKO: 0.32, SOC: 0.41, SUV: 0.64}},
            {code: "REPUBLIKA", name: "REPUBLIKA", compass_position: {EKO: 0.27, SOC: 0.82, SUV: 0.68}},
            {code: "STACILO", name: "Stačilo!", compass_position: {EKO: -0.95, SOC: -0.45, SUV: 0.41}},
            {code: "VYZVA2025", name: "Výzva2025", compass_position: {EKO: 0.00, SOC: 0.14, SUV: 0.14}},
            {code: "KRUH", name: "KRUH", compass_position: {EKO: 0.00, SOC: -0.45, SUV: -0.18}},
            {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.09}},
            {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.32, SOC: -0.50, SUV: -0.64}},
            {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.55, SOC: 0.36, SUV: 0.23}},
            {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -1.00, SOC: -0.91, SUV: 0.09}},
            {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.27, SOC: 0.86, SUV: 0.77}},
            {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.00, SOC: 0.00, SUV: 0.00}},
            {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.18, SOC: 0.23, SUV: 0.09}},
            {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.27, SOC: 0.59, SUV: 0.73}},
            {code: "VOLT", name: "Volt", compass_position: {EKO: -0.05, SOC: -0.86, SUV: -1.00}}
        ];
        console.log('Using fallback parties for local testing');
    }
}

// Go to home - show all normal sections, hide special ones
function goHome() {
    // Hide special sections (compass, calculator if it's in separate mode)
    const compassSection = document.getElementById('compass');
    if (compassSection) {
        compassSection.style.display = 'none';
    }
    
    // Show all normal sections
    document.querySelectorAll('section:not(#compass)').forEach(section => {
        section.style.display = '';
    });
    
    // Clear any active navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Clear hash
    history.pushState('', document.title, window.location.pathname + window.location.search);
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
            
            if (!response.ok) throw new Error('API not available');
            const data = await response.json();
            
            // Debug: Log what we received
            console.log('Received from API:', data);
            console.log('User compass position:', data.user_compass);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Add slight delay for better UX
            setTimeout(() => {
                displayResults(data.results, data.user_compass, data.compass_description, data.freedom_score);
            }, 1000);
            
        } catch (error) {
            console.error('Error calculating results:', error);
            // Fallback pro lokální testování
            console.log('Using fallback calculation for local testing');
            
            // Jednoduchý výpočet pro testování
            const fallbackResults = parties.map(party => ({
                party: party.name,
                match: Math.floor(Math.random() * 40) + 60, // 60-100%
                distance: Math.random() * 0.5 + 0.1
            }));
            
            setTimeout(() => {
                displayResults(
                    fallbackResults,
                    { EKO: 0.2, SOC: 0.1, SUV: 0.3 },
                    "Lokální testování",
                    75
                );
            }, 1000);
        }
    }, 300);
}

// Display results with animations
function displayResults(results, userCompass, compassDescription, freedomScore) {
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
                    <p style="margin: 0; font-size: 0.9em;">${compassDescription || 'Pozice vypočítaná z vašich odpovědí'}</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.8em; color: var(--color-text-muted);">
                        EKO: ${userCompass.EKO?.toFixed(2) || '0.00'} | SOC: ${userCompass.SOC?.toFixed(2) || '0.00'} | SUV: ${userCompass.SUV?.toFixed(2) || '0.00'}
                    </p>
                </div>
            ` : ''}
            
            ${freedomScore !== undefined ? `
                <div class="freedom-meter" style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 2px solid var(--color-primary);">
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--color-primary); text-align: center;">
                        🔥 SVOBODOMETR: ${freedomScore}%
                    </h3>
                    <p style="text-align: center; margin: 0 0 1rem 0; font-size: 0.85em; opacity: 0.9;">
                        Měří vaši preferenci mezi osobní svobodou a státní kontrolou<br>
                        <small style="opacity: 0.7;">Zahrnuje ekonomickou i osobní svobodu</small>
                    </p>
                    <div style="width: 100%; height: 40px; background: linear-gradient(90deg, #ff0000, #ff6666, #ffff66, #66ff66, #00ff00); border-radius: 20px; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; left: ${freedomScore}%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: white; border: 3px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; color: #000; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                            ${freedomScore}
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.85em; opacity: 0.8;">
                        <span>🔴 Státní kontrola</span>
                        <span>⚪ Neutrální postoj</span>
                        <span>🟢 Osobní svoboda</span>
                    </div>
                    <p style="text-align: center; margin: 1rem 0 0 0; font-size: 0.9em; line-height: 1.4;">
                        ${freedomScore < 20 ? '⛓️ <strong>Silná preference státní kontroly.</strong> Důvěřuješ státu v řízení ekonomických i sociálních záležitostí.' :
                          freedomScore < 40 ? '🔒 <strong>Mírná preference státní regulace.</strong> Podporuješ větší roli státu v klíčových oblastech.' :
                          freedomScore === 50 ? '⚖️ <strong>Neutrální postoj.</strong> Nemáš vyhraněný názor nebo vyrovnaně kombinuješ oba přístupy.' :
                          freedomScore < 60 ? '⚖️ <strong>Vyvážený přístup.</strong> Mírně preferuješ ' + (freedomScore > 50 ? 'svobodu před kontrolou' : 'kontrolu před svobodou') + '.' :
                          freedomScore < 80 ? '🔓 <strong>Mírná preference osobní svobody.</strong> Důvěřuješ více jednotlivcům než státu.' :
                          '🦅 <strong>Silná preference osobní svobody.</strong> Věříš v minimální stát a maximální osobní odpovědnost.'}
                    </p>
                    <p style="text-align: center; margin: 0.5rem 0 0 0; font-size: 0.8em; font-style: italic; opacity: 0.7;">
                        "50% znamená neutrální postoj, ne průměrnou svobodu"
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
                        <button class="agreement-details-btn" onclick="toggleAgreementDetails('${result.party.replace(/'/g, "\\'")}', ${index})" style="
                            background: transparent;
                            border: 1px solid rgba(255,217,61,0.3);
                            color: var(--color-text);
                            padding: 0.4rem 0.8rem;
                            border-radius: 4px;
                            font-size: 0.8em;
                            cursor: pointer;
                            margin-top: 0.5rem;
                            transition: all 0.2s ease;
                            display: flex;
                            align-items: center;
                            gap: 0.3rem;
                        " onmouseover="this.style.borderColor='rgba(255,217,61,0.6)'" onmouseout="this.style.borderColor='rgba(255,217,61,0.3)'">
                            <span class="toggle-arrow" style="transition: transform 0.2s ease;">▶</span>
                            Otázky
                        </button>
                        <div class="agreement-details" id="agreement-details-${index}" style="display: none; margin-top: 0.8rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 6px; border: 1px solid rgba(255,217,61,0.1);">
                            <!-- Details will be populated here -->
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
            <button class="btn btn-primary" onclick="showCompass()">
                📍 Zobrazit na kompasu
            </button>
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
        // Add cursor pointer for iOS Safari
        menuButton.style.cursor = 'pointer';
        
        // Handler function for menu toggle
        const toggleMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = nav.classList.contains('mobile-menu-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
            
            // Force repaint for Safari
            nav.style.display = nav.style.display;
        };
        
        // Detect iOS Safari
        const isIOSSafari = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
        
        if (isIOSSafari) {
            // For iOS Safari, use touchend instead of touchstart to avoid conflicts
            menuButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                toggleMenu(e);
            }, { passive: false });
        } else {
            // For other browsers, use click
            menuButton.addEventListener('click', toggleMenu);
        }
        
        // Close menu when clicking/touching outside
        const closeOnOutside = (e) => {
            if (!menuButton.contains(e.target) && !nav.contains(e.target)) {
                closeMobileMenu();
            }
        };
        
        document.addEventListener('click', closeOnOutside);
        document.addEventListener('touchend', closeOnOutside, { passive: true });
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

// Compass functionality
function showCompass() {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id !== 'compass') {
            section.style.display = 'none';
        }
    });
    
    // Show compass section
    const compassSection = document.getElementById('compass');
    if (compassSection) {
        compassSection.style.display = 'block';
        window.scrollTo(0, 0);
        
        // Initialize compass if not already done
        if (!compassSection.hasAttribute('data-initialized')) {
            initializeCompass();
            compassSection.setAttribute('data-initialized', 'true');
        }
        
        // Add user position if available
        const userPosition = localStorage.getItem('userCompassPosition');
        if (userPosition) {
            const position = JSON.parse(userPosition);
            addUserPositionToCompass(position);
        }
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.nav-link[href="#compass"]')?.classList.add('active');
    }
}

// Initialize compass visualization
async function initializeCompass() {
    // Load parties if not already loaded
    if (parties.length === 0) {
        await loadParties();
    }
    
    // Render compasses
    renderCompass('compass-eco-soc', 'EKO', 'SOC');
    renderCompass('compass-eco-suv', 'EKO', 'SUV');
    
    // Render legend
    renderLegend();
}

// Render a single compass
function renderCompass(compassId, dimX, dimY) {
    const compass = document.getElementById(compassId);
    if (!compass) return;
    
    // Clear existing content (except axes)
    compass.querySelectorAll('.party').forEach(p => p.remove());
    
    // Wait for layout to be ready
    setTimeout(() => {
        const compassWidth = compass.offsetWidth || 420;
        const compassHeight = compass.offsetHeight || 420;
        const centerX = compassWidth / 2;
        const centerY = compassHeight / 2;
        const scale = Math.min(centerX, centerY) * 0.85;
        
        parties.forEach(party => {
            const x = party.compass_position[dimX] * scale + centerX;
            const y = party.compass_position[dimY] * scale + centerY;
            
            const dot = document.createElement('div');
            dot.className = `party party-${party.code.toLowerCase()}`;
            dot.style.left = `${x - 8}px`;
            dot.style.top = `${y - 8}px`;
            dot.style.background = getPartyColor(party.code);
            dot.setAttribute('data-party', party.code);
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'party-tooltip';
            tooltip.textContent = party.name;
            dot.appendChild(tooltip);
            
            // Add hover interaction with legend
            dot.addEventListener('mouseenter', () => highlightParty(party.code));
            dot.addEventListener('mouseleave', () => unhighlightParty(party.code));
            
            compass.appendChild(dot);
        });
    }, 100);
}

// Render legend
function renderLegend() {
    const legend = document.getElementById('legend');
    if (!legend) return;
    
    legend.innerHTML = '';
    
    parties.forEach(party => {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.setAttribute('data-party', party.code);
        
        const color = document.createElement('div');
        color.className = 'legend-color';
        color.style.background = getPartyColor(party.code);
        
        const name = document.createElement('div');
        name.className = 'legend-name';
        name.textContent = party.name;
        
        item.appendChild(color);
        item.appendChild(name);
        
        // Add hover interaction
        item.addEventListener('mouseenter', () => highlightParty(party.code));
        item.addEventListener('mouseleave', () => unhighlightParty(party.code));
        
        legend.appendChild(item);
    });
}

// Get party color
function getPartyColor(code) {
    const colors = {
        'ANO': '#261060',
        'SPOLU': '#0056A7',
        'SPD': '#E31E24',
        'PIRATI': '#000000',
        'STAN': '#5D9C59',
        'KSČM': '#8B0000',
        'TRIKOLORA': '#0D47A1',
        'PRISAHA': '#87CEEB',
        'SOCDEM': '#FF4500',
        'ZELENI': '#00C853',
        'SVOBODNI': '#009C58',
        'MOTORISTE': '#FF9800',
        'PRO': '#1E88E5',
        'REPUBLIKA': '#B22222',
        'STACILO': '#DC143C',
        'VYZVA2025': '#20B2AA',
        'KRUH': '#2E8B57',
        'VOLUNTIA': '#FFD700',
        'BUDOUCNOST': '#32CD32',
        'JASAN': '#DAA520',
        'LEVY_BLOK': '#8B0000',
        'NARODNI_DEMOKRACIE': '#4B0082',
        'PRAVO_RESPEKT': '#696969',
        'ALIANCE_STABILITA': '#483D8B',
        'CESKA_SUVERENITA': '#8B4513',
        'VOLT': '#502379'
    };
    return colors[code] || '#666666';
}

// Highlight party in both compass and legend
function highlightParty(code) {
    document.querySelectorAll(`[data-party="${code}"]`).forEach(el => {
        el.classList.add('highlight');
    });
}

// Remove highlight from party
function unhighlightParty(code) {
    document.querySelectorAll(`[data-party="${code}"]`).forEach(el => {
        el.classList.remove('highlight');
    });
}

// Add user position to compass
function addUserPositionToCompass(userPosition) {
    // Remove any existing user position markers
    document.querySelectorAll('.user-position').forEach(el => el.remove());
    
    // Add user position to both compasses
    addUserDotToCompass('compass-eco-soc', userPosition, 'EKO', 'SOC');
    addUserDotToCompass('compass-eco-suv', userPosition, 'EKO', 'SUV');
}

// Add user dot to a specific compass
function addUserDotToCompass(compassId, position, dimX, dimY) {
    const compass = document.getElementById(compassId);
    if (!compass) return;
    
    const compassWidth = compass.offsetWidth || 420;
    const compassHeight = compass.offsetHeight || 420;
    const centerX = compassWidth / 2;
    const centerY = compassHeight / 2;
    const scale = Math.min(centerX, centerY) * 0.85;
    
    const x = (position[dimX] || 0) * scale + centerX;
    const y = (position[dimY] || 0) * scale + centerY;
    
    // Create user position marker - larger than regular dots
    const userDot = document.createElement('div');
    userDot.className = 'party user-position';
    userDot.style.left = `${x - 16}px`;
    userDot.style.top = `${y - 16}px`;
    userDot.style.width = '32px';
    userDot.style.height = '32px';
    userDot.style.background = '#FFD700';
    userDot.style.border = '3px solid black';
    userDot.style.borderRadius = '50%';
    userDot.style.zIndex = '100';
    userDot.style.display = 'flex';
    userDot.style.alignItems = 'center';
    userDot.style.justifyContent = 'center';
    userDot.style.fontSize = '14px';
    userDot.style.fontWeight = 'bold';
    userDot.style.color = 'black';
    userDot.textContent = 'TY';
    
    compass.appendChild(userDot);
}

// Update navigation to handle compass section
document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation clicks for non-compass sections
    document.querySelectorAll('.nav-link[href^="#"]:not([href="#compass"])').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#compass') {
                // Hide compass if visible
                const compassSection = document.getElementById('compass');
                if (compassSection) {
                    compassSection.style.display = 'none';
                }
                // Show all other sections
                document.querySelectorAll('section:not(#compass)').forEach(section => {
                    section.style.display = '';
                });
            }
        });
    });
    
    // Handle compass navigation click
    document.querySelectorAll('a[href="#compass"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showCompass();
        });
    });
});

// Store questions and parties data globally for agreement details
let questionsData = [];
let partiesData = [];

// Toggle agreement details for a party
async function toggleAgreementDetails(partyName, index) {
    const detailsElement = document.getElementById(`agreement-details-${index}`);
    const button = detailsElement.previousElementSibling;
    const arrow = button.querySelector('.toggle-arrow');
    
    if (detailsElement.style.display === 'none') {
        // Show details
        if (!questionsData || questionsData.length === 0) {
            await loadQuestionsData();
        }
        
        const agreementHTML = await generateAgreementDetails(partyName);
        detailsElement.innerHTML = agreementHTML;
        detailsElement.style.display = 'block';
        arrow.style.transform = 'rotate(90deg)';
        
        // Smooth animation
        detailsElement.style.animation = 'slideInUp 0.3s ease forwards';
    } else {
        // Hide details
        arrow.style.transform = 'rotate(0deg)';
        detailsElement.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            detailsElement.style.display = 'none';
        }, 300);
    }
}

// Load questions data from API
async function loadQuestionsData() {
    if (questionsData && questionsData.length > 0) return;
    
    try {
        const response = await fetch('/.netlify/functions/api-questions');
        const data = await response.json();
        questionsData = data; // The API returns array directly
        console.log('Loaded questions:', questionsData.length);
    } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback data - all 33 questions
        questionsData = [];
    }
}

// Generate agreement details HTML for a party
async function generateAgreementDetails(partyName) {
    // Find party in global parties data
    const party = partiesData.find(p => p.name === partyName) || 
                  {code: partyName.toUpperCase(), name: partyName, compass_position: {EKO: 0, SOC: 0, SUV: 0}};
    
    console.log('Generating details for:', partyName);
    console.log('Total questions available:', questionsData.length);
    console.log('Total answers:', Object.keys(answers).length);
    
    // Calculate agreement for ALL questions (all 33)
    const agreementData = [];
    
    // Go through ALL questions from questionsData
    for (const question of questionsData) {
        const answer = answers[question.id];
        
        // Skip if user hasn't answered this question
        if (!answer || answer.value === null) continue;
        
        // Estimate party answer based on compass position and question dimension
        const partyScore = estimatePartyAnswer(party, question);
        const userScore = answer.value;
        
        // Calculate agreement (1-5 scale, lower difference = better agreement)
        const difference = Math.abs(userScore - partyScore);
        let agreementLevel, agreementColor, agreementIcon;
        
        if (difference <= 0.5) {
            agreementLevel = 'Plná shoda';
            agreementColor = '#4CAF50';
            agreementIcon = '✅';
        } else if (difference <= 1.5) {
            agreementLevel = 'Částečná shoda';
            agreementColor = '#FF9800';
            agreementIcon = '🔶';
        } else {
            agreementLevel = 'Neshoda';
            agreementColor = '#f44336';
            agreementIcon = '❌';
        }
        
        agreementData.push({
            question: question.text,
            dimension: question.dimension,
            userAnswer: getUserAnswerText(userScore),
            partyAnswer: getUserAnswerText(partyScore),
            agreementLevel,
            agreementColor,
            agreementIcon,
            important: answer.important
        });
    }
    
    // Sort by dimension for better readability
    agreementData.sort((a, b) => {
        const dimOrder = {EKO: 1, SOC: 2, SUV: 3};
        return dimOrder[a.dimension] - dimOrder[b.dimension];
    });
    
    console.log('Processed questions:', agreementData.length);
    
    // Generate HTML - Ultra simple compact list
    const fullCount = agreementData.filter(a => a.agreementLevel === 'Plná shoda').length;
    const partialCount = agreementData.filter(a => a.agreementLevel === 'Částečná shoda').length;
    const noneCount = agreementData.filter(a => a.agreementLevel === 'Neshoda').length;
    
    let html = `
        <div style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="font-size: 0.9em; color: var(--color-text); margin-bottom: 0.3rem;">Shoda s stranou ${partyName}</div>
            <div style="display: flex; gap: 1rem; font-size: 0.8em; align-items: center;">
                <span style="display: flex; align-items: center; gap: 0.3rem;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #4CAF50;"></span>
                    ${fullCount}
                </span>
                <span style="display: flex; align-items: center; gap: 0.3rem;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(90deg, #FF9800 50%, transparent 50%); border: 1px solid #FF9800;"></span>
                    ${partialCount}
                </span>
                <span style="display: flex; align-items: center; gap: 0.3rem;">
                    <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; border: 1px solid #f44336;"></span>
                    ${noneCount}
                </span>
            </div>
        </div>
        <div style="max-height: 320px; overflow-y: auto;">
    `;
    
    // Ultra simple list - just question and agreement indicator on the right
    agreementData.forEach((item, index) => {
        // Use consistent circle symbols that render at same size
        let agreementSymbol;
        if (item.agreementLevel === 'Plná shoda') {
            agreementSymbol = `<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${item.agreementColor};"></span>`;
        } else if (item.agreementLevel === 'Částečná shoda') {
            agreementSymbol = `<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(90deg, ${item.agreementColor} 50%, transparent 50%); border: 1px solid ${item.agreementColor};"></span>`;
        } else {
            agreementSymbol = `<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 1px solid ${item.agreementColor};"></span>`;
        }
        
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.85em;">
                <div style="flex: 1; line-height: 1.3; padding-right: 1rem;">
                    <span style="color: var(--color-text);">${item.question}</span>
                    ${item.important ? '<span style="color: var(--color-primary); font-size: 0.75em; margin-left: 0.4rem;">⭐</span>' : ''}
                </div>
                <div style="flex-shrink: 0; display: flex; align-items: center;">
                    ${agreementSymbol}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

// Estimate party answer based on compass position
function estimatePartyAnswer(party, question) {
    const position = party.compass_position[question.dimension] || 0;
    
    // The question polarity determines how compass position translates to agreement
    // If polarity is 1: positive position = agree with question
    // If polarity is -1: positive position = disagree with question
    
    // Apply polarity to position
    const adjustedPosition = position * question.polarity;
    
    // Convert to answer scale (1 to 5)
    // -1 = strongly disagree (5), +1 = strongly agree (1), 0 = neutral (3)
    // We need to INVERT because 1 = agree, 5 = disagree
    const answer = 3 - (adjustedPosition * 2);
    
    return Math.max(1, Math.min(5, Math.round(answer)));
}

// Convert answer number to text
function getUserAnswerText(answerValue) {
    const texts = {
        1: 'Silně souhlasím',
        2: 'Spíše souhlasím', 
        3: 'Neutrální',
        4: 'Spíše nesouhlasím',
        5: 'Silně nesouhlasím'
    };
    return texts[Math.round(answerValue)] || 'Neznámé';
}

// Load parties data when needed
async function loadPartiesData() {
    if (partiesData.length > 0) return;
    
    // Since parties are hardcoded in calculate function, replicate here
    partiesData = [
        {code: "ANO", name: "ANO", compass_position: {EKO: -0.36, SOC: 0.23, SUV: 0.41}},
        {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.64, SOC: -0.05, SUV: -0.64}},
        {code: "SPD", name: "SPD", compass_position: {EKO: -0.41, SOC: 0.86, SUV: 0.82}},
        {code: "PIRATI", name: "Piráti", compass_position: {EKO: -0.32, SOC: -0.95, SUV: -0.68}},
        {code: "STAN", name: "STAN", compass_position: {EKO: 0.14, SOC: -0.18, SUV: -0.73}},
        {code: "KSČM", name: "KSČM", compass_position: {EKO: -0.95, SOC: 0.23, SUV: 0.73}},
        {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.77, SOC: 0.82, SUV: 0.68}},
        {code: "PRISAHA", name: "Přísaha", compass_position: {EKO: 0.23, SOC: 0.27, SUV: 0.09}},
        {code: "SOCDEM", name: "SOCDEM", compass_position: {EKO: -0.68, SOC: -0.55, SUV: -0.36}},
        {code: "ZELENI", name: "Zelení", compass_position: {EKO: -0.50, SOC: -1.00, SUV: -1.00}},
        {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.95, SOC: -0.45, SUV: 0.36}},
        {code: "MOTORISTE", name: "Motoristé", compass_position: {EKO: 0.55, SOC: 0.32, SUV: 0.50}},
        {code: "PRO", name: "PRO", compass_position: {EKO: 0.32, SOC: 0.41, SUV: 0.64}},
        {code: "REPUBLIKA", name: "REPUBLIKA", compass_position: {EKO: 0.27, SOC: 0.82, SUV: 0.68}},
        {code: "STACILO", name: "Stačilo!", compass_position: {EKO: -0.95, SOC: -0.45, SUV: 0.41}},
        {code: "VYZVA2025", name: "Výzva2025", compass_position: {EKO: 0.00, SOC: 0.14, SUV: 0.14}},
        {code: "KRUH", name: "KRUH", compass_position: {EKO: 0.00, SOC: -0.45, SUV: -0.18}},
        {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.09}},
        {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.32, SOC: -0.50, SUV: -0.64}},
        {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.55, SOC: 0.36, SUV: 0.23}},
        {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -1.00, SOC: -0.91, SUV: 0.09}},
        {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.27, SOC: 0.86, SUV: 0.77}},
        {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.00, SOC: 0.00, SUV: 0.00}},
        {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.18, SOC: 0.23, SUV: 0.09}},
        {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.27, SOC: 0.59, SUV: 0.73}},
        {code: "VOLT", name: "Volt", compass_position: {EKO: -0.05, SOC: -0.86, SUV: -1.00}}
    ];
}

// Initialize parties data on load
document.addEventListener('DOMContentLoaded', () => {
    loadPartiesData();
});