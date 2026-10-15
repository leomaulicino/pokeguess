// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyALx2mCGjv5KXqqfp9MZcAj6onoqSQIh6c",
  authDomain: "pokeguess-f0c9c.firebaseapp.com",
  projectId: "pokeguess-f0c9c",
  storageBucket: "pokeguess-f0c9c.firebasestorage.app",
  messagingSenderId: "903283584612",
  appId: "1:903283584612:web:9bfdf43c355721270ff971"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
let currentUser = null;

let TOTAL_POKEMON = 1025; 
let CURRENT_MODE = ''; 
let pokemonData = {}; 
let searchArray = []; 
let typeMap = {}; 
const discovered = new Set(); 
const revealed = new Set(); 

const startScreen = document.getElementById('start-screen');
const authScreen = document.getElementById('auth-screen');
const gameWrapper = document.getElementById('game-wrapper');
const btnModeClassic = document.getElementById('btn-mode-classic');
const btnModeExpanded = document.getElementById('btn-mode-expanded');
const btnMainMenu = document.getElementById('btn-main-menu');
const gameTitleHeader = document.getElementById('game-title-header');

const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const togglePasswordBtn = document.getElementById('toggle-password');
const eyeOffIcon = document.getElementById('eye-off-icon');
const eyeOnIcon = document.getElementById('eye-on-icon');

const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnGuest = document.getElementById('btn-guest');

// Elementos do Perfil
const btnProfile = document.getElementById('btn-profile');
const profileModal = document.getElementById('profile-modal');
const closeProfileModal = document.getElementById('close-profile-modal');
const profileEmailInput = document.getElementById('profile-email');
const profilePasswordInput = document.getElementById('profile-password');
const toggleProfilePasswordBtn = document.getElementById('toggle-profile-password');
const profileEyeOffIcon = document.getElementById('profile-eye-off-icon');
const profileEyeOnIcon = document.getElementById('profile-eye-on-icon');
const btnUpdateProfile = document.getElementById('btn-update-profile');

const input = document.getElementById('guess-input');
const suggestionsUl = document.getElementById('suggestions');
const genFilter = document.getElementById('gen-filter');
const typeFilter = document.getElementById('type-filter');
const container = document.getElementById('pokedex-container');
const loading = document.getElementById('loading');
const counterDisplay = document.getElementById('counter'); 
const toast = document.getElementById('toast');
const timerDisplay = document.getElementById('timer');
const btnPauseResume = document.getElementById('btn-pause-resume');

const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebarBtn = document.getElementById('close-sidebar');
const btnReset = document.getElementById('btn-reset');
const btnReveal = document.getElementById('btn-reveal');
const btnTrophies = document.getElementById('btn-trophies');
const toggleHelp = document.getElementById('toggle-help');
const toggleSilhouettes = document.getElementById('toggle-silhouettes');
const toggleShiny = document.getElementById('toggle-shiny'); 

const trophiesModal = document.getElementById('trophies-modal');
const closeModal = document.getElementById('close-modal');
const trophiesGrid = document.getElementById('trophies-grid');
const trophyStatusMsg = document.getElementById('trophy-status-msg');
const trophyCounterDisplay = document.getElementById('trophy-counter-display');
const achToast = document.getElementById('achievement-toast');
const achNameDisplay = document.getElementById('ach-name');

const joyContainer = document.getElementById('joy-container');
const joyText = document.getElementById('joy-text');
const joyNextBtn = document.getElementById('joy-next-btn');

let toastTimeout;
let achTimeout;
let timerInterval;
let secondsElapsed = 0;
let isRunValidForAchievements = true;
let timerStarted = false; 
let hasUsedAssistance = false; 
let isPaused = false;

let currentDialogues = [];
let currentDialogueIndex = 0;

const dialoguesIntro = [
    "Olá! Bem-vindo ao Centro Pokémon! ...digo, ao Pokéguess!",
    "Seu objetivo é tentar adivinhar o nome de todos os Pokémon.",
    "Use o menu no canto superior esquerdo se precisar de dicas ou quiser ver seus troféus.",
    "Boa sorte, Treinador! Estarei torcendo por você!"
];

const dialoguesCompletion = [
    "Parabéns! Você conseguiu registrar todos os Pokémon no sistema!",
    "Foi um trabalho duro, mas você provou ser um excelente pesquisador Pokémon!",
    "Volte sempre que quiser testar seus conhecimentos novamente!"
];

const dialoguesPlatinum = [
    "Uau! Uma verdadeira Lenda Viva! Você platinou o modo perfeitamente!",
    "Nenhuma ajuda, nenhum atalho... Sua dedicação é absolutamente inspiradora!",
    "O Professor Carvalho ficaria imensamente orgulhoso de você. Parabéns pela Platina!"
];

