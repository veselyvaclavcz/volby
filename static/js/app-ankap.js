// Czech Election Calculator 2025 - Ankap Style JavaScript
// Industrial minimalist interaction with theme switching

// State management
let currentQuestion = 0;
let questions = [];
let answers = {};
let parties = [];

// Theme management
let currentTheme = 'dark';

// Navigation state
let isNavigating = false;
let compassInitialized = false;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    await loadParties();
    
    // Restore saved test data from localStorage
    const savedAnswers = localStorage.getItem('userAnswers');
    const savedCurrentQuestion = localStorage.getItem('currentQuestion');
    
    if (savedAnswers) {
        try {
            answers = JSON.parse(savedAnswers);
            console.log('Restored answers from localStorage:', answers);
        } catch (e) {
            console.error('Error parsing saved answers:', e);
        }
    }
    
    if (savedCurrentQuestion) {
        currentQuestion = parseInt(savedCurrentQuestion);
        console.log('Restored currentQuestion from localStorage:', currentQuestion);
    }
    
    // Check if we have saved results and restore them
    const savedResults = localStorage.getItem('testResults');
    if (savedResults) {
        console.log('Found saved test results on page load');
        // Will be restored when showing calculator section
    }
    
    // Check URL hash and show appropriate section
    const hash = window.location.hash.slice(1);
    console.log('Initial hash:', hash);
    
    if (hash && ['welcome', 'calculator', 'compass', 'jak-to-funguje', 'kalkulacka', 'metodologie', 'faq'].includes(hash)) {
        console.log('Showing section:', hash);
        showSection(hash);
        // Special handling for compass on direct load
        if (hash === 'compass') {
            setTimeout(() => {
                initializeCompass();
            }, 800);
        }
    } else {
        console.log('No valid hash, showing welcome');
        showSection('welcome');
    }
    
    initializeMobileMenu();
    initializeKeyboardNavigation();
    initializeThemeToggle();
    initializeSmoothScroll();
    initializeActiveNavigation();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['welcome', 'calculator', 'compass', 'jak-to-funguje', 'kalkulacka', 'metodologie', 'faq'].includes(hash)) {
        showSection(hash);
    } else {
        showSection('welcome');
    }
});

// Load questions from API
async function loadQuestions() {
    try {
        const response = await fetch('/.netlify/functions/api-questions');
        if (!response.ok) throw new Error('API not available');
        const rawQuestions = await response.json();
        
        // Keep questions in original format (answers as object)
        questions = rawQuestions;
        
        console.log('Loaded questions:', questions.length, 'Format:', questions[0]?.answers ? 'object' : 'unknown');
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
        const data = await response.json();
        // Combine main and coalition parties with type flag
        parties = [
            ...data.mainParties.map(p => ({...p, type: 'main'})),
            ...data.coalitionParties.map(p => ({...p, type: 'coalition'}))
        ];
    } catch (error) {
        console.error('Error loading parties:', error);
        // Fallback for local testing - empty array since API should work
        parties = [];
        console.log('API failed, using empty fallback');
    }
}

// Go to home - show welcome section
function goHome() {
    showSection('home');
}

// Navigation with smooth transitions
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    
    // Update navigation active state
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Only compass is a separate section, everything else scrolls
    if (sectionId === 'compass') {
        // Hide main content and show compass
        document.querySelectorAll('section:not(#compass)').forEach(section => {
            section.style.display = 'none';
        });
        
        const compassSection = document.getElementById('compass');
        if (compassSection) {
            compassSection.style.display = 'block';
            compassSection.classList.add('active');
            setTimeout(() => {
                initializeCompass();
            }, 100);
        }
    } else {
        // Hide compass and show all other sections (they're on one scrollable page)
        const compassSection = document.getElementById('compass');
        if (compassSection) {
            compassSection.style.display = 'none';
            compassSection.classList.remove('active');
        }
        
        // Show all sections except compass (restore normal page view)
        document.querySelectorAll('section:not(#compass)').forEach(section => {
            section.style.display = '';
        });
        
        // Always check and restore calculator state when leaving compass
        const savedResults = localStorage.getItem('testResults');
        if (savedResults) {
            const questionContainer = document.getElementById('questionContainer');
            const resultsContainer = document.getElementById('resultsContainer');
            const welcomeSection = document.getElementById('welcome');
            
            if (questionContainer && resultsContainer) {
                questionContainer.style.display = 'none';
                resultsContainer.style.display = 'block';
                welcomeSection.style.display = 'none';
                
                // Restore results if container is empty
                if (!resultsContainer.querySelector('.results-list')) {
                    try {
                        const resultsData = JSON.parse(savedResults);
                        displayResults(resultsData.results, resultsData.userCompass, resultsData.dimensions, resultsData.svobodometr);
                    } catch (e) {
                        console.error('Error restoring results:', e);
                    }
                }
            }
        }
        
        // For specific sections, scroll to them
        if (sectionId === 'home' || sectionId === 'welcome') {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (sectionId !== 'compass') {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // If explicitly switching to calculator, do additional setup
            if (sectionId === 'calculator' || sectionId === 'kalkulacka') {
                console.log('DEBUG: Switching to calculator section');
                const questionContainer = document.getElementById('questionContainer');
                const resultsContainer = document.getElementById('resultsContainer');
                const welcomeSection = document.getElementById('welcome');
                
                // Check if we have saved results (more reliable than checking answer count)
                const savedResults = localStorage.getItem('testResults');
                const hasResults = savedResults !== null;
                
                console.log('DEBUG: Has saved results?', hasResults);
                console.log('DEBUG: Current answers count:', Object.keys(answers).length);
                console.log('DEBUG: Questions loaded:', questions.length);
                
                if (hasResults) {
                    console.log('DEBUG: Restoring test results view');
                    // Show results if test is completed
                    if (questionContainer && resultsContainer) {
                        questionContainer.style.display = 'none';
                        resultsContainer.style.display = 'block';
                        console.log('DEBUG: Results container display:', resultsContainer.style.display);
                    }
                    // Keep welcome section hidden when showing results
                    if (welcomeSection) {
                        welcomeSection.style.display = 'none';
                        console.log('DEBUG: Welcome section hidden');
                    }
                    
                    // Restore results from localStorage
                    try {
                        const resultsData = JSON.parse(savedResults);
                        console.log('Restoring results from localStorage:', resultsData);
                        // Only call displayResults if results container is empty
                        if (resultsContainer && !resultsContainer.querySelector('.results-list')) {
                            displayResults(resultsData.results, resultsData.userCompass, resultsData.dimensions, resultsData.svobodometr);
                        }
                    } catch (e) {
                        console.error('Error parsing saved results:', e);
                    }
                } else {
                    // Show calculator interface for incomplete test
                    if (questionContainer && resultsContainer) {
                        questionContainer.style.display = 'block';
                        resultsContainer.style.display = 'none';
                    }
                    
                    // Restore welcome section if test not started
                    if (welcomeSection && (currentQuestion === 0 && Object.keys(answers).length === 0)) {
                        welcomeSection.style.display = 'block';
                    }
                    
                    // If no question is displayed and questions are loaded, start from beginning
                    if (currentQuestion === 0 && Object.keys(answers).length === 0 && questions.length > 0) {
                        displayQuestion();
                    } else if (questions.length === 0) {
                        console.log('DEBUG: Questions not loaded yet, cannot display question');
                    }
                }
            }
        }
    }
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Update URL hash only if it's different (prevents hashchange event loops)
    if (window.location.hash.slice(1) !== sectionId) {
        window.location.hash = sectionId;
    }
}

