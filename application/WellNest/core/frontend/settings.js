
document.addEventListener('DOMContentLoaded', function() {
    
    initializeSettings();
    
    addHoverEffects();
    
    addLoadingAnimations();
    
    setupFormHandling();
    
    setupThemeSelection();
    
    setupToggleSwitches();
});

function initializeSettings() {
    console.log('Settings page initialized');
    
    setupNavigation();
    
    setupCardInteractions();
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
                    window.location.href = '/leaderboard';
                    break;
                case 'Socials':
                    window.location.href = '/socials';
                    break;
                case 'Habits':
                    // For now, stay on settings page since habits functionality might be in calendar
                    console.log('Habits clicked - staying on settings page');
                    break;
                default:
                    console.log('Unknown navigation:', text);
            }
        });
    });
}

function setupCardInteractions() {
    
    const settingsCards = document.querySelectorAll('.settings-card');
    
    settingsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

function setupFormHandling() {
    
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            
            if (!firstName || !lastName || !email || !username) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            showNotification('Settings saved successfully!', 'success');
            
            setTimeout(() => {
               
                console.log('Settings saved:', { firstName, lastName, email, username });
            }, 1000);
        });
    }
    
   
    const deleteAccountBtn = document.querySelector('.btn-danger');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                showNotification('Account deletion initiated...', 'warning');
             
            }
        });
    }
    
    const exportDataBtn = document.querySelector('.btn-secondary');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            showNotification('Preparing data export...', 'info');
            
            setTimeout(() => {
                showNotification('Data export completed!', 'success');
            }, 2000);
        });
    }
}

function setupThemeSelection() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            this.classList.add('active');
            
            const themeName = this.querySelector('span').textContent;
            
            applyTheme(themeName);
            
            showNotification(`Theme changed to ${themeName}`, 'success');
        });
    });
}

function applyTheme(themeName) {
   
    console.log('Applying theme:', themeName);
    
    const root = document.documentElement;
    
    switch(themeName) {
        case 'Light Mode':
            root.style.setProperty('--text-primary', '#2d3748');
            root.style.setProperty('--text-secondary', '#718096');
            root.style.setProperty('--border-color', '#e2e8f0');
            break;
        case 'Dark Mode':
            root.style.setProperty('--text-primary', '#f7fafc');
            root.style.setProperty('--text-secondary', '#a0aec0');
            root.style.setProperty('--border-color', '#4a5568');
            break;
        case 'Auto':

            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                applyTheme('Dark Mode');
            } else {
                applyTheme('Light Mode');
            }
            break;
    }
}

function setupToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.option-item').querySelector('h3').textContent;
            const isEnabled = this.checked;
            
            console.log(`${settingName}: ${isEnabled ? 'enabled' : 'disabled'}`);
            
            showNotification(`${settingName} ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
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
    
    const optionItems = document.querySelectorAll('.option-item');
    
    optionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function addLoadingAnimations() {
    
    const elements = document.querySelectorAll('.settings-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function showNotification(message, type = 'info') {
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        case 'info': return '#17a2b8';
        default: return '#17a2b8';
    }
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
    const touchElements = document.querySelectorAll('.settings-card, .btn, .option-item');
    
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