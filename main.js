// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);
});

// Custom Cursor
const cursorDot = document.createElement('div');
const cursorOutline = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorOutline.className = 'cursor-outline';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

let cursorPos = { x: 0, y: 0 };
let cursorOutlinePos = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    cursorPos.x = e.clientX;
    cursorPos.y = e.clientY;
    
    cursorDot.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
});

function updateCursorOutline() {
    const easing = 8;
    cursorOutlinePos.x += (cursorPos.x - cursorOutlinePos.x) / easing;
    cursorOutlinePos.y += (cursorPos.y - cursorOutlinePos.y) / easing;
    
    cursorOutline.style.transform = `translate(${cursorOutlinePos.x}px, ${cursorOutlinePos.y}px)`;
    requestAnimationFrame(updateCursorOutline);
}
updateCursorOutline();

// Hover Effects
document.querySelectorAll('a, button, .card').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(${cursorPos.x}px, ${cursorPos.y}px) scale(1.5)';
        cursorOutline.style.border = '2px solid var(--primary)';
        cursorDot.style.opacity = '0.5';
    });
    
    element.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(${cursorPos.x}px, ${cursorPos.y}px) scale(1)';
        cursorOutline.style.border = '2px solid var(--primary)';
        cursorDot.style.opacity = '1';
    });
});

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card');
    const hero = document.querySelector('.hero');
    
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    hero.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    
    cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        
        const angleX = (e.clientY - cardCenterY) / 30;
        const angleY = (cardCenterX - e.clientX) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Navigation Scroll Effect
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
    } else {
        nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Form Validation and Animation
const form = document.getElementById('contactForm');
const inputs = form.querySelectorAll('input, textarea');

inputs.forEach(input => {
    const label = input.previousElementSibling;
    
    input.addEventListener('focus', () => {
        label.style.transform = 'translateY(-25px)';
        label.style.color = 'var(--primary)';
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            label.style.transform = 'translateY(0)';
            label.style.color = 'var(--gray)';
        }
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    if (!name || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showNotification('Thank you for signing up!', 'success');
    form.reset();
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .section-title, .hero-content').forEach(el => {
    observer.observe(el);
});

// Dynamic Background Animation
const createParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = Math.random() * 3 + 2 + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    return particle;
};

const videoBg = document.querySelector('.video-bg');
setInterval(() => {
    const particle = createParticle();
    videoBg.appendChild(particle);
    setTimeout(() => {
        videoBg.removeChild(particle);
    }, 5000);
}, 200); 