// --- VARIÁVEL TOTALS ---
const totals = { gen: {}, type: {} }; 

// --- ESTRUTURA SEPARADA DE CONQUISTAS ---
const achievements = {
    gen: {}, 
    type: {}, 
    time: {
        arrancada: { id: 'time-arrancada', name: 'Arrancada Inicial', desc: 'Descubra 100 Pokémon em menos de 5 min.', unlocked: false },
        kanto: { id: 'time-kanto', name: 'Kanto Express', desc: 'Descubra todos de Kanto em menos de 10 min.', unlocked: false },
        mestreClassic: { id: 'time-mestre-classic', name: 'Speedrunner (Clássico)', desc: 'Descubra os 1025 Base em menos de 1 hora.', unlocked: false },
        mestreExpanded: { id: 'time-mestre-expanded', name: 'Speedrunner (Absoluto)', desc: 'Descubra todos do jogo em menos de 1 hora e meia.', unlocked: false }
    }, 
    special: {
        primeirosPassos: { id: 'special-primeiros', name: 'Primeiros Passos', desc: 'Descubra os seus primeiros 10 Pokémon.', unlocked: false },
        todosClassic: { id: 'special-todos-classic', name: 'Mestre (Clássico)', desc: 'Descubra todos os 1025 Pokémon Base.', unlocked: false },
        todosExpanded: { id: 'special-todos-expanded', name: 'Mestre (Absoluto)', desc: 'Descubra absolutamente todos os Pokémon.', unlocked: false },
        hardcoreClassic: { id: 'special-hardcore-classic', name: 'Lenda Viva (Clássico)', desc: 'Descubra os 1025 Base sem ajudas.', unlocked: false },
        hardcoreExpanded: { id: 'special-hardcore-expanded', name: 'Lenda Viva (Absoluto)', desc: 'Descubra todos do jogo sem ajudas.', unlocked: false }
    }, 
    platinum: {
        classic: { id: 'plat-classic', name: 'Platina Clássica', desc: 'Conquiste todos os troféus do Modo Clássico.', unlocked: false },
        expanded: { id: 'plat-expanded', name: 'Platina Absoluta', desc: 'Conquiste todos os troféus do Modo Absoluto.', unlocked: false }
    }
}; 

// Inicializa as 10 gerações permanentemente para o modal
const regioesNomes = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea", "Formas Extras"];
for (let i = 1; i <= 10; i++) {
    totals.gen[i] = 0;
    achievements.gen[i] = {
        id: `gen-${i}`,
        name: i === 10 ? 'Mestre das Formas' : `Mestre de ${regioesNomes[i-1]}`,
        desc: i === 10 ? 'Descubra todas as Formas Extras' : `Descubra todos da Geração ${i}`,
        unlocked: false
    };
}

const tiposTraduzidos = {
    normal: "Normal", fighting: "Lutador", flying: "Voador", poison: "Venenoso", 
    ground: "Terrestre", rock: "Pedra", bug: "Inseto", ghost: "Fantasma", 
    steel: "Aço", fire: "Fogo", water: "Água", grass: "Planta", 
    electric: "Elétrico", psychic: "Psíquico", ice: "Gelo", dragon: "Dragão", 
    dark: "Sombrio", fairy: "Fada"
};
Object.keys(tiposTraduzidos).forEach(t => {
    totals.type[t] = 0;
    achievements.type[t] = {
        id: `type-${t}`,
        name: `Especialista: ${tiposTraduzidos[t]}`,
        desc: `Descubra todos do tipo ${tiposTraduzidos[t]}`,
        unlocked: false
    };
});

// --- ATUALIZADOR DO CONTADOR DE TROFÉUS ---
function updateTrophyCounter() {
    let totalTrophies = 0;
    let unlockedTrophies = 0;

    ['special', 'time', 'gen', 'type'].forEach(cat => {
        if (achievements[cat]) {
            Object.values(achievements[cat]).forEach(ach => {
                totalTrophies++;
                if (ach.unlocked) unlockedTrophies++;
            });
        }
    });
    if (achievements.platinum) {
        totalTrophies += 2;
        if (achievements.platinum.classic.unlocked) unlockedTrophies++;
        if (achievements.platinum.expanded.unlocked) unlockedTrophies++;
    }

    if (trophyCounterDisplay) {
        trophyCounterDisplay.textContent = `Conquistas Desbloqueadas: ${unlockedTrophies} / ${totalTrophies}`;
    }
}

// --- ALTERNÂNCIA DE VISIBILIDADE DA SENHA (LOGIN E PERFIL) ---
togglePasswordBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOffIcon.style.display = 'none';
        eyeOnIcon.style.display = 'block';
    } else {
        passwordInput.type = 'password';
        eyeOffIcon.style.display = 'block';
        eyeOnIcon.style.display = 'none';
    }
});

