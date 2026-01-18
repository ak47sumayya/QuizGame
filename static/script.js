// Audio loading with Flask standard paths
const startSound = new Audio('/static/sounds/start.mp3');
const bgMusic = new Audio('/static/sounds/bg-music.mp3');
const winSound = new Audio('/static/sounds/win.mp3');
const clickSound = new Audio('/static/sounds/correct.mp3'); 

bgMusic.loop = true;
bgMusic.volume = 0.2; // Background music ko halka rakha hai

// Function to start BG Music safely
function playBG() {
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log("Music waiting for interaction"));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Browser Music Unlock: Pehle click par music shuru hoga
    document.body.addEventListener('click', playBG, { once: true });

    // 2. WELCOME PAGE (index.html)
    const startForm = document.querySelector('.start-form');
    if (startForm) {
        startForm.addEventListener('submit', (e) => {
            e.preventDefault();
            startSound.play();
            // Thora ruk kar submit taake sound sunayi de
            setTimeout(() => startForm.submit(), 600);
        });
    }

    // 3. CATEGORIES & QUIZ PAGES
    // Agar hum quiz ya categories page par hain, music check karein
    if (document.querySelector('.quiz-container') || document.querySelector('.categories-container')) {
        // Page load hote hi music play karne ki koshish
        playBG();
    }

    // 4. QUIZ LOGIC (quiz.html)
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        const options = document.querySelectorAll('.option-input');

        // Option select karte hi "Click" sound
        options.forEach(opt => {
            opt.addEventListener('change', () => {
                clickSound.currentTime = 0;
                clickSound.play();
            });
        });

        // Form submit (Next button) par sound
        quizForm.addEventListener('submit', () => {
            startSound.play(); 
        });
    }

    // 5. RESULT PAGE (result.html)
    if (document.querySelector('.result-container')) {
        bgMusic.pause(); // Purana music band
        winSound.play(); // Jeetne ki sound
        if (typeof createConfetti === 'function') createConfetti();
    }
});

// Confetti Effect (As it is)
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
        ], { duration: 2000 + Math.random() * 2000 });
        setTimeout(() => confetti.remove(), 4000);
    }
}