// Start calculator
function startCalculator() {
    currentQuestion = 0;
    answers = {};
    
    // Clear previous test data from localStorage
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('testResults');
    
    showSection('calculator');
    displayQuestion();
}

// Display current question with smooth transition
function displayQuestion() {
    // Check if questions are loaded
    if (!questions || questions.length === 0) {
        console.error('Questions not loaded yet!');
        return;
    }
    
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
    
    // Update question content for v2 format
    const categoryMap = {
        'economy': 'Ekonomika',
        'state': 'Role státu',
        'society': 'Společnost',
        'sovereignty': 'Suverenita'
    };
    document.getElementById('questionCategory').textContent = categoryMap[question.dimension] || question.dimension || question.category;
    document.getElementById('questionText').textContent = question.text;
    
    // Update answer buttons with v2 format
    const answerButtons = document.querySelectorAll('.answer-btn');
    if (question.answers && typeof question.answers === 'object') {
        // New format with answer texts as object {"1": "text", "2": "text", ...}
        answerButtons.forEach((btn, index) => {
            const answerSpan = btn.querySelector('.answer-label');
            const answerKey = String(index + 1);
            answerSpan.textContent = question.answers[answerKey] || `Odpověď ${index + 1}`;
            btn.onclick = () => selectAnswer(index + 1);
            btn.classList.remove('selected');
            btn.setAttribute('aria-pressed', 'false');
        });
    } else {
        // Fallback to old format
        const defaultAnswers = [
            'Rozhodně souhlasím',
            'Spíše souhlasím',
            'Neutrální',
            'Spíše nesouhlasím',
            'Rozhodně nesouhlasím'
        ];
        answerButtons.forEach((btn, index) => {
            const answerSpan = btn.querySelector('.answer-label');
            answerSpan.textContent = defaultAnswers[index];
            btn.onclick = () => selectAnswer(index + 1);
            btn.classList.remove('selected');
            btn.setAttribute('aria-pressed', 'false');
        });
    }
    
    // Check if question was already answered
    if (answers[question.id]) {
        const answer = answers[question.id];
        if (answer.value !== null && answer.value !== undefined) {
            // Select the button based on answer value (1-5)
            const selectedBtn = answerButtons[answer.value - 1];
            if (selectedBtn) {
                selectedBtn.classList.add('selected');
                selectedBtn.setAttribute('aria-pressed', 'true');
            }
            document.getElementById('importantCheckbox').checked = answer.important || false;
            document.getElementById('nextBtn').disabled = false;
        }
    } else {
        document.getElementById('importantCheckbox').checked = false;
        document.getElementById('nextBtn').disabled = true;
    }
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
}

// Select answer with visual feedback - V2 format
function selectAnswer(value) {
    const question = questions[currentQuestion];
    console.log(`DEBUG selectAnswer: Q${question.id}, value=${value}`);
    
    // Update UI with smooth transition
    document.querySelectorAll('.answer-btn').forEach((btn, index) => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
        
        // Match button by index (value is 1-5, index is 0-4)
        if (index === value - 1) {
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    // Save answer
    const isImportant = document.getElementById('importantCheckbox').checked;
    answers[question.id] = {
        value: value,
        important: isImportant
    };
    
    // Save to localStorage immediately
    localStorage.setItem('userAnswers', JSON.stringify(answers));
    localStorage.setItem('currentQuestion', currentQuestion.toString());
    
    console.log(`DEBUG saved answer: Q${question.id} = ${value}, important=${isImportant}`);
    console.log('DEBUG all answers so far:', answers);
    
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
        // Save current question state to localStorage
        localStorage.setItem('currentQuestion', currentQuestion.toString());
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
            console.log('DEBUG calculateResults: Total collected answers:', Object.keys(answers).length);
            console.log('DEBUG calculateResults: Sending answers to API:', answers);
            
            // Send answers to API
            const response = await fetch('/.netlify/functions/api-calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answers: answers })
            });
            
            if (!response.ok) throw new Error('API not available');
            const data = await response.json();
            
            // Debug: Log what we received
            console.log('Received from API:', data);
            console.log('User compass position:', data.user_compass);
            console.log('Svobodometr:', data.svobodometr);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Store party answers globally for agreement display
            window.partyAnswersData = {};
            if (data.results) {
                data.results.forEach(result => {
                    if (result.answers) {
                        window.partyAnswersData[result.party] = result.answers;
                    }
                });
            }
            
            // Store full response for stats
            window.lastCalculationResponse = data;
            
            // Add slight delay for better UX
            setTimeout(() => {
                console.log('DEBUG calculateResults: API response data:', data);
                console.log('DEBUG calculateResults: user_compass:', data.user_compass);
                console.log('DEBUG calculateResults: dimensions:', data.dimensions);
                displayResults(data.results, data.user_compass, data.dimensions, data.svobodometr);
            }, 1000);
            
        } catch (error) {
            console.error('Error calculating results:', error);
            // Fallback pro lokální testování
            console.log('Using fallback calculation for local testing');
            
            // Use party list if available, otherwise use hardcoded names
            const partyList = parties.length > 0 ? parties.map(p => p.name) : [
                'ANO 2011', 'Spolu (ODS–KDU–TOP09)', 'SPD', 'Česká pirátská strana',
                'Starostové a nezávislí (STAN)', 'Stačilo!', 'Přísaha', 'Motoristé sobě'
            ];
            
            // Jednoduchý výpočet pro testování
            const fallbackResults = partyList.map(partyName => ({
                party: partyName,
                party_name: partyName,
                match: Math.floor(Math.random() * 40) + 60, // 60-100%
                distance: Math.random() * 0.5 + 0.1
            }));
            
            setTimeout(() => {
                displayResults(
                    fallbackResults,
                    { economy: 0.2, state: 0.1, society: 0.3, sovereignty: 0.2 },
                    { economy: 0.2, state: 0.1, society: 0.3, sovereignty: 0.2 },
                    75
                );
            }, 1000);
        }
    }, 300);
}