toggleProfilePasswordBtn.addEventListener('click', () => {
    if (profilePasswordInput.type === 'password') {
        profilePasswordInput.type = 'text';
        profileEyeOffIcon.style.display = 'none';
        profileEyeOnIcon.style.display = 'block';
    } else {
        profilePasswordInput.type = 'password';
        profileEyeOffIcon.style.display = 'block';
        profileEyeOnIcon.style.display = 'none';
    }
});

// --- AUTENTICAÇÃO E PERFIL ---
btnRegister.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        showToast("Preencha o e-mail e a palavra-passe!");
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            authScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            showToast("Conta criada com sucesso!", true);
        })
        .catch((error) => {
            console.error("Erro no Registo:", error);
            showToast("Erro: " + error.code);
        });
});

btnLogin.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
        showToast("Preencha o e-mail e a palavra-passe!");
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            currentUser = userCredential.user;
            authScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            showToast("Login efetuado com sucesso!", true);
        })
        .catch((error) => {
            console.error("Erro no Login:", error);
            showToast("Erro: " + error.code);
        });
});

btnGuest.addEventListener('click', () => {
    currentUser = null;
    authScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    showToast("Modo visitante ativado.");
});

btnProfile.addEventListener('click', () => {
    if (!currentUser) {
        showToast("Modo visitante não possui perfil configurado.");
        return;
    }
    profileEmailInput.value = currentUser.email || '';
    profilePasswordInput.value = '';
    profileModal.classList.remove('hidden');
    toggleSidebar();
});

closeProfileModal.addEventListener('click', () => {
    profileModal.classList.add('hidden');
});

btnUpdateProfile.addEventListener('click', () => {
    if (!currentUser) return;
    const newEmail = profileEmailInput.value.trim();
    const newPassword = profilePasswordInput.value.trim();

    let updates = [];
    if (newEmail && newEmail !== currentUser.email) updates.push(currentUser.updateEmail(newEmail));
    if (newPassword && newPassword.length >= 6) updates.push(currentUser.updatePassword(newPassword));

    if (updates.length === 0) {
        showToast("Nenhuma alteração detetada.");
        return;
    }

    Promise.all(updates).then(() => {
        showToast("Perfil atualizado com sucesso!", true);
        profileModal.classList.add('hidden');
    }).catch((error) => {
        console.error("Erro ao atualizar perfil:", error);
        showToast("Erro: Por segurança, faça login novamente para atualizar dados.");
    });
});

function saveUserData() {
    if (!currentUser) return;
    let unlockedIds = [];
    ['special', 'time', 'gen', 'type'].forEach(cat => {
        if (achievements[cat]) {
            Object.values(achievements[cat]).forEach(ach => {
                if (ach.unlocked) unlockedIds.push(ach.id);
            });
        }
    });
    if (achievements.platinum.classic.unlocked) unlockedIds.push(achievements.platinum.classic.id);
    if (achievements.platinum.expanded.unlocked) unlockedIds.push(achievements.platinum.expanded.id);

    db.collection('users').doc(currentUser.uid).set({
        achievements: unlockedIds
    }, { merge: true }).catch(err => console.error("Erro ao salvar conquistas:", err));
}

function loadUserData() {
    if (!currentUser) return;
    db.collection('users').doc(currentUser.uid).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.achievements && Array.isArray(data.achievements)) {
                data.achievements.forEach(achId => {
                    ['special', 'time', 'gen', 'type'].forEach(cat => {
                        if (achievements[cat]) {
                            Object.values(achievements[cat]).forEach(ach => {
                                if (ach.id === achId) {
                                    ach.unlocked = true;
                                    const card = document.getElementById(`trophy-${ach.id}`);
                                    if (card) card.classList.add('unlocked');
                                }
                            });
                        }
                    });
                    if (achievements.platinum.classic.id === achId) {
                        achievements.platinum.classic.unlocked = true;
                        const card = document.getElementById(`trophy-${achievements.platinum.classic.id}`);
                        if (card) card.classList.add('unlocked');
                    }
                    if (achievements.platinum.expanded.id === achId) {
                        achievements.platinum.expanded.unlocked = true;
                        const card = document.getElementById(`trophy-${achievements.platinum.expanded.id}`);
                        if (card) card.classList.add('unlocked');
                    }
                });
                updateTrophyCounter();
            }
        }
    }).catch(err => console.error("Erro ao carregar conquistas:", err));
}

history.replaceState({ screen: 'menu' }, '', window.location.pathname);

window.addEventListener('popstate', (e) => {
    if (currentUser) {
        gameWrapper.classList.add('hidden');
        startScreen.classList.remove('hidden');
    } else {
        location.reload();
    }
});

