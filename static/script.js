const startSound = new Audio('/static/sounds/start.mp3');
const bgMusic = new Audio('/static/sounds/bg-music.mp3');
const winSound = new Audio('/static/sounds/win.mp3');
const correctSound = new Audio('/static/sounds/correct.mp3');
const wrongSound = new Audio('/static/sounds/wrong.mp3');

bgMusic.loop = true;
bgMusic.volume = 0.2; 

function startQuizExperience() {
    startSound.play();
    bgMusic.play().then(() => {
        sessionStorage.setItem('quizMusicActive', 'true');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Music Resume Logic
    if (sessionStorage.getItem('quizMusicActive') === 'true' && !document.querySelector('.result-container')) {
        bgMusic.play().catch(() => {
            document.body.addEventListener('click', () => bgMusic.play(), { once: true });
        });
    }

    // 2. Feedback Logic (ONLY on Page Load after Submit)
    const lastResultElement = document.getElementById('lastResult');
    if (lastResultElement) {
        const res = lastResultElement.value;
        if (res === 'correct') {
            correctSound.play();
            document.body.classList.add('correct-flash');
            setTimeout(() => document.body.classList.remove('correct-flash'), 800);
        } else if (res === 'wrong') {
            wrongSound.play();
            document.body.classList.add('wrong-flash');
            setTimeout(() => document.body.classList.remove('wrong-flash'), 800);
        }
    }

    // 3. Option Selection (Sound Hatadi Hai)
    const options = document.querySelectorAll('.option-input');
    const nextBtn = document.getElementById('nextBtn');

    options.forEach(opt => {
        opt.addEventListener('change', () => {
            // No Audio Play here
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.classList.add('enabled');
            }
        });
    });

    // 4. Result Page Confetti
    if (document.querySelector('.result-container')) {
        sessionStorage.removeItem('quizMusicActive');
        bgMusic.pause();
        winSound.play();
        createConfetti();
    }
});

function createConfetti() {
    const colors = ['#ffd700', '#3498db', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed; width: 8px; height: 8px; background: ${colors[Math.floor(Math.random()*3)]};
            left: ${Math.random()*100}%; top: -10px; z-index: 999; pointer-events: none;
        `;
        document.body.appendChild(confetti);
        confetti.animate([{transform:'translateY(0)'},{transform:'translateY(100vh) rotate(360deg)'}], {duration: 2000});
        setTimeout(() => confetti.remove(), 2500);
    }
}