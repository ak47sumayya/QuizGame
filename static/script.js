// 1. Sounds Load Karein
const startSound = new Audio('/static/sounds/start.mp3');
const bgMusic = new Audio('/static/sounds/bg-music.mp3');
const correctSound = new Audio('/static/sounds/correct.mp3');
const wrongSound = new Audio('/static/sounds/wrong.mp3');
const winSound = new Audio('/static/sounds/win.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.3;

document.addEventListener('DOMContentLoaded', () => {
    // --- MUSIC UNLOCK (Browser Rule) ---
    // Jab user pehli baar kahin bhi click karega, music shuru ho jayega
    document.body.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log("Music waiting..."));
        }
    }, { once: true });

    // --- 1. START SOUND (index.html) ---
    const startForm = document.querySelector('.start-form');
    if (startForm) {
        startForm.addEventListener('submit', (e) => {
            startSound.play();
            // Thora delay taake sound sunayi de phir page badle
            e.preventDefault();
            setTimeout(() => startForm.submit(), 400);
        });
    }

    // --- 2. CORRECT/WRONG LOGIC (quiz.html) ---
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        const nextBtn = document.getElementById('nextBtn');
        const options = document.querySelectorAll('.option-input');

        nextBtn.addEventListener('click', (e) => {
            // Hum check karte hain ke user ne option select kiya hai ya nahi
            const selectedOption = document.querySelector('.option-input:checked');
            if (selectedOption) {
                // Abhi hum yahan simple click sound baja rahe hain
                // Kyunke asli result 'app.py' check karta hai submit ke baad
                startSound.play(); 
            }
        });
    }

    // --- 3. WIN SOUND & CONFETTI (result.html) ---
    if (document.querySelector('.result-container')) {
        bgMusic.pause(); // Purana music band
        winSound.play(); // Jeetne ki khushi
        createConfetti();
    }
});

// Confetti Logic (As it is)
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0)', opacity: 1 },
            { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
        ], { duration: 2000 + Math.random() * 2000 });
        setTimeout(() => confetti.remove(), 4000);
    }
}