btnMainMenu.addEventListener('click', () => {
    gameWrapper.classList.add('hidden');
    startScreen.classList.remove('hidden');
    sidebar.classList.remove('open');
    sidebarOverlay.classList.add('hidden');
    history.replaceState({ screen: 'menu' }, '', window.location.pathname);
});

btnModeClassic.addEventListener('click', () => startGame('classic'));
btnModeExpanded.addEventListener('click', () => startGame('expanded'));

function startGame(mode) {
    CURRENT_MODE = mode;
    history.pushState({ screen: 'game' }, '', '#jogando');
    startScreen.classList.add('hidden');
    gameWrapper.classList.remove('hidden');
    
    const headerElement = document.querySelector('header');
    headerElement.className = ''; 
    
    if (mode === 'classic') {
        gameTitleHeader.textContent = "Pokéguess Clássico";
        headerElement.classList.add('classic-mode');
    } else {
        gameTitleHeader.textContent = "Pokéguess Absoluto";
        headerElement.classList.add('expanded-mode');
    }
    
    initApp().then(() => {
        if (currentUser) loadUserData();
    });
}

function playJoyDialogue(dialogues) {
    currentDialogues = dialogues;
    currentDialogueIndex = 0;
    joyText.textContent = currentDialogues[currentDialogueIndex];
    joyContainer.classList.remove('hidden');
    joyContainer.style.display = 'flex';
    
    if (currentDialogues.length > 1) {
        joyNextBtn.textContent = "Continuar ▼";
    } else {
        joyNextBtn.textContent = "Fechar ✖";
    }
}

joyNextBtn.addEventListener('click', () => {
    currentDialogueIndex++;
    if (currentDialogueIndex < currentDialogues.length) {
        joyText.textContent = currentDialogues[currentDialogueIndex];
        if (currentDialogueIndex === currentDialogues.length - 1) {
            joyNextBtn.textContent = "Fechar ✖";
        }
    } else {
        joyContainer.classList.add('hidden');
        joyContainer.style.display = 'none';
    }
});

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        timerDisplay.textContent = formatTime(secondsElapsed);
    }, 1000);
}

function togglePauseGame() {
    if (!timerStarted || !isRunValidForAchievements) return;

    if (!isPaused) {
        clearInterval(timerInterval);
        isPaused = true;
        timerDisplay.classList.add('paused');
        input.disabled = true;
        input.placeholder = "Jogo Pausado...";
        btnPauseResume.textContent = "►";
        showToast("Jogo Pausado!");
    } else {
        isPaused = false;
        timerDisplay.classList.remove('paused');
        input.disabled = false;
        input.placeholder = "Digite o nome de um Pokémon...";
        btnPauseResume.textContent = "❚❚";
        input.focus();
        startTimer();
        showToast("Jogo Retomado!");
    }
}

btnPauseResume.addEventListener('click', togglePauseGame);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.preventDefault(); 
        togglePauseGame();
    }
});

function getGeneration(id) {
    if (id > 10000) return 10; 
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 898) return 8;
    return 9;
}

function sanitizeName(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parsePokemonName(apiName) {
    const defaultSuffixes = [
        '-disguised', '-altered', '-normal', '-plant', '-land', 
        '-red-striped', '-standard', '-incarnate', '-ordinary', 
        '-aria', '-male', '-average', '-50', '-baile', '-midday', 
        '-solo', '-red-meteor', '-amped', '-ice', '-full-belly', 
        '-single-strike', '-zero', '-curly', '-two-segment', 
        '-chest', '-teal-mask', '-shield', '-hero', '-meteor', 
        '-family-of-four', '-green-plumage', '-bloodmoon'
    ];
    
    let cleanedApiName = apiName;
    for (let suffix of defaultSuffixes) {
        if (cleanedApiName.endsWith(suffix)) {
            cleanedApiName = cleanedApiName.substring(0, cleanedApiName.length - suffix.length);
            break;
        }
    }

    if (!cleanedApiName.includes('-')) return cleanedApiName.charAt(0).toUpperCase() + cleanedApiName.slice(1);
    
    let parts = cleanedApiName.split('-');
    let base = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    
    if (cleanedApiName.includes('-mega')) {
        let res = "Mega " + base;
        if (parts.includes('x')) res += " X";
        if (parts.includes('y')) res += " Y";
        return res;
    }
    if (cleanedApiName.includes('-alola')) return base + " Alola";
    if (cleanedApiName.includes('-galar')) return base + " Galar";
    if (cleanedApiName.includes('-hisui')) return base + " Hisui";
    if (cleanedApiName.includes('-paldea')) return base + " Paldea";
    if (cleanedApiName.includes('-gmax')) return "Gigantamax " + base;
    if (cleanedApiName.includes('primal')) return "Primal " + base;
    
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
}

function updateCounter() {
    const visibleCards = document.querySelectorAll('.pokemon-card:not(.hidden)');
    const discoveredCards = document.querySelectorAll('.pokemon-card.discovered:not(.hidden)');
    counterDisplay.textContent = `Descobertos: ${discoveredCards.length} / ${visibleCards.length}`;
}

function showToast(message, isSuccess = false) {
    toast.textContent = message;
    toast.style.backgroundColor = isSuccess ? '#28a745' : '#d32f2f';
    toast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.classList.add('hidden'); }, 3000);
}

