// Leaderboard Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializeLeaderboard();
    
    // Add hover effects and interactions
    addHoverEffects();
    
    // Add loading animations
    addLoadingAnimations();
});

function initializeLeaderboard() {
    console.log('Leaderboard page initialized');
    
    // Add click handlers for navigation
    setupNavigation();
    
    // Add table row interactions
    setupTableInteractions();
}

function setupNavigation() {
    // Handle navbar link clicks
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            
            // Navigate based on the link text
            switch(text) {
                case 'Dashboard':
                    window.location.href = '/calendar';
                    break;
                case 'Progress':
                    window.location.href = '/progress';
                    break;
                case 'Leaderboard':
                    // Already on leaderboard page
                    console.log('Already on leaderboard page');
                    break;
                case 'Habits':
                    // For now, stay on leaderboard page since habits functionality might be in calendar
                    console.log('Habits clicked - staying on leaderboard page');
                    break;
                default:
                    console.log('Unknown navigation:', text);
            }
        });
    });
}

function setupTableInteractions() {
    // Add hover effects to table rows
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
    
    // Add click effects to member cards
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function addHoverEffects() {
    // Add hover effects to buttons
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
    
    // Add hover effects to challenge card
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
    // Add fade-in animation to page elements
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
    
    // Add staggered animation to table rows
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

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or dropdowns
        const dropdowns = document.querySelectorAll('.profile-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        });
    }
});

// Add touch support for mobile devices
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

// Add performance optimizations
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

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations if needed
}, 16);

window.addEventListener('scroll', optimizedScrollHandler); 