// 1. Audio Objects (Flask standard paths)
const startSound = new Audio('/static/sounds/start.mp3');
const bgMusic = new Audio('/static/sounds/bg-music.mp3');
const winSound = new Audio('/static/sounds/win.mp3');
const correctSound = new Audio('/static/sounds/correct.mp3');
const wrongSound = new Audio('/static/sounds/wrong.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.2; 

document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. FEEDBACK LOGIC (Sahi/Galat Jawab ka asar) ---
    // Hum quiz.html se hidden input utha rahe hain jo Flask bhej raha hai
    const lastResult = document.getElementById('lastResult')?.value;
    
    if (lastResult === 'correct') {
        correctSound.play();
        // Screen ko green karke wapas normal karna
        document.body.style.backgroundColor = "#27ae60"; 
        setTimeout(() => document.body.style.backgroundColor = "", 800);
    } 
    else if (lastResult === 'wrong') {
        wrongSound.play();
        // Screen ko red karke wapas normal karna
        document.body.style.backgroundColor = "#c0392b"; 
        setTimeout(() => document.body.style.backgroundColor = "", 800);
    }

    // --- B. BROWSER MUSIC UNLOCK ---
    document.body.addEventListener('click', () => {
        if (bgMusic.paused && !document.querySelector('.welcome-container')) {
            bgMusic.play().catch(e => console.log("Music waiting..."));
        }
    }, { once: true });

    // --- C. QUIZ PAGE LOGIC ---
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        const options = document.querySelectorAll('.option-input');
        
        // Option select par click sound
        options.forEach(opt => {
            opt.addEventListener('change', () => {
                startSound.currentTime = 0;
                startSound.play();
            });
        });

        // Submit par Next sound
        quizForm.addEventListener('submit', () => {
            startSound.play(); 
        });
    }

    // --- D. RESULT PAGE LOGIC ---
    if (document.querySelector('.result-container')) {
        bgMusic.pause();
        winSound.play();
        createConfetti();
    }
});

// Confetti Effect
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
// Jab page load ho, check karein ke पिछला answer sahi tha ya galat
window.addEventListener('DOMContentLoaded', () => {
    const lastResult = document.getElementById('lastResult').value;
    if (lastResult === 'correct') {
        document.body.classList.add('correct-flash');
        // correctSound.play(); // Agar sounds hain to
    } else if (lastResult === 'wrong') {
        document.body.classList.add('wrong-flash');
        // wrongSound.play();
    }
    
    // 1 second baad flash hata dein
    setTimeout(() => {
        document.body.classList.remove('correct-flash', 'wrong-flash');
    }, 1000);
});