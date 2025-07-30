
document.addEventListener('DOMContentLoaded', function() {
   
    initializeProfile();
    
    addHoverEffects();
    
    addLoadingAnimations();
    
    setupFormHandling();
    
    setupPopupHandling();
});

function initializeProfile() {
    console.log('Profile page initialized');
    
    setupNavigation();
    
    setupCardInteractions();
    
    setupAchievementInteractions();
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
                    // For now, stay on profile page since habits functionality might be in calendar
                    console.log('Habits clicked - staying on profile page');
                    break;
                default:
                    console.log('Unknown navigation:', text);
            }
        });
    });
}

function setupCardInteractions() {
    
    const profileCards = document.querySelectorAll('.profile-card');
    
    profileCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function setupAchievementInteractions() {
    
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    achievementItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (this.classList.contains('unlocked')) {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        item.addEventListener('click', function() {
            if (this.classList.contains('unlocked')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                const title = this.querySelector('h3').textContent;
                showNotification(`Achievement: ${title}`, 'success');
            }
        });
    });
}

function setupFormHandling() {
   n
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            

            if (!data.firstName || !data.lastName || !data.email) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            showNotification('Profile updated successfully!', 'success');
            
            showPopup();
            
            updateProfileDisplay(data);
        });
    }
    
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('click', function() {
           
            showNotification('Avatar upload feature coming soon!', 'info');
        });
    }
}

function setupPopupHandling() {
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('close-popup');
    
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            hidePopup();
        });
    }
    
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                hidePopup();
            }
        });
    }
}

function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.remove('hidden');
    }
}

function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

function updateProfileDisplay(data) {

    const profileNameLarge = document.querySelector('.profile-name-large');
    if (profileNameLarge && data.firstName && data.lastName) {
        profileNameLarge.textContent = `${data.firstName} ${data.lastName}`;
    }
    
    const profileEmailLarge = document.querySelector('.profile-email-large');
    if (profileEmailLarge && data.email) {
        profileEmailLarge.textContent = data.email;
    }
    
    const avatarInitial = document.querySelector('.avatar-initial');
    if (avatarInitial && data.firstName) {
        avatarInitial.textContent = data.firstName.charAt(0).toUpperCase();
    }
    
    const navProfileName = document.querySelector('.nav-profile .profile-name');
    if (navProfileName && data.firstName) {
        navProfileName.textContent = data.firstName;
    }
    
    const navProfileEmail = document.querySelector('.nav-profile .profile-email');
    if (navProfileEmail && data.email) {
        navProfileEmail.textContent = data.email;
    }
    
    const navProfileAvatar = document.querySelector('.nav-profile .profile-avatar');
    if (navProfileAvatar && data.firstName) {
        navProfileAvatar.textContent = data.firstName.charAt(0).toUpperCase();
    }
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
    
    
    const goalItems = document.querySelectorAll('.goal-item');
    
    goalItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
   
    const editAvatarBtn = document.querySelector('.edit-avatar-btn');
    if (editAvatarBtn) {
        editAvatarBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });
        
        editAvatarBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });
    }
}

function addLoadingAnimations() {
    
    const elements = document.querySelectorAll('.profile-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    const goalItems = document.querySelectorAll('.goal-item');
    
    goalItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 600 + (index * 100));
    });
    
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    achievementItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 800 + (index * 100));
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
        // Close popup
        hidePopup();
        
        const dropdowns = document.querySelectorAll('.profile-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        });
    }
});

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