function showAchievementToast(name) {
    achNameDisplay.textContent = name;
    achToast.classList.remove('hidden');
    clearTimeout(achTimeout);
    achTimeout = setTimeout(() => { achToast.classList.add('hidden'); }, 4000);
}

function invalidateAchievements() {
    if (isRunValidForAchievements) {
        isRunValidForAchievements = false;
        trophyStatusMsg.textContent = "Modo Platinador Desativado: Você revelou Pokémon nesta partida. Reinicie para tentar novamente!";
        trophyStatusMsg.classList.add('failed');
    }
}

function renderTrophiesModal() {
    trophiesGrid.innerHTML = '';
    Object.values(achievements.special).forEach(ach => createTrophyCard(ach));
    Object.values(achievements.time).forEach(ach => createTrophyCard(ach));
    Object.values(achievements.gen).forEach(ach => createTrophyCard(ach));
    Object.values(achievements.type).forEach(ach => createTrophyCard(ach));
    
    createTrophyCard(achievements.platinum.classic, true);
    createTrophyCard(achievements.platinum.expanded, true);

    updateTrophyCounter();
}

function createTrophyCard(ach, isPlatinum = false) {
    const card = document.createElement('div');
    card.className = `trophy-card ${ach.unlocked ? 'unlocked' : ''} ${isPlatinum ? 'platinum' : ''}`;
    card.id = `trophy-${ach.id}`;
    
    let icon = isPlatinum ? '🏆' : '🏅';
    if (ach.id.includes('time')) icon = '⏱️';
    if (ach.id.includes('special')) icon = '🌟';
    
    card.innerHTML = `
        <div class="trophy-icon">${icon}</div>
        <div class="trophy-name">${ach.name}</div>
        <div class="trophy-desc">${ach.desc}</div>
    `;
    trophiesGrid.appendChild(card);
}

function unlockAchievement(ach) {
    if (ach.unlocked) return; 
    ach.unlocked = true;
    showAchievementToast(ach.name);
    const card = document.getElementById(`trophy-${ach.id}`);
    if (card) card.classList.add('unlocked');
    updateTrophyCounter();
    saveUserData();
}

function checkAchievements() {
    let justUnlocked = false;
    let unlockedAllThisTurn = false;
    let unlockedPlatinumThisTurn = false;
    
    const isClassic = CURRENT_MODE === 'classic';

    if (!achievements.special.primeirosPassos.unlocked && discovered.size >= 10) {
        unlockAchievement(achievements.special.primeirosPassos);
        justUnlocked = true;
    }

    if (discovered.size === TOTAL_POKEMON) {
        if (isClassic) {
            if (!achievements.special.todosClassic.unlocked) { unlockAchievement(achievements.special.todosClassic); justUnlocked = true; unlockedAllThisTurn = true; }
            if (isRunValidForAchievements && !achievements.special.hardcoreClassic.unlocked && !hasUsedAssistance) { unlockAchievement(achievements.special.hardcoreClassic); justUnlocked = true; }
            if (isRunValidForAchievements && !achievements.time.mestreClassic.unlocked && secondsElapsed <= 3600) { unlockAchievement(achievements.time.mestreClassic); justUnlocked = true; }
        } else {
            if (!achievements.special.todosExpanded.unlocked) { unlockAchievement(achievements.special.todosExpanded); justUnlocked = true; unlockedAllThisTurn = true; }
            if (isRunValidForAchievements && !achievements.special.hardcoreExpanded.unlocked && !hasUsedAssistance) { unlockAchievement(achievements.special.hardcoreExpanded); justUnlocked = true; }
            if (isRunValidForAchievements && !achievements.time.mestreExpanded.unlocked && secondsElapsed <= 5400) { unlockAchievement(achievements.time.mestreExpanded); justUnlocked = true; }
        }
    }

    if (isRunValidForAchievements && !achievements.time.arrancada.unlocked && discovered.size >= 100 && secondsElapsed <= 300) {
        unlockAchievement(achievements.time.arrancada); justUnlocked = true;
    }
    if (isRunValidForAchievements && !achievements.time.kanto.unlocked) {
        let countKanto = 0; discovered.forEach(id => { if (getGeneration(id) === 1) countKanto++; });
        if (countKanto === 151 && secondsElapsed <= 600) { unlockAchievement(achievements.time.kanto); justUnlocked = true; }
    }

    const numGens = isClassic ? 9 : 10;
    for (let i = 1; i <= numGens; i++) {
        if (!achievements.gen[i].unlocked && totals.gen[i] > 0) {
            let count = 0; discovered.forEach(id => { if (getGeneration(id) === i) count++; });
            if (count === totals.gen[i]) { unlockAchievement(achievements.gen[i]); justUnlocked = true; }
        }
    }

    Object.keys(totals.type).forEach(t => {
        if (totals.type[t] > 0 && !achievements.type[t].unlocked) {
            let count = 0; discovered.forEach(id => { if (typeMap[id] && typeMap[id].includes(t)) count++; });
            if (count === totals.type[t]) { unlockAchievement(achievements.type[t]); justUnlocked = true; }
        }
    });

    if (justUnlocked) {
        const allTypes = Object.values(achievements.type).every(a => a.unlocked);
        
        if (!achievements.platinum.classic.unlocked) {
            let allClassicGens = true; for(let i=1; i<=9; i++) { if(!achievements.gen[i].unlocked) allClassicGens = false; }
            if (allClassicGens && allTypes && achievements.special.todosClassic.unlocked && achievements.special.hardcoreClassic.unlocked && achievements.time.mestreClassic.unlocked) {
                unlockAchievement(achievements.platinum.classic);
                unlockedPlatinumThisTurn = true;
            }
        }
        
        if (!achievements.platinum.expanded.unlocked) {
            let allExpandedGens = true; for(let i=1; i<=10; i++) { if(!achievements.gen[i].unlocked) allExpandedGens = false; }
            if (allExpandedGens && allTypes && achievements.special.todosExpanded.unlocked && achievements.special.hardcoreExpanded.unlocked && achievements.time.mestreExpanded.unlocked) {
                unlockAchievement(achievements.platinum.expanded);
                unlockedPlatinumThisTurn = true;
            }
        }
    }

    if (unlockedPlatinumThisTurn) {
        setTimeout(() => playJoyDialogue(dialoguesPlatinum), 1500);
    } else if (unlockedAllThisTurn) {
        setTimeout(() => playJoyDialogue(dialoguesCompletion), 1500);
    }
}

async function fetchPokemonData() {
    const typesRes = await fetch('https://pokeapi.co/api/v2/type');
    const typesRaw = await typesRes.json();
    
    if(typeFilter.options.length === 1) {
        typesRaw.results.forEach(t => {
            if(t.name === 'unknown' || t.name === 'stellar') return; 
            const option = document.createElement('option');
            option.value = t.name;
            option.textContent = tiposTraduzidos[t.name] || t.name;
            typeFilter.appendChild(option);
            totals.type[t.name] = 0;
        });
    } else {
        Object.keys(totals.type).forEach(t => totals.type[t] = 0);
    }

    const fetchTypePromises = typesRaw.results.map(async (t) => {
        if(t.name === 'unknown' || t.name === 'stellar') return; 
        const tRes = await fetch(t.url);
        const tData = await tRes.json();
        tData.pokemon.forEach(p => {
            const pid = parseInt(p.pokemon.url.split('/').slice(-2, -1)[0]);
            if(!typeMap[pid]) typeMap[pid] = [];
            typeMap[pid].push(t.name);
        });
    });
    
    await Promise.all(fetchTypePromises);
    
    const limit = CURRENT_MODE === 'classic' ? 1025 : 10000;
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const rawData = await pokeRes.json();
    
    let finalList = [];
    
    rawData.results.forEach(p => {
        const id = parseInt(p.url.split('/').slice(-2, -1)[0]);
        const name = p.name;
        
        if (id <= 1025) {
            finalList.push({ id, name });
        } else if (CURRENT_MODE === 'expanded' && id > 10000) {
            if (name.includes('-mega') || name.includes('-alola') || 
                name.includes('-galar') || name.includes('-hisui') || 
                name.includes('-paldea') || name.includes('-gmax') || 
                name.includes('primal')) {
                if (!name.includes('totem') && !name.includes('cap') && !name.includes('star')) {
                    finalList.push({ id, name });
                }
            }
        }
    });

    TOTAL_POKEMON = finalList.length;
    return finalList;
}

async function initApp() {
    container.innerHTML = '<div id="loading">A carregar a Base de Dados...</div>'; 
    pokemonData = {}; 
    searchArray = []; 
    discovered.clear();
    revealed.clear();
    
    try {
        const pokemonList = await fetchPokemonData();
        document.getElementById('loading').style.display = 'none'; 

        const numGens = CURRENT_MODE === 'classic' ? 9 : 10;
        
        if (CURRENT_MODE === 'expanded' && !document.querySelector('option[value="10"]')) {
            const opt = document.createElement('option');
            opt.value = "10";
            opt.textContent = "Formas Extras (Megas, Regionais)";
            genFilter.appendChild(opt);
        }

        for(let i = 1; i <= numGens; i++) {
            const section = document.createElement('div');
            section.className = 'gen-section';
            section.id = `gen-${i}`;
            
            const title = document.createElement('h2');
            title.className = 'gen-title';
            title.textContent = i === 10 ? 'Formas Extras' : `Geração ${i} - ${regioesNomes[i-1]}`;
            section.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'pokemon-grid';
            grid.id = `grid-${i}`;
            section.appendChild(grid);

            container.appendChild(section);
        }

        pokemonList.forEach((poke) => {
            const id = poke.id;
            const apiName = poke.name;
            const displayName = parsePokemonName(apiName);
            const cleanName = sanitizeName(displayName); 
            const rawCleanName = sanitizeName(apiName);
            
            const gen = getGeneration(id);
            const types = typeMap[id] || [];
            
            totals.gen[gen]++;
            types.forEach(t => { if (totals.type[t] !== undefined) totals.type[t]++; });

            pokemonData[cleanName] = id; 
            pokemonData[rawCleanName] = id; 
            searchArray.push({ id, cleanName, displayName });

            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.id = `poke-${id}`;
            card.dataset.gen = gen;
            card.dataset.types = types.join(',');

            card.addEventListener('click', () => {
                if (!discovered.has(id) && !revealed.has(id)) {
                    revealed.add(id);
                    card.classList.add('revealed');
                    invalidateAchievements();
                    updateCounter();
                }
            });

            const isShiny = toggleShiny.checked;
            const folder = isShiny ? 'shiny/' : '';

            const img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${folder}${id}.png`;
            img.alt = "Pokemon Misterioso";
            img.loading = "lazy"; 
            
            const info = document.createElement('div');
            info.className = 'pokemon-info';
            let idText = id > 10000 ? "⭐" : `#${id}`;
            info.innerHTML = `<strong>${idText}</strong><br>${displayName}`;

            card.appendChild(img);
            card.appendChild(info);

            document.getElementById(`grid-${gen}`).appendChild(card);
        });

        renderTrophiesModal();
        updateCounter();

        setTimeout(() => {
            playJoyDialogue(dialoguesIntro);
        }, 800);

    } catch (e) {
        console.error("Erro:", e);
        loading.textContent = "Erro ao carregar dados. Aguarde um momento e recarregue a página.";
    }
}

function processDiscovery(id) {
    if (!timerStarted) {
        timerStarted = true;
        secondsElapsed = 0;
        timerDisplay.textContent = "00:00";
        startTimer();
    }
    
    discovered.add(id);
    const card = document.getElementById(`poke-${id}`);
    card.classList.add('discovered'); 
    
    input.value = ''; 
    suggestionsUl.classList.add('hidden');
    
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    updateCounter();
    checkAchievements();
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('hidden');
}

menuBtn.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
sidebarOverlay.addEventListener('click', toggleSidebar);

toggleHelp.addEventListener('change', (e) => {
    if (e.target.checked) hasUsedAssistance = true;
});

toggleSilhouettes.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.remove('no-silhouettes');
        hasUsedAssistance = true;
    } else {
        document.body.classList.add('no-silhouettes');
    }
});

toggleShiny.addEventListener('change', (e) => {
    const isShiny = e.target.checked;
    const cards = document.querySelectorAll('.pokemon-card img');
    
    cards.forEach(img => {
        const id = img.parentElement.id.split('-')[1];
        if (isShiny) {
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
        } else {
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        }
    });
});

input.addEventListener('input', (e) => {
    if (isPaused) return;

    const guess = sanitizeName(e.target.value);
    suggestionsUl.innerHTML = '';
    
    if (guess.length === 0) {
        suggestionsUl.classList.add('hidden');
        return;
    }

    if (pokemonData[guess]) {
        const id = pokemonData[guess];
        if (revealed.has(id)) return; 
        if (!discovered.has(id)) {
            processDiscovery(id);
            return; 
        }
    }

    if (toggleHelp.checked) {
        const matches = searchArray.filter(p => p.cleanName.startsWith(guess)).slice(0, 8); 

        if (matches.length > 0) {
            suggestionsUl.classList.remove('hidden');
            
            matches.forEach(match => {
                const isDisc = discovered.has(match.id);
                const isRev = revealed.has(match.id);
                const li = document.createElement('li');
                
                if(isDisc || isRev) li.classList.add('already-discovered');
                
                let statusText = '';
                if (isDisc) statusText = '<strong>(Descoberto)</strong>';
                if (isRev) statusText = '<strong>(Revelado)</strong>';
                
                li.innerHTML = `
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${match.id}.png" alt="${match.displayName}">
                    <span>${match.displayName} ${statusText}</span>
                `;
                
                li.onclick = () => {
                    if(isDisc) {
                        showToast(`O Pokémon ${match.displayName} já foi descoberto!`);
                    } else if (isRev) {
                        showToast(`O Pokémon ${match.displayName} já foi revelado e não conta pontos.`);
                    } else {
                        processDiscovery(match.id);
                    }
                    input.value = '';
                    suggestionsUl.classList.add('hidden');
                };
                
                suggestionsUl.appendChild(li);
            });
        } else {
            suggestionsUl.classList.add('hidden');
        }
    } else {
        suggestionsUl.classList.add('hidden');
    }
});

input.addEventListener('keydown', (e) => {
    if (isPaused) return;

    if (e.key === 'Enter') {
        const guess = sanitizeName(input.value);
        if (pokemonData[guess]) {
            const id = pokemonData[guess];
            let displayName = searchArray.find(p => p.id === id).displayName;
            if (discovered.has(id)) {
                showToast(`O Pokémon ${displayName} já foi descoberto!`);
                input.value = '';
                suggestionsUl.classList.add('hidden');
            } else if (revealed.has(id)) {
                showToast(`O Pokémon ${displayName} já foi revelado e não conta pontos.`);
                input.value = '';
                suggestionsUl.classList.add('hidden');
            }
        }
    }
});

document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionsUl.contains(e.target)) {
        suggestionsUl.classList.add('hidden');
    }
});

function applyFilters() {
    const selectedGen = genFilter.value;
    const selectedType = typeFilter.value;

    const cards = document.querySelectorAll('.pokemon-card');
    
    cards.forEach(card => {
        const pokeGen = card.dataset.gen;
        const pokeTypes = card.dataset.types.split(',');

        const matchGen = selectedGen === 'all' || selectedGen === pokeGen;
        const matchType = selectedType === 'all' || pokeTypes.includes(selectedType);

        if (matchGen && matchType) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    const numGens = CURRENT_MODE === 'classic' ? 9 : 10;
    for(let i = 1; i <= numGens; i++) {
        const section = document.getElementById(`gen-${i}`);
        if(section) {
            const visibleCards = section.querySelectorAll('.pokemon-card:not(.hidden)');
            if(visibleCards.length === 0) {
                section.classList.add('hidden');
            } else {
                section.classList.remove('hidden');
            }
        }
    }
    updateCounter();
}

genFilter.addEventListener('change', applyFilters);
typeFilter.addEventListener('change', applyFilters);

btnReset.addEventListener('click', () => {
    discovered.clear();
    revealed.clear();
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.classList.remove('discovered', 'revealed');
    });
    
    isRunValidForAchievements = true;
    timerStarted = false;
    hasUsedAssistance = false;
    isPaused = false;
    
    toggleHelp.checked = false;
    toggleSilhouettes.checked = false;
    document.body.classList.add('no-silhouettes');
    
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerDisplay.textContent = "00:00";
    timerDisplay.classList.remove('paused');
    
    input.disabled = false;
    input.placeholder = "Digite o nome de um Pokémon...";
    btnPauseResume.textContent = "❚❚";
    
    trophyStatusMsg.textContent = "Modo Platinador Ativo: Não revele nenhum Pokémon!";
    trophyStatusMsg.classList.remove('failed');
    
    // NOTA: Os troféus já conquistados NÃO são apagados aqui. 
    // O reset limpa apenas a partida atual, preservando as conquistas guardadas!
    renderTrophiesModal();

    input.value = '';
    suggestionsUl.classList.add('hidden');
    updateCounter();
    toggleSidebar();
    showToast("A partida foi reiniciada com sucesso!", true);
});

btnReveal.addEventListener('click', () => {
    const visibleCards = document.querySelectorAll('.pokemon-card:not(.hidden):not(.discovered):not(.revealed)');
    if (visibleCards.length === 0) {
        showToast("Não há Pokémon ocultos nesta seleção.");
        return;
    }
    visibleCards.forEach(card => {
        const id = parseInt(card.id.split('-')[1]);
        revealed.add(id);
        card.classList.add('revealed');
    });
    invalidateAchievements();
    updateCounter();
    toggleSidebar();
});

btnTrophies.addEventListener('click', () => {
    trophiesModal.classList.remove('hidden');
    toggleSidebar();
});

closeModal.addEventListener('click', () => {
    trophiesModal.classList.add('hidden');
});