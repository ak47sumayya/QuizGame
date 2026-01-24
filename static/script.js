// 1. Global Audio Objects
const bgMusic = new Audio(window.location.origin + '/static/sounds/bg-music.mp3');
const startSound = new Audio(window.location.origin + '/static/sounds/start.mp3');
const winSound = new Audio(window.location.origin + '/static/sounds/win.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.2;

// 2. Music Resume Function
const resumeBG = () => {
    if (sessionStorage.getItem('quizMusicActive') === 'true') {
        bgMusic.play().catch(() => {
            console.log("Waiting for user interaction...");
        });
    }
};

// Start Experience (Welcome Page Button)
function startQuizExperience() {
    startSound.play();
    sessionStorage.setItem('quizMusicActive', 'true');
    resumeBG();
}

document.addEventListener('DOMContentLoaded', () => {
    
    // A. Page load hote hi koshish karo
    resumeBG();

    // B. Sab se bada FIX: Naye page par user kahin bhi click kare (jaise MCQ select kare), 
    // music foran start ho jayega.
    window.addEventListener('click', resumeBG, { once: true });
    window.addEventListener('touchstart', resumeBG, { once: true });

    // C. Form submission ya Category change par state maintain rakhen
    const allLinks = document.querySelectorAll('a, button, .category-card');
    allLinks.forEach(item => {
        item.addEventListener('click', () => {
            // Click karte waqt hi state confirm kar dein
            if (!document.querySelector('.result-container')) {
                sessionStorage.setItem('quizMusicActive', 'true');
            }
        });
    });
    // --- 1. GREEN/RED FLASH LOGIC (Sab se Pehle) ---
    const lastResultElement = document.getElementById('lastResult');
    if (lastResultElement) {
        const lastResult = lastResultElement.value;
        if (lastResult === 'correct') {
            document.body.classList.add('correct-flash');
            setTimeout(() => document.body.classList.remove('correct-flash'), 1000);
        } 
        else if (lastResult === 'wrong') {
            document.body.classList.add('wrong-flash');
            setTimeout(() => document.body.classList.remove('wrong-flash'), 1000);
        }
    }

    // D. MCQ Page: Jab user option select kare tab sound aur BG music dono handle hon
    const options = document.querySelectorAll('.option-input');
    options.forEach(opt => {
        opt.addEventListener('change', () => {
            startSound.currentTime = 0;
            startSound.play();
            resumeBG(); // Is click se browser audio allow kar dega
        });
    });

    // E. Result Page Logic
    if (document.querySelector('.result-container')) {
        sessionStorage.removeItem('quizMusicActive'); 
        bgMusic.pause();
        winSound.play();
        if (typeof createConfetti === 'function') createConfetti();
    }
});

// Confetti Function (Same as yours)
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `position: fixed; width: 10px; height: 10px; z-index: 9999; background-color: ${colors[Math.floor(Math.random() * colors.length)]}; left: ${Math.random() * 100}%; top: -20px; pointer-events: none;`;
        document.body.appendChild(confetti);
        confetti.animate([{ transform: 'translateY(0) rotate(0)', opacity: 1 }, { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }], { duration: 2500 });
        setTimeout(() => confetti.remove(), 4000);
    }
}