// Display results with animations - V2 4D format
function displayResults(results, userCompass, dimensions, svobodometr) {
    console.log('DEBUG: displayResults called with:', { results, userCompass, dimensions, svobodometr });
    
    // Save results to localStorage for navigation persistence
    localStorage.setItem('testResults', JSON.stringify({
        results: results,
        userCompass: userCompass,
        dimensions: dimensions,
        svobodometr: svobodometr
    }));
    console.log('DEBUG: Results saved to localStorage');
    
    // Hide the welcome and calculator header when showing results
    const welcomeSection = document.getElementById('welcome');
    const calculatorHeader = document.querySelector('.calculator-header');
    
    if (welcomeSection) {
        welcomeSection.style.display = 'none';
    }
    if (calculatorHeader) {
        calculatorHeader.style.display = 'none';
    }
    
    // Sort by match percentage if results exist
    if (results && results.length > 0) {
        results.sort((a, b) => b.match - a.match);
    }
    
    // Store party results globally for compass visualization
    // Map party results from API format to compass format
    if (results && results.length > 0) {
        window.partyResults = results.map(party => ({
            ...party,
            // Use type from API if available, otherwise default to 'main'
            type: party.type || 'main',
            compass_position: party.compass_position ? {
                economy: party.compass_position.EKO || 0,
                society: party.compass_position.SOC || 0, 
                state: party.compass_position.STA || 0,
                sovereignty: party.compass_position.SUV || 0
            } : {economy: 0, society: 0, state: 0, sovereignty: 0}
        }));
    } else {
        window.partyResults = [];
    }
    
    // Use svobodometr parameter or default value
    const freedomScore = svobodometr || 50;
    
    // Save user position to localStorage for compass visualization
    if (userCompass) {
        // Convert from API format (EKO, SOC, SUV) to compass format (economy, society, state, sovereignty)
        const mappedUserCompass = {
            economy: userCompass.EKO || 0,      // Economic dimension
            society: userCompass.SOC || 0,      // Social dimension
            state: userCompass.STA || 0,        // State role dimension
            sovereignty: userCompass.SUV || 0   // Sovereignty dimension
        };
        localStorage.setItem('userCompassPosition', JSON.stringify(mappedUserCompass));
        localStorage.setItem('userDimensions', JSON.stringify(dimensions || mappedUserCompass));
    }
    
    // Save user stats if available
    if (window.lastCalculationResponse && window.lastCalculationResponse.user_stats) {
        localStorage.setItem('userStats', JSON.stringify(window.lastCalculationResponse.user_stats));
    }
    
    // Detect anarchocapitalist position - updated for 4D
    const isAnarchoCapitalist = dimensions && 
        dimensions.economy > 0.8 && 
        dimensions.state < -0.6 && 
        dimensions.society < -0.6 &&
        svobodometr > 85;
    
    // Create HTML for results with staggered animations
    const resultsHTML = `
        <div class="results-header">
            <h2>Vaše výsledky</h2>
            <p class="lead">Shoda s politickými stranami na základě vašich odpovědí</p>
            ${isAnarchoCapitalist ? `
                <div class="ancap-warning" style="background: linear-gradient(135deg, #FFD93D 50%, #1A1A1A 50%); padding: 1.5rem; border-radius: 8px; margin: 1rem 0; border: 2px solid #FFD93D;">
                    <h3 style="margin: 0 0 0.5rem 0; color: #FFD93D; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🏴 Anarchokapitalistická pozice detekována! 🏴</h3>
                    <p style="margin: 0.5rem 0; color: #fff; font-size: 0.95em;">
                        Gratulujeme! Podle vašich odpovědí jste anarchokapitalista. 
                        Ironií je, že vám radíme, kterou stranu volit ve volbách, 
                        které byste podle svého přesvědčení nejspíš bojkotoval(a).
                    </p>
                    <p style="margin: 0.5rem 0; color: #FFD93D; font-size: 0.85em; font-style: italic;">
                        "Volby jsou pouze iluze výběru v systému, který neuznáváte. 
                        Skutečná svoboda přichází s dobrovolnou spoluprací, ne s hlasovacím lístkem."
                    </p>
                    <p style="margin: 0.5rem 0 0 0; color: #fff; font-size: 0.8em;">
                        💡 Tip: Pokud už musíte volit, vyberte stranu, která slibuje nejmenší stát... 
                        nebo si založte vlastní mikronárod na moři!
                    </p>
                </div>
            ` : ''}
            ${userCompass ? `
                <div class="compass-position-info" style="background: rgba(255,217,61,0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
                    <h4 style="margin: 0 0 0.5rem 0; color: var(--color-primary);">Vaše pozice ve 4D prostoru</h4>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9em; color: var(--color-text-muted);">
                        Ekonomika: ${userCompass.EKO?.toFixed(2) || '0.00'} | Stát: ${userCompass.STA?.toFixed(2) || '0.00'}<br>
                        Společnost: ${userCompass.SOC?.toFixed(2) || '0.00'} | Suverenita: ${userCompass.SUV?.toFixed(2) || '0.00'}
                    </p>
                </div>
            ` : ''}
            
            ${svobodometr !== undefined ? `
                <div class="freedom-meter" style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; border: 2px solid var(--color-primary);">
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--color-primary); text-align: center;">
                        🔥 SVOBODOMETR: ${svobodometr}%
                    </h3>
                    <p style="text-align: center; margin: 0 0 1rem 0; font-size: 0.85em; opacity: 0.9;">
                        Měří vaši celkovou preferenci svobody vs. státního zasahování<br>
                        <small style="opacity: 0.7;">Vypočítáno ze všech čtyř dimenzí</small>
                    </p>
                    <div style="width: 100%; height: 40px; background: linear-gradient(90deg, #ff0000, #ff6666, #ffff66, #66ff66, #00ff00); border-radius: 20px; position: relative; overflow: visible; margin: 15px 0;">
                        <div style="position: absolute; top: 50%; left: ${Math.max(5, Math.min(95, svobodometr))}%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: white; border: 3px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; color: #000; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 10;">
                            ${svobodometr}
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
                        ${result.confidence && result.coverage ? `
                        <div class="result-quality-indicators" style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8em; color: var(--color-text-muted);">
                            <span title="Spolehlivost dat">📊 ${Math.round(result.confidence * 100)}%</span>
                            <span title="Pokrytí otázek">📋 ${Math.round(result.coverage * 100)}%</span>
                        </div>` : ''}
                        <button class="agreement-details-btn" onclick="toggleAgreementDetails('${(result.party_name || result.party || '').replace(/'/g, "\\'")}', ${index})" style="
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
            <p>4D politický kompas: Euklidovská vzdálenost v prostoru Ekonomika × Stát × Společnost × Suverenita</p>
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
    
    // Clear localStorage
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('testResults');
    
    // Show welcome and header again
    const welcomeSection = document.getElementById('welcome');
    const calculatorHeader = document.querySelector('.calculator-header');
    const questionContainer = document.getElementById('questionContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    
    resultsContainer.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
        resultsContainer.style.display = 'none';
        
        // Show welcome and header again
        if (welcomeSection) {
            welcomeSection.style.display = 'block';
        }
        if (calculatorHeader) {
            calculatorHeader.style.display = 'block';  
        }
        
        // Hide question container initially and show welcome
        questionContainer.style.display = 'none';
        showSection('welcome');
        
        // Scroll to the calculator section
        const calculatorSection = document.getElementById('kalkulacka');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
    
    // Handle hash changes - but only for external changes (browser back/forward)
    window.addEventListener('hashchange', () => {
        const sectionId = window.location.hash.substring(1);
        if (sectionId && ['welcome', 'calculator', 'compass'].includes(sectionId)) {
            updateActiveNavigation(sectionId);
            // Only change sections if they're not already active (prevents loop)
            const currentActive = document.querySelector('.section.active')?.id;
            if (currentActive !== sectionId) {
                // Hide current section and show new one without calling showSection
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                const newSection = document.getElementById(sectionId);
                if (newSection) {
                    newSection.classList.add('active');
                    if (sectionId === 'compass') {
                        setTimeout(() => {
                            initializeCompass();
                        }, 100);
                    }
                }
            }
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
            console.log(`DEBUG keydown: pressed ${e.key}, calling selectAnswer(${parseInt(e.key)})`);
            selectAnswer(parseInt(e.key));
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' && !document.getElementById('prevBtn').disabled) {
            previousQuestion();
        }
        if (e.key === 'ArrowRight' && !document.getElementById('nextBtn').disabled) {
            nextQuestion();
        }
        
        // Enter to continue to next question (if answer selected)
        if (e.key === 'Enter' && !document.getElementById('nextBtn').disabled) {
            console.log('DEBUG keydown: Enter pressed, calling nextQuestion()');
            nextQuestion();
        }
        
        // Space for skip or continue
        if (e.key === ' ' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            if (!document.getElementById('nextBtn').disabled) {
                console.log('DEBUG keydown: Space pressed, calling nextQuestion()');
                nextQuestion();
            } else {
                console.log('DEBUG keydown: Space pressed, calling skipQuestion()');
                skipQuestion();
            }
        }
    });
}

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['welcome', 'calculator', 'compass', 'jak-to-funguje', 'kalkulacka', 'metodologie', 'faq'].includes(hash)) {
        if (hash === 'jak-to-funguje') {
            // Scroll to section instead of showing it as calculator section
            const target = document.getElementById(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (hash === 'calculator') {
            showSection('calculator');
        } else if (hash === 'compass') {
            showSection('compass');
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
    // Use the standard showSection method to properly handle navigation
    showSection('compass');
    
    // Initialize compass properly with all components
    setTimeout(() => {
        initializeCompass();
    }, 100);
}
        
// Removed - both compasses are displayed side by side now

async function initializeCompass() {
    console.log('DEBUG initializeCompass: Starting compass initialization');
    console.log('DEBUG initializeCompass: Current partyResults:', window.partyResults?.length || 0, 'parties');
    
    // Load user position from localStorage if available
    const userPositionData = localStorage.getItem('userCompassPosition');
    if (userPositionData) {
        window.userCompassPosition = JSON.parse(userPositionData);
        console.log('DEBUG initializeCompass: Loaded userCompassPosition from localStorage:', window.userCompassPosition);
    } else {
        console.log('DEBUG initializeCompass: No userCompassPosition in localStorage');
    }
    
    console.log('DEBUG initializeCompass: Current userCompassPosition:', window.userCompassPosition);
    
    // If we don't have party results, get default positions
    if (!window.partyResults || window.partyResults.length === 0) {
        console.log('DEBUG initializeCompass: Loading default party positions');
        await loadDefaultPartyPositions();
    }
    
    console.log('DEBUG initializeCompass: Final partyResults:', window.partyResults?.length || 0, 'parties');
    
    // Render both compasses with new axis combinations
    // Compass 1: Personal Freedom (Social) × Economic Freedom
    renderCompass('compass-eco-state', 'society', 'economy');
    // Compass 2: Power Distribution (State) × Power Scope (Sovereignty)
    renderCompass('compass-soc-suv', 'state', 'sovereignty');
    
    // Render legend
    renderLegend();
    
    // Add user position if available
    if (window.userCompassPosition) {
        console.log('DEBUG initializeCompass: Adding user position to compass');
        setTimeout(() => {
            addUserPositionToCompass(window.userCompassPosition, null);
        }, 200);
    }
}

// Load default party positions from API
async function loadDefaultPartyPositions() {
    try {
        const response = await fetch('/.netlify/functions/api-parties');
        
        if (response.ok) {
            const data = await response.json();
            // Combine main and coalition parties with type flag
            const allParties = [
                ...data.mainParties.map(p => ({...p, type: 'main'})),
                ...data.coalitionParties.map(p => ({...p, type: 'coalition'}))
            ];
            
            // Convert to party results format with correct dimension mapping
            // API uses EKO, SOC, SUV but compass expects economy, society, state, sovereignty
            window.partyResults = allParties.map(party => ({
                party: party.code,
                name: party.name,
                type: party.type,  // Important: preserve the type (main/coalition)
                compass_position: {
                    economy: party.compass_position.EKO,      // Economic dimension (left-right)
                    society: party.compass_position.SOC,      // Social dimension (liberal-conservative) 
                    state: party.compass_position.STA !== undefined ? party.compass_position.STA : 
                           (party.compass_position.EKO + party.compass_position.SOC) / 2,  // State role - use STA if available, else average of EKO and SOC
                    sovereignty: party.compass_position.SUV   // Sovereignty dimension (national-global)
                }
            }));
            console.log('Loaded', window.partyResults.length, 'party positions from API');
        }
    } catch (error) {
        console.error('Error loading default party positions:', error);
    }
}

// Add axis labels dynamically to ensure they're on top
function addAxisLabels(compassId, dimX, dimY) {
    const compass = document.getElementById(compassId);
    if (!compass) return;
    
    // Remove existing axis labels
    compass.querySelectorAll('.axis-label').forEach(label => label.remove());
    
    // Define labels based on dimensions
    const labels = getAxisLabels(dimX, dimY);
    
    // Create and add labels
    Object.entries(labels).forEach(([position, {icon, text}]) => {
        const label = document.createElement('div');
        label.className = `axis-label axis-label-${position}`;
        label.innerHTML = `<span class="axis-icon">${icon}</span><span>${text}</span>`;
        label.style.cssText = 'z-index: 99999 !important; position: absolute !important;';
        compass.appendChild(label);
    });
}

// Get axis labels for dimensions
function getAxisLabels(dimX, dimY) {
    const labels = {};
    
    // Set labels based on dimensions
    if (dimX === 'society' && dimY === 'economy') {
        labels.top = {icon: '⚙️', text: 'Plánovaná ekonomika'};
        labels.bottom = {icon: '💰', text: 'Volný trh'};
        labels.left = {icon: '🌈', text: 'Liberální'};
        labels.right = {icon: '⛪', text: 'Konzervativní'};
    } else if (dimX === 'state' && dimY === 'sovereignty') {
        labels.top = {icon: '👤', text: 'Individuální/Národní'};
        labels.bottom = {icon: '🌍', text: 'Kolektivní/EU'};
        labels.left = {icon: '🏛️', text: 'Decentralizace'};
        labels.right = {icon: '👑', text: 'Centralizace'};
    }
    
    return labels;
}

// Render a single compass
function renderCompass(compassId, dimX, dimY) {
    console.log(`DEBUG renderCompass: Rendering ${compassId} (${dimX} x ${dimY})`);
    const compass = document.getElementById(compassId);
    if (!compass) {
        console.log(`DEBUG renderCompass: Element ${compassId} not found!`);
        return;
    }
    
    // Clear existing content (except axes)
    compass.querySelectorAll('.party').forEach(p => p.remove());
    compass.querySelectorAll('.quadrant-match').forEach(q => q.remove());
    
    // Use party results from calculation or fallback to loaded parties
    const partiesToRender = window.partyResults || parties;
    console.log(`DEBUG renderCompass: Rendering ${partiesToRender?.length || 0} parties`);
    
    // Wait for layout to be ready
    setTimeout(() => {
        const compassWidth = compass.offsetWidth || 420;
        const compassHeight = compass.offsetHeight || 420;
        const centerX = compassWidth / 2;
        const centerY = compassHeight / 2;
        // Reduced scale for parties to fit within bounds
        const scale = Math.min(centerX, centerY) * 0.85;
        
        // Quadrant percentages removed - were confusing
        
        partiesToRender.forEach((party, index) => {
            // Handle both old and new data formats
            const position = party.compass_position || {};
            let xValue = position[dimX] || 0;
            let yValue = position[dimY] || 0;
            
            // Map values correctly based on dimension
            // When used as X-axis:
            // - Society: negative = liberal (LEFT), positive = conservative (RIGHT)
            // - State: negative = decentralized (LEFT), positive = centralized (RIGHT)
            // When used as Y-axis:
            // - Economy: negative = free market (BOTTOM), positive = planned economy (TOP)
            // - Sovereignty: negative = national (TOP), positive = global (BOTTOM)
            
            const x = xValue * scale + centerX;
            // Invert Y for different dimensions:
            // - Economy (EKO): needs inversion - positive (planned) should be UP
            // - Sovereignty (SUV): needs inversion - positive (global) should be DOWN
            let y;
            if (dimY === 'economy') {
                y = -yValue * scale + centerY;  // Invert: planned economy UP, free market DOWN
            } else if (dimY === 'sovereignty') {
                y = yValue * scale + centerY;   // Normal: national UP, global DOWN
            } else {
                y = yValue * scale + centerY;   // Default
            }
            
            const dot = document.createElement('div');
            const partyCode = party.code || party.party || `party-${index}`;
            const partyName = party.name || party.party || `Party ${index + 1}`;
            const isCoalition = party.type === 'coalition';
            
            // Add coalition-party class for coalition parties
            const classes = ['party', `party-${partyCode.toLowerCase().replace(/\s+/g, '-')}`];
            if (isCoalition) {
                classes.push('coalition-party');
            }
            dot.className = classes.join(' ');
            
            // CSS handles the actual size - we just need to center the dots
            // Coalition dots: 10px, Main dots: 16px (from CSS)
            const dotRadius = isCoalition ? 5 : 8;
            dot.style.left = `${x - dotRadius}px`;
            dot.style.top = `${y - dotRadius}px`;
            dot.style.background = getPartyColor(partyCode);
            dot.style.zIndex = '10';
            
            // Coalition parties should be hidden by default
            if (isCoalition) {
                dot.style.display = 'none';
            }
            
            // Coalition styling is handled by CSS class .coalition-party
            dot.setAttribute('data-party', partyCode);
            
            // Remove the static label - will only show tooltip on hover
            
            // Add tooltip outside of dot element
            const tooltip = document.createElement('div');
            tooltip.className = 'party-tooltip';
            tooltip.id = `tooltip-${compassId}-${partyCode}`;
            const tooltipText = `${partyName}${party.match ? ` (${party.match}%)` : ''}`;
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                bottom: ${compass.offsetHeight - y + 25}px;
                left: ${x}px;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.65rem;
                white-space: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                z-index: 99999 !important;
                font-weight: 400;
                text-align: center;
            `;
            
            compass.appendChild(tooltip);
            
            // Add hover interaction with legend
            dot.addEventListener('mouseenter', () => {
                dot.style.zIndex = '99998';
                const tooltip = document.getElementById(`tooltip-${compassId}-${partyCode}`);
                if (tooltip) tooltip.style.opacity = '1';
                highlightParty(partyCode);
            });
            dot.addEventListener('mouseleave', () => {
                dot.style.zIndex = '10';
                const tooltip = document.getElementById(`tooltip-${compassId}-${partyCode}`);
                if (tooltip) tooltip.style.opacity = '0';
                unhighlightParty(partyCode);
            });
            // Add click for persistent highlighting
            dot.addEventListener('click', () => togglePersistentHighlight(partyCode));
            
            compass.appendChild(dot);
        });
        
        // Re-add axis labels to ensure they're on top
        addAxisLabels(compassId, dimX, dimY);
    }, 100);
}

// Render legend
function renderLegend() {
    const legend = document.getElementById('legend');
    if (!legend) {
        console.error('Legend element not found');
        return;
    }
    
    legend.innerHTML = '';
    
    // Use party results or fallback
    const partiesToRender = window.partyResults || parties;
    console.log('Rendering legend with parties:', partiesToRender);
    
    // Separate coalition and main parties based on type from API
    const mainParties = [];
    const coalitionPartiesList = [];
    
    partiesToRender.forEach((party, index) => {
        // Check party type from API data
        if (party.type === 'coalition') {
            coalitionPartiesList.push({...party, index});
        } else {
            mainParties.push({...party, index});
        }
    });
    
    // Render main parties first
    mainParties.forEach((party) => {
        const item = createLegendItem(party, false);
        legend.appendChild(item);
    });
    
    // Create coalition section if there are coalition parties
    console.log('Coalition parties found:', coalitionPartiesList.length, coalitionPartiesList);
    if (coalitionPartiesList.length > 0) {
        // Create coalition section container
        const coalitionSection = document.createElement('div');
        coalitionSection.className = 'coalition-section';
        
        // Create toggle button
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'coalition-toggle';
        toggleDiv.innerHTML = `
            <span>Zobrazit jednotlivé strany z koalic</span>
            <span class="arrow">▼</span>
        `;
        console.log('Created coalition toggle element');
        
        // Create coalition parties container
        const coalitionContainer = document.createElement('div');
        coalitionContainer.className = 'coalition-parties';
        
        // Render coalition parties
        coalitionPartiesList.forEach((party) => {
            const item = createLegendItem(party, true);
            coalitionContainer.appendChild(item);
        });
        
        coalitionSection.appendChild(toggleDiv);
        coalitionSection.appendChild(coalitionContainer);
        legend.appendChild(coalitionSection);
        
        // Add toggle functionality
        toggleDiv.addEventListener('click', () => {
            toggleDiv.classList.toggle('expanded');
            coalitionContainer.classList.toggle('expanded');
            
            // Toggle visibility on compass - much simpler: just check for coalition-party class
            const isExpanded = coalitionContainer.classList.contains('expanded');
            const coalitionDots = document.querySelectorAll('.party.coalition-party');
            coalitionDots.forEach(dot => {
                dot.style.display = isExpanded ? '' : 'none';
            });
        });
    }
}

// Helper function to create legend item
function createLegendItem(party, isCoalition) {
    const item = document.createElement('div');
    const partyCode = party.code || party.party || `party-${party.index}`;
    const partyName = party.name || party.party || `Party ${party.index + 1}`;
    
    item.className = isCoalition ? 'legend-item coalition-party' : 'legend-item';
    item.setAttribute('data-party', partyCode);
    
    const color = document.createElement('div');
    color.className = 'legend-color';
    color.style.background = getPartyColor(partyCode);
    
    const name = document.createElement('div');
    name.className = 'legend-name';
    name.textContent = partyName;
    
    item.appendChild(color);
    item.appendChild(name);
    
    // Add hover interaction
    item.addEventListener('mouseenter', () => highlightParty(partyCode));
    item.addEventListener('mouseleave', () => unhighlightParty(partyCode));
    // Add click for persistent highlighting
    item.addEventListener('click', () => togglePersistentHighlight(partyCode));
    
    return item;
}

// Get party color
function getPartyColor(code) {
    // Specific party colors based on their branding and political position
    const partyColors = {
        // Libertarian parties - yellow shades
        'Voluntia': '#FFD700',           // Gold
        'Nevolte Urza.cz': '#FFC107',    // Amber
        
        // Progressive/liberal parties
        'Česká pirátská strana': '#000000',  // Black (Pirate party)
        'Volt Česko': '#502379',             // Purple (Volt brand)
        
        // Social democratic / left
        'ČSSD – Česká suverenita': '#FF6B35',  // Orange (SOCDEM)
        'Stačilo!': '#CC0000',                 // Red (Communist)
        'Levice': '#E53935',                   // Red
        
        // Conservative / nationalist
        'SPD': '#005CAA',                      // Blue (SPD brand)
        'ANO 2011': '#261E6A',                 // Dark blue (ANO brand)
        
        // Center-right coalition
        'Spolu (ODS–KDU–TOP09)': '#004B87',    // Blue
        'SPOLU': '#004B87',                    // Same as above
        
        // Liberal center
        'Starostové a nezávislí (STAN)': '#5D9C3B',  // Green
        
        // Regionalist
        'Moravské zemské hnutí': '#FFB400',    // Gold-yellow
        
        // Other national conservative
        'Přísaha': '#1C4E8B',                  // Dark blue
        'Česká republika na 1. místě': '#8B0000',  // Dark red
        'Švýcarská demokracie': '#FF0000',     // Red (Swiss flag)
        
        // Monarchist
        'Koruna česká (monarchisté)': '#6B3AA6',  // Royal purple
        
        // New/other parties
        'Motoristé sobě': '#4CAF50',          // Green (motorists)
        'Výzva 2025': '#2196F3',              // Blue
        'SMS – Stát má sloužit': '#607D8B',   // Blue-grey
        'Rebelové': '#FF5722',                // Deep orange
        'Hnutí Generace': '#9C27B0',          // Purple
        'Hnutí Kruh': '#00BCD4',              // Cyan
        'Hnutí občanů a podnikatelů': '#8BC34A',  // Light green
        'Volte Pravý Blok (Cibulka)': '#795548',  // Brown
        'Jasný signál nezávislých (JaSaN)': '#FF9800',  // Orange
        'Balbínova poetická strana': '#E91E63'   // Pink (artistic)
    };
    
    // Return specific color if defined, otherwise generate based on position
    if (partyColors[code]) {
        return partyColors[code];
    }
    
    // Debug: log what codes are being requested
    console.log('Color requested for code:', code, 'Not found in partyColors');
    
    // Fallback: generate color based on hash
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    };
    
    // Fallback to old colors system if still not found
    const oldColors = {
        'ANO': '#261060',
        'SPOLU': '#0056A7',
        'SPD': '#E31E24',
        'PIRATI': '#000000',
        'STAN': '#5D9C59',
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
        'VOLT': '#502379',
        'URZA': '#FFD700',                    // Yellow
        
        // Coalition parties - different shades of parent coalition colors
        // SPOLU coalition (blue shades)
        'ODS': '#87CEEB',                     // Light blue (světle modrá)
        'ODS_(OBČANSKÁ_DEMOKR': '#87CEEB',    // ODS with data code
        'ODS (Občanská demokratická strana)': '#87CEEB',  // ODS with parentheses
        'Občanská demokratická strana': '#87CEEB',  // ODS full name
        'TOP09': '#3366CC',                   // Medium blue
        'TOP 09': '#3366CC',                  // Medium blue
        'KDU-ČSL': '#6699FF',                 // Lighter blue
        'KDU': '#6699FF',                     // Lighter blue
        
        // REPUBLIKA coalition (similar to SPD - dark blue)
        'TRIKOLORA': '#003366',               // Very dark blue
        'PRO': '#004080',                     // Different dark blue shade
        'PRO Jindřicha Rajchla': '#004080',   // Different dark blue shade
        'SVOBODNI': '#2F4F2F',                // Dark green (tmavší zelená)
        'Svobodní': '#2F4F2F',                // Dark green (tmavší zelená)
        
        // STAČILO! coalition (red/leftist colors)
        'KSČM': '#CC0000',                    // Red (communist)
        'KSCM': '#CC0000',                    // Red (communist)
        'KSČM_(KOMUNISTICKÁ_S': '#CC0000',    // KSČM with data code
        'KSČM (Komunistická strana Čech a Moravy)': '#CC0000', // KSČM with parentheses
        'SOCDEM': '#FF8C00',                  // Orange (SOCDEM oranžová)
        'SOCDEM_(SOCIÁLNÍ_DEM': '#FF8C00',    // SOCDEM with data code
        'SOCDEM (Sociální demokracie)': '#FF8C00', // SOCDEM with parentheses
        'Sociální demokracie': '#FF8C00',     // SOCDEM full name
        'Strana zelených': '#228B22',         // Green (zelená)
        'ZELENI': '#228B22',                  // Green (zelená)
        'Zelení': '#228B22',                  // Green alternative name
        
        // ČESKÁ SUVERENITA coalition (brown shades)
        'ČSNS': '#8B4513',                    // Brown
        'CSNS': '#8B4513',                    // Brown
        'SD-SN': '#704214',                   // Darker brown
        'SDSN': '#704214'                     // Darker brown
    };
    
    // Return the color or a default color
    const normalizedCode = code.replace(/\s+/g, '-').toUpperCase();
    return partyColors[code] || partyColors[normalizedCode] || partyColors[code.toUpperCase()] ||
           oldColors[code] || oldColors[normalizedCode] || oldColors[code.toUpperCase()] ||
           `hsl(${Math.abs(code.charCodeAt(0) * 137) % 360}, 70%, 50%)`;
}

// Highlight party in both compass and legend
// Track single persistently highlighted party
let currentPersistentHighlight = null;

function highlightParty(code) {
    document.querySelectorAll(`[data-party="${code}"]`).forEach(el => {
        el.classList.add('highlight');
        el.style.zIndex = '99998';
    });
    // Show tooltips in both compasses
    document.querySelectorAll(`[id^="tooltip-"][id$="-${code}"]`).forEach(tooltip => {
        tooltip.style.opacity = '1';
    });
}

// Remove highlight from party (only if not persistent)
function unhighlightParty(code) {
    if (currentPersistentHighlight !== code) {
        document.querySelectorAll(`[data-party="${code}"]`).forEach(el => {
            el.classList.remove('highlight');
            el.style.zIndex = '10';
        });
        // Hide tooltips in both compasses
        document.querySelectorAll(`[id^="tooltip-"][id$="-${code}"]`).forEach(tooltip => {
            tooltip.style.opacity = '0';
        });
    }
}

// Toggle persistent highlight (only one at a time)
function togglePersistentHighlight(code) {
    // If clicking on currently highlighted party, remove highlight
    if (currentPersistentHighlight === code) {
        document.querySelectorAll(`[data-party="${currentPersistentHighlight}"]`).forEach(el => {
            el.classList.remove('highlight', 'persistent-highlight');
        });
        currentPersistentHighlight = null;
    } else {
        // Remove previous highlight if any
        if (currentPersistentHighlight) {
            document.querySelectorAll(`[data-party="${currentPersistentHighlight}"]`).forEach(el => {
                el.classList.remove('highlight', 'persistent-highlight');
            });
        }
        
        // Add new highlight
        currentPersistentHighlight = code;
        document.querySelectorAll(`[data-party="${code}"]`).forEach(el => {
            el.classList.add('highlight', 'persistent-highlight');
        });
    }
}

// Add user position to compass
function addUserPositionToCompass(userPosition, userStats) {
    // Remove any existing user position markers
    document.querySelectorAll('.user-position').forEach(el => el.remove());
    document.querySelectorAll('.user-uncertainty').forEach(el => el.remove());
    
    // Only add user position if we have actual position data
    if (!userPosition || Object.keys(userPosition).length === 0) {
        return;
    }
    
    // Add user position to both compasses with new axis combinations
    // Compass 1: Personal Freedom (Social) × Economic Freedom
    addUserDotToCompass('compass-eco-state', userPosition, 'society', 'economy', userStats);
    // Compass 2: Power Distribution (State) × Power Scope (Sovereignty)
    addUserDotToCompass('compass-soc-suv', userPosition, 'state', 'sovereignty', userStats);
}

// Add user dot to a specific compass
function addUserDotToCompass(compassId, position, dimX, dimY, stats) {
    const compass = document.getElementById(compassId);
    if (!compass) return;
    
    // Don't add anything if we don't have valid position data
    if (!position || position[dimX] === undefined || position[dimY] === undefined) return;
    
    const compassWidth = compass.offsetWidth || 420;
    const compassHeight = compass.offsetHeight || 420;
    const centerX = compassWidth / 2;
    const centerY = compassHeight / 2;
    // Scale adjusted to fit within compass bounds
    // Maximum party values seem to be around 1.5-2.0
    // We'll use a scale that ensures -2 to 2 fits within 90% of radius
    const scale = Math.min(centerX, centerY) * 0.85;
    
    let xValue = position[dimX];
    let yValue = position[dimY];
    
    // Clamp values to reasonable range
    xValue = Math.max(-2, Math.min(2, xValue));
    yValue = Math.max(-2, Math.min(2, yValue));
    
    // Same mapping as for parties
    const x = xValue * scale + centerX;
    let y;
    if (dimY === 'economy') {
        y = -yValue * scale + centerY;  // Invert: planned economy UP, free market DOWN
    } else if (dimY === 'sovereignty') {
        y = yValue * scale + centerY;   // Normal: national UP, global DOWN  
    } else {
        y = yValue * scale + centerY;   // Default
    }
    
    // Uncertainty circles removed - no longer showing dashed circles
    
    // Create user position marker - larger than regular dots
    const userDot = document.createElement('div');
    userDot.className = 'party user-position';
    userDot.style.left = `${x - 16}px`;
    userDot.style.top = `${y - 16}px`;
    userDot.style.width = '32px';
    userDot.style.height = '32px';
    userDot.style.background = 'rgba(255, 255, 255, 0.85)';
    userDot.style.border = '3px solid rgba(255, 255, 255, 0.9)';
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
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href !== '#compass') {
                const sectionId = href.slice(1); // Remove # from href
                showSection(sectionId);
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
    
    // Get party answers from stored data
    const partyAnswers = window.partyAnswersData && window.partyAnswersData[partyName];
    
    // Go through ALL questions from questionsData
    for (const question of questionsData) {
        const answer = answers[question.id];
        
        // Skip if user hasn't answered this question
        if (!answer || answer.value === null) continue;
        
        // Get actual party answer or estimate if not available
        let partyScore;
        if (partyAnswers && partyAnswers[question.id]) {
            // Convert from 1-5 scale to -2 to +2
            partyScore = partyAnswers[question.id] - 3;
        } else {
            // Fallback to estimation if no data
            partyScore = estimatePartyAnswer(party, question);
        }
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
    
    try {
        // Load parties from API to get correct data
        const response = await fetch('/.netlify/functions/api-parties');
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        // Combine main and coalition parties with type flag
        partiesData = [
            ...data.mainParties.map(p => ({...p, type: 'main'})),
            ...data.coalitionParties.map(p => ({...p, type: 'coalition'}))
        ];
        console.log('Parties data loaded from API:', partiesData.length, 'parties');
    } catch (error) {
        console.error('Error loading parties data:', error);
        partiesData = [];
    }
}

// Initialize parties data on load
document.addEventListener('DOMContentLoaded', () => {
    loadPartiesData();
});

// Test function for manual compass testing
window.testCompassPosition = function(economy, state, society, sovereignty, name = "Test") {
    const position = {
        economy: economy,
        state: state,
        society: society,
        sovereignty: sovereignty
    };
    
    // Save to localStorage for compass to read
    localStorage.setItem('userCompassPosition', JSON.stringify(position));
    localStorage.setItem('userDimensions', JSON.stringify(position));
    
    // Show compass section
    showCompass();
    
    // Wait a bit for compass to render, then add user position
    setTimeout(() => {
        addUserPositionToCompass(position, null);
        console.log(`✅ Testovací pozice "${name}" zobrazena v kompasu`);
        console.log('Ekonomika:', economy, '(levá = volný trh, pravá = státní kontrola)');
        console.log('Role státu:', state, '(nahoře = minimální, dole = silný)');
        console.log('Společnost:', society, '(nahoře = liberální, dole = konzervativní)');
        console.log('Suverenita:', sovereignty, '(nahoře = globální, dole = národní)');
    }, 100);
    
    return position;
};