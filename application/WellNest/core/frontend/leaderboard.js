
document.addEventListener('DOMContentLoaded', function() {
    
    initializeLeaderboard();
    
    addHoverEffects();
    
    addLoadingAnimations();
});

function initializeLeaderboard() {
    console.log('Leaderboard page initialized');
    
    setupNavigation();
    
    setupTableInteractions();
}

function setupNavigation() {
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            
            switch(text) {
                case 'Dashboard':
                    window.location.href = '/calendar';
                    break;
                            case 'Progress':
                window.location.href = '/progress';
                break;
            case 'Leaderboard':
                
                console.log('Already on leaderboard page');
                break;
            case 'Socials':
                window.location.href = '/socials';
                break;
                case 'Habits':
                    
                    console.log('Habits clicked - staying on leaderboard page');
                    break;
                default:
                    console.log('Unknown navigation:', text);
            }
        });
    });
}

function setupTableInteractions() {
   
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('click', function() {
           
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function addHoverEffects() {
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    
    const challengeCard = document.querySelector('.challenge-card');
    if (challengeCard) {
        challengeCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        });
        
        challengeCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        });
    }
}

function addLoadingAnimations() {
    
    const elements = document.querySelectorAll('.challenge-card, .global-leaderboard-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 600 + (index * 100));
    });
}

function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        
        const dropdowns = document.querySelectorAll('.profile-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        });
    }
});


if ('ontouchstart' in window) {
    const touchElements = document.querySelectorAll('.table-row, .member-card, .btn');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const optimizedScrollHandler = debounce(function() {
  
}, 16);

window.addEventListener('scroll', optimizedScrollHandler); 