
document.addEventListener('DOMContentLoaded', function() {
    
    initializeSocials();
    
    addHoverEffects();
    
    addLoadingAnimations();
    
    setupSearchFunctionality();
    
    setupFriendRequests();
    
    setupGroupManagement();
});

function initializeSocials() {
    console.log('Socials page initialized');
    
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
                   
                    console.log('Already on socials page');
                    break;
                case 'Habits':
                    
                    console.log('Habits clicked - staying on socials page');
                    break;
                default:
                    console.log('Unknown navigation:', text);
            }
        });
    });
}

function setupCardInteractions() {
    
    const groupCards = document.querySelectorAll('.group-card');
    
    groupCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        });
    });
    
   
    const friendCards = document.querySelectorAll('.friend-card');
    
    friendCards.forEach(card => {
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

function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const resultsSection = document.getElementById('search-results');
    const resultsContainer = document.querySelector('.results-container');
    
 
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
           
            filterBtns.forEach(b => b.classList.remove('active'));
            
            this.classList.add('active');
            
            performSearch();
        });
    });
    
    function performSearch() {
        const query = searchInput.value.trim();
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        
        if (!query) {
            resultsSection.classList.remove('show');
            return;
        }
        
        const results = generateSearchResults(query, activeFilter);
        displaySearchResults(results);
        
        resultsSection.classList.add('show');
    }
    
    function generateSearchResults(query, filter) {
        const mockResults = {
            friends: [
                { name: 'Alice Johnson', avatar: 'A', status: 'Wellness enthusiast', type: 'friend' },
                { name: 'Bob Smith', avatar: 'B', status: 'Fitness lover', type: 'friend' },
                { name: 'Charlie Brown', avatar: 'C', status: 'Health advocate', type: 'friend' }
            ],
            groups: [
                { name: 'SFSU Jogging Club', icon: '🏃‍♂️', members: 10, type: 'group' },
                { name: 'Dorm 26 Foodies', icon: '🍎', members: 4, type: 'group' },
                { name: 'Intro to Python Gang', icon: '💻', members: 7, type: 'group' }
            ]
        };
        
        let results = [];
        
        if (filter === 'all' || filter === 'friends') {
            results = results.concat(mockResults.friends.filter(friend => 
                friend.name.toLowerCase().includes(query.toLowerCase())
            ));
        }
        
        if (filter === 'all' || filter === 'groups') {
            results = results.concat(mockResults.groups.filter(group => 
                group.name.toLowerCase().includes(query.toLowerCase())
            ));
        }
        
        return results;
    }
    
    function displaySearchResults(results) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${searchInput.value}"</p>
                </div>
            `;
            return;
        }
        
        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            
            if (result.type === 'friend') {
                resultElement.innerHTML = `
                    <div class="result-avatar">${result.avatar}</div>
                    <div class="result-info">
                        <h3>${result.name}</h3>
                        <p>${result.status}</p>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-primary add-friend-btn">
                            <span class="btn-icon">👥</span>
                            Add Friend
                        </button>
                    </div>
                `;
            } else {
                resultElement.innerHTML = `
                    <div class="result-icon">${result.icon}</div>
                    <div class="result-info">
                        <h3>${result.name}</h3>
                        <p>${result.members} members</p>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-primary join-group-btn">
                            <span class="btn-icon">➕</span>
                            Join Group
                        </button>
                    </div>
                `;
            }
            
            resultsContainer.appendChild(resultElement);
        });
        
        setupResultButtonListeners();
    }
    
    function setupResultButtonListeners() {
        const addFriendBtns = document.querySelectorAll('.add-friend-btn');
        const joinGroupBtns = document.querySelectorAll('.join-group-btn');
        
        addFriendBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const friendName = this.closest('.result-item').querySelector('h3').textContent;
                showNotification(`Friend request sent to ${friendName}!`, 'success');
            });
        });
        
        joinGroupBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const groupName = this.closest('.result-item').querySelector('h3').textContent;
                showNotification(`Joined ${groupName}!`, 'success');
            });
        });
    }
}

function setupFriendRequests() {
    const acceptBtns = document.querySelectorAll('.accept-btn');
    const declineBtns = document.querySelectorAll('.decline-btn');
    
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const friendName = requestItem.querySelector('h3').textContent;
            
            showNotification(`Friend request from ${friendName} accepted!`, 'success');
            
            requestItem.style.transform = 'translateX(100%)';
            requestItem.style.opacity = '0';
            setTimeout(() => {
                requestItem.remove();
                updateRequestCount();
            }, 300);
        });
    });
    
    declineBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const requestItem = this.closest('.request-item');
            const friendName = requestItem.querySelector('h3').textContent;
            
            showNotification(`Friend request from ${friendName} declined`, 'info');
            
            requestItem.style.transform = 'translateX(100%)';
            requestItem.style.opacity = '0';
            setTimeout(() => {
                requestItem.remove();
                updateRequestCount();
            }, 300);
        });
    });
    
    function updateRequestCount() {
        const requestCount = document.querySelector('.request-count');
        const remainingRequests = document.querySelectorAll('.request-item').length;
        
        if (requestCount) {
            if (remainingRequests === 0) {
                requestCount.style.display = 'none';
            } else {
                requestCount.textContent = `${remainingRequests} new`;
            }
        }
    }
}

function setupGroupManagement() {
    const createGroupBtn = document.getElementById('create-group-btn');
    const createGroupModal = document.getElementById('create-group-modal');
    const closeCreateModal = document.getElementById('close-create-modal');
    const cancelCreateGroup = document.getElementById('cancel-create-group');
    const createGroupForm = document.getElementById('create-group-form');
    
    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', function() {
            createGroupModal.classList.remove('hidden');
        });
    }
    
    if (closeCreateModal) {
        closeCreateModal.addEventListener('click', function() {
            createGroupModal.classList.add('hidden');
        });
    }
    
    if (cancelCreateGroup) {
        cancelCreateGroup.addEventListener('click', function() {
            createGroupModal.classList.add('hidden');
        });
    }
    
    if (createGroupModal) {
        createGroupModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
    
    if (createGroupForm) {
        createGroupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!data.groupName || !data.challengeType || !data.challengeDuration) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            showNotification(`Group "${data.groupName}" created successfully!`, 'success');
            
            createGroupModal.classList.add('hidden');
            
            this.reset();
        });
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
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    const requestItems = document.querySelectorAll('.request-item');
    
    requestItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

function addLoadingAnimations() {
   
    const elements = document.querySelectorAll('.search-card, .group-card, .friend-card, .request-item');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
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
        
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        
        const dropdowns = document.querySelectorAll('.profile-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        });
    }
});

if ('ontouchstart' in window) {
    const touchElements = document.querySelectorAll('.group-card, .friend-card, .request-item, .btn');
    
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