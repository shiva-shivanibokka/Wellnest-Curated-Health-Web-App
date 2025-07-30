
document.addEventListener('DOMContentLoaded', function() {

    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarTitle = document.querySelector('.calendar-title');
    
    let currentMonth = 6; // July
    let currentYear = 2025;
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    function updateCalendarTitle() {
        calendarTitle.textContent = `${months[currentMonth]} ${currentYear}`;
    }
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendarTitle();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendarTitle();
        });
    }
    
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        day.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'scaleY(1.1)';
            this.style.background = 'var(--sf-light-purple)';
        });
        
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'scaleY(1)';
            this.style.background = 'var(--sf-purple)';
        });
    });
    
    const habitCircles = document.querySelectorAll('.habit-circle');
    habitCircles.forEach(circle => {
        circle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        circle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    setTimeout(() => {
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transition = 'height 0.8s ease';
                bar.style.height = bar.style.height || '85%';
            }, index * 100);
        });
    }, 500);
    
    setTimeout(() => {
        const metricNumbers = document.querySelectorAll('.metric-number');
        metricNumbers.forEach((number, index) => {
            setTimeout(() => {
                number.style.opacity = '0';
                number.style.transform = 'translateY(20px)';
                number.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    number.style.opacity = '1';
                    number.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }, 300);
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const text = this.textContent.trim();
            
            switch(text) {
                case 'Dashboard':
                    window.location.href = '/calendar';
                    break;
                            case 'Leaderboard':
                window.location.href = '/leaderboard';
                break;
            case 'Socials':
                window.location.href = '/socials';
                break;
                case 'Habits':
    
                    console.log('Habits clicked');
                    break;
                case 'Progress':
        
                    console.log('Already on progress page');
                    break;
                default:
                    console.log('Unknown navigation:', text);
            }
        });
    });
    
    const profileAvatar = document.querySelector('.profile-avatar');
    const profileDropdown = document.querySelector('.profile-dropdown');
    
    if (profileAvatar && profileDropdown) {
        profileAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.style.opacity = profileDropdown.style.opacity === '1' ? '0' : '1';
            profileDropdown.style.visibility = profileDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
            profileDropdown.style.transform = profileDropdown.style.transform === 'translateY(0px)' ? 'translateY(-10px)' : 'translateY(0px)';
        });
        
        document.addEventListener('click', function() {
            profileDropdown.style.opacity = '0';
            profileDropdown.style.visibility = 'hidden';
            profileDropdown.style.transform = 'translateY(-10px)';
        });
    }
    
    const pageElements = document.querySelectorAll('.calendar-container, .metrics-container, .graph-container, .habits-container');
    pageElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}); 