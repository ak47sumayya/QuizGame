// 1. Audio Objects
const startSound = new Audio('/static/sounds/start.mp3');
const bgMusic = new Audio('/static/sounds/bg-music.mp3');
const winSound = new Audio('/static/sounds/win.mp3');
const correctSound = new Audio('/static/sounds/correct.mp3');
const wrongSound = new Audio('/static/sounds/wrong.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.2; 

// Button click par call hone wala function
function startQuizExperience() {
    startSound.play();
    bgMusic.play().then(() => {
        // Save state so next pages know music should be playing
        sessionStorage.setItem('quizMusicActive', 'true');
    }).catch(e => console.log("Music waiting for interaction"));
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. BACKGROUND MUSIC AUTO-RESUME ---
    // Agar music pehle start ho chuki hai, to agle page par khud chalao
    if (sessionStorage.getItem('quizMusicActive') === 'true' && !document.querySelector('.result-container')) {
        bgMusic.play().catch(() => {
            // Agar browser block kare, to screen par kahin bhi click hote hi chala do
            document.body.addEventListener('click', () => {
                bgMusic.play();
            }, { once: true });
        });
    }

    // --- B. FEEDBACK LOGIC (Green/Red Flash) ---
    const lastResultElement = document.getElementById('lastResult');
    if (lastResultElement) {
        const lastResult = lastResultElement.value;
        if (lastResult === 'correct') {
            correctSound.play();
            document.body.classList.add('correct-flash'); // CSS class use karein
            setTimeout(() => document.body.classList.remove('correct-flash'), 1000);
        } 
        else if (lastResult === 'wrong') {
            wrongSound.play();
            document.body.classList.add('wrong-flash');
            setTimeout(() => document.body.classList.remove('wrong-flash'), 1000);
        }
    }

    // --- C. QUIZ PAGE INTERACTION ---
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        const options = document.querySelectorAll('.option-input');
        options.forEach(opt => {
            opt.addEventListener('change', () => {
                startSound.currentTime = 0;
                startSound.play();
            });
        });
    }

    // --- D. RESULT PAGE ---
    if (document.querySelector('.result-container')) {
        sessionStorage.removeItem('quizMusicActive'); // Music stop state
        bgMusic.pause();
        winSound.play();
        createConfetti();
    }
});

// Confetti Function (Waisa hi rahega)
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed; width: 10px; height: 10px; z-index: 9999;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%; top: -20px; pointer-events: none;
        `;
        document.body.appendChild(confetti);
        confetti.animate([
            { transform: 'translateY(0) rotate(0)', opacity: 1 },
            { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
        ], { duration: 2500 });
        setTimeout(() => confetti.remove(), 4000);
    }
}