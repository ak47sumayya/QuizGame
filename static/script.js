document.addEventListener('DOMContentLoaded', () => {
    // Page Fade-in Effect (Sabhi pages ke liye)
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Agar hum Result Page par hain, to confetti chalao
    // Aapke result.html mein '.result-container' class maujood hai
    if (document.querySelector('.result-container')) {
        createConfetti();
    }
});

// ========================================
// WELCOME PAGE (index.html)
// ========================================
if (document.querySelector('.name-input')) {
    const nameInput = document.querySelector('.name-input');
    nameInput.focus();
    
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = document.querySelector('.start-form');
            if(nameInput.value.trim() !== "") {
                form.submit();
            }
        }
    });
}

// ========================================
// CATEGORIES PAGE (categories.html)
// ========================================
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

// ========================================
// QUIZ PAGE (quiz.html)
// ========================================
const optionInputs = document.querySelectorAll('.option-input');
optionInputs.forEach(input => {
    input.addEventListener('change', () => {
        // Purane selected options se class hatao
        document.querySelectorAll('.option-box').forEach(box => {
            box.classList.remove('selected-option');
        });
        
        // Naye selected option par class lagao
        const selectedBox = input.nextElementSibling;
        selectedBox.classList.add('selected-option');
        
        // Ripple Effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-effect');
        selectedBox.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ========================================
// RESULT PAGE (result.html) - Complete Logic
// ========================================
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'];
    const confettiCount = 60; // Thoda count badha diya hai achhe effect ke liye
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece'; // CSS class
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.borderRadius = '2px'; // Square pieces
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

        // Animation ke baad cleanup
        setTimeout(() => confetti.remove(), fallDuration * 1000);
    }
}