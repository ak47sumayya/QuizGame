// 1. Audio Objects load karein (Global level par)
const startSound = new Audio('/static/sounds/start.mp3');
const bgMusic = new Audio('/static/sounds/bg-music.mp3');
const correctSound = new Audio('/static/sounds/correct.mp3');
const wrongSound = new Audio('/static/sounds/wrong.mp3');
const winSound = new Audio('/static/sounds/win.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.3;

document.addEventListener('DOMContentLoaded', () => {
    // Page Fade-in Effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // ========================================
    // HAR PAGE KE LIYE LOGIC
    // ========================================

    // Browser music block karta hai jab tak user click na kare
    document.body.addEventListener('click', () => {
        // Agar quiz page par hain to music chalao
        if (document.querySelector('.quiz-container') && bgMusic.paused) {
            bgMusic.play().catch(err => console.log("Music blocked"));
        }
    }, { once: true });

    // ========================================
    // WELCOME PAGE (index.html)
    // ========================================
    const startForm = document.querySelector('.start-form');
    if (startForm) {
        const nameInput = document.querySelector('.name-input');
        if (nameInput) nameInput.focus();

        startForm.addEventListener('submit', () => {
            startSound.play();
        });
    }

    // ========================================
    // QUIZ PAGE (quiz.html)
    // ========================================
    const optionInputs = document.querySelectorAll('.option-input');
    const quizForm = document.getElementById('quizForm');

    if (quizForm) {
        optionInputs.forEach(input => {
            input.addEventListener('change', () => {
                // Sahi/Galat check karne ke liye logic
                // Note: Flask submit hone se pehle sound play karein
                const selectedLabel = input.nextElementSibling;
                
                // Visual feedback
                document.querySelectorAll('.option-box').forEach(box => box.classList.remove('selected-option'));
                selectedLabel.classList.add('selected-option');
            });
        });

        // Submit button click par sound
        quizForm.addEventListener('submit', () => {
            // Yahan hum sirf click sound play kar sakte hain kyunke 
            // Result (correct/wrong) server-side se aata hai
            startSound.play(); 
        });
    }

    // ========================================
    // RESULT PAGE (result.html)
    // ========================================
    if (document.querySelector('.result-container')) {
        bgMusic.pause(); // Purana music band
        winSound.play(); // Jeetne ki sound
        createConfetti();
    }
});

// ========================================
// CONFETTI LOGIC
// ========================================
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.zIndex = '1000';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        const fallDuration = Math.random() * 3 + 2;
        const drift = (Math.random() - 0.5) * 200;

        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(110vh) translateX(${drift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: fallDuration * 1000,
            easing: 'ease-out'
        });

        setTimeout(() => confetti.remove(), fallDuration * 1000);
    }
}