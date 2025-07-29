// --- MODAL AND UI MANAGEMENT ---

// Get elements from the DOM
const form = document.getElementById("habit-form");
const habitContainer = document.getElementById("habit-container");
const doneContainer = document.getElementById("done-container");
const addHabitBtn = document.getElementById("add-habit-button");
const habitEditor = document.getElementById("habit-editor");
const deleteHabit = document.getElementById("delete-habit");

// Create modal overlay if it doesn't exist
let modalOverlay = document.getElementById("modal-overlay");
if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'modal-overlay';
    modalOverlay.style.display = 'none';
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalOverlay.style.backdropFilter = 'blur(8px)';
    modalOverlay.style.zIndex = '999';
    document.body.appendChild(modalOverlay);
}

// Modal Functions
function openModal() {
    if (form) {
        form.style.display = "block";
        modalOverlay.style.display = "block";
        document.body.style.overflow = 'hidden';
        
        // Animate modal entrance
        setTimeout(() => {
            form.style.transform = "translate(-50%, -50%) scale(1)";
            form.style.opacity = "1";
        }, 10);
        
        // Focus first input
        const firstInput = form.querySelector('input[type="text"]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
}

function closeModal() {
    if (form) {
        form.style.transform = "translate(-50%, -50%) scale(0.9)";
        form.style.opacity = "0";
        
        setTimeout(() => {
            form.style.display = "none";
            modalOverlay.style.display = "none";
            document.body.style.overflow = 'auto';
            form.reset();
            // Reset day selections
            const dayBoxes = form.querySelectorAll('.day-box');
            dayBoxes.forEach(box => box.classList.remove('selected'));
            // Reset color selection to first option
            const firstColorOption = form.querySelector('input[name="color"]');
            if (firstColorOption) firstColorOption.checked = true;
        }, 200);
    }
}

function openHabitEditor() {
    if (habitEditor) {
        habitEditor.style.display = "block";
        modalOverlay.style.display = "block";
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            habitEditor.style.transform = "translate(-50%, -50%) scale(1)";
            habitEditor.style.opacity = "1";
        }, 10);
    }
}

function closeHabitEditor() {
    if (habitEditor) {
        habitEditor.style.transform = "translate(-50%, -50%) scale(0.9)";
        habitEditor.style.opacity = "0";
        
        setTimeout(() => {
            habitEditor.style.display = "none";
            modalOverlay.style.display = "none";
            document.body.style.overflow = 'auto';
        }, 200);
    }
}

// --- EVENT LISTENERS ---

// Add habit button opens the modal
if (addHabitBtn) {
    addHabitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
    });
}

// Close modal when clicking overlay
if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeModal();
            closeHabitEditor();
        }
    });
}

// Add cancel button functionality
const cancelBtns = document.querySelectorAll("#form-cancel, #form-cancel-btn");
cancelBtns.forEach(btn => {
    if (btn) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            closeModal();
        });
    }
});

// Close buttons in modals
const closeButtons = document.querySelectorAll(".modal-close");
closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        closeModal();
        closeHabitEditor();
    });
});

// Handle form submission
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Add loading state
        const submitBtn = form.querySelector('#form-submit');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Creating...';
            submitBtn.disabled = true;
        }
        
        const formData = new FormData(form);
        const habitData = {
            name: formData.get('name'),
            habit_type: formData.get('habit_type') || 'daily',
            description: formData.get('description') || '',
            color: formData.get('color') || 'Green',
            value: formData.get('value') || null,
            weekdays: getSelectedDays()
        };

        try {
            const response = await fetch("/api/habit/recurring/", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify(habitData),
            });

            if (response.ok) {
                // Success animation
                if (submitBtn) {
                    submitBtn.innerHTML = '<span class="btn-icon">✅</span> Created!';
                    submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                }
                
                        setTimeout(() => {
            closeModal();
            // Reload habits for the current selected date
            if (currentSelectedDate) {
                loadHabitsForDate(currentSelectedDate);
            } else {
                loadCreatedHabits();
            }
            showNotification('Habit created successfully! 🎉', 'success');
        }, 1000);
            } else {
                const errorData = await response.json();
                console.error("Failed to create habit:", errorData);
                showNotification('Failed to create habit. Please try again.', 'error');
                
                // Reset button
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }
            }
        } catch (error) {
            console.error("Error creating habit:", error);
            showNotification('Failed to create habit. Please try again.', 'error');
            
            // Reset button
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }
        }
    });
}

// Function to get selected days from the form
function getSelectedDays() {
    const selectedDays = [];
    const dayBoxes = document.querySelectorAll('.day-box.selected');
    const dayMap = {
        'M': 'Mon', 'T': 'Tue', 'W': 'Wed', 
        'T': 'Thu', 'F': 'Fri', 'S': 'Sat', 'S': 'Sun'
    };
    
    dayBoxes.forEach((box, index) => {
        const dayText = box.textContent.trim();
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        if (index < days.length) {
            selectedDays.push(days[index]);
        }
    });
    return selectedDays;
}

// Add day selection functionality with enhanced animation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('day-box')) {
        e.target.classList.toggle('selected');
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        e.target.style.position = 'relative';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
});

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// --- HABIT MANAGEMENT ---

async function loadCreatedHabits() {
    const COLOR_MAP = {
        Green: "green",
        Purple: "purple", 
        Red: "red",
        Blue: "blue",
        Gold: "gold",
    };

    if (!habitContainer || !doneContainer) {
        console.error("Habit containers not found");
        return;
    }

    // Add loading animation
    habitContainer.innerHTML = '<div class="loading-spinner">Loading habits...</div>';
    doneContainer.innerHTML = '<div class="loading-spinner">Loading completed...</div>';

    try {
        const resp = await fetch("/api/habit/recurring/today/", {
            method: "GET",
            credentials: "same-origin"
        });

        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const data = await resp.json();
        console.log("⇨ fetched data:", data);

        // Clear containers
        habitContainer.innerHTML = "";
        doneContainer.innerHTML = "";

        // Process TODO habits with staggered animation
        if (data.todo && data.todo.length > 0) {
            data.todo.forEach((habitObj, index) => {
                setTimeout(() => {
                    const wrapper = createHabitElement(habitObj, COLOR_MAP, false);
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateX(-30px)';
                    habitContainer.appendChild(wrapper);
                    
                    // Animate in
                    setTimeout(() => {
                        wrapper.style.transition = 'all 0.4s ease';
                        wrapper.style.opacity = '1';
                        wrapper.style.transform = 'translateX(0)';
                    }, 50);
                }, index * 100);
            });
        } else {
            habitContainer.innerHTML = '<div class="empty-state">No habits for today. Create one! ✨</div>';
        }

        // Process DONE habits with staggered animation
        if (data.done && data.done.length > 0) {
            data.done.forEach((habitObj, index) => {
                setTimeout(() => {
                    const wrapper = createHabitElement(habitObj, COLOR_MAP, true);
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateX(30px)';
                    doneContainer.appendChild(wrapper);
                    
                    // Animate in
                    setTimeout(() => {
                        wrapper.style.transition = 'all 0.4s ease';
                        wrapper.style.opacity = '1';
                        wrapper.style.transform = 'translateX(0)';
                    }, 50);
                }, index * 100);
            });
        } else {
            doneContainer.innerHTML = '<div class="empty-state">Complete some habits! 🎯</div>';
        }

        // Update badges
        updateHabitBadges(data.todo?.length || 0, data.done?.length || 0);

    } catch (err) {
        console.error("Failed to load recurring habits:", err);
        habitContainer.innerHTML = '<div class="error-state">Failed to load habits. Please refresh.</div>';
        doneContainer.innerHTML = '<div class="error-state">Failed to load completed habits.</div>';
        showNotification('Failed to load habits. Please refresh the page.', 'error');
    }
}

function createHabitElement(habitObj, COLOR_MAP, isDone) {
    const wrapper = document.createElement("div");
    wrapper.className = "habit-wrapper";

    const habit = document.createElement("div");
    habit.className = `habit ${COLOR_MAP[habitObj.color] || 'green'}`;

    const check = document.createElement("img");
    check.src = isDone ? window.STATIC_URLS.checkDone : window.STATIC_URLS.checkEmpty;
    check.alt = isDone ? "check" : "check-empty";
    check.className = "check-empty";
    
    check.addEventListener("click", async (e) => {
        e.stopPropagation();
        
        // Add click animation
        check.style.transform = 'scale(1.2)';
        setTimeout(() => {
            check.style.transform = 'scale(1)';
        }, 150);
        
        await toggleHabitCompletion(wrapper, check, habit, habitObj, COLOR_MAP);
    });

    const habitText = document.createElement("span");
    habitText.textContent = habitObj.name;
    habitText.className = "habit-text";

    habit.appendChild(check);
    habit.appendChild(habitText);
    
    // Add click handler for habit editing
    habit.addEventListener("click", (e) => {
        if (e.target !== check) {
            // Add click animation
            habit.style.transform = 'scale(0.98)';
            setTimeout(() => {
                habit.style.transform = 'scale(1)';
            }, 150);
            
            showHabitEditor(habitObj);
        }
    });

    // Add hover effects
    habit.addEventListener("mouseenter", () => {
        habit.style.transform = 'translateX(4px)';
    });

    habit.addEventListener("mouseleave", () => {
        habit.style.transform = 'translateX(0)';
    });

    wrapper.appendChild(habit);
    return wrapper;
}

async function toggleHabitCompletion(wrapper, check, habit, habitObj, COLOR_MAP) {
    const isInToDo = wrapper.parentElement === habitContainer;
    
    // Add loading state
    const originalSrc = check.src;
    check.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M21 12a9 9 0 11-6.219-8.56'/%3E%3C/svg%3E";
    check.style.animation = 'spin 1s linear infinite';
    
    try {
        if (isInToDo) {
            // Move to done with animation
            wrapper.style.transform = 'translateX(100px)';
            wrapper.style.opacity = '0.5';
            
            setTimeout(() => {
                doneContainer.appendChild(wrapper);
                wrapper.style.transform = 'translateX(-30px)';
                setTimeout(() => {
                    wrapper.style.transform = 'translateX(0)';
                    wrapper.style.opacity = '1';
                }, 50);
            }, 300);

            check.src = window.STATIC_URLS.checkDone;
            check.alt = "check";
            check.style.animation = '';

            // Log completion
            await fetch("/api/habit/log/", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({
                    name: habitObj.name,
                    habit_type: habitObj.habit_type,
                    description: habitObj.description || "",
                    color: habitObj.color || "Green",
                    value: habitObj.value || null,
                }),
            });

            showNotification(`Great job! "${habitObj.name}" completed! 🎉`, 'success');
            
        } else {
            // Move back to todo with animation
            wrapper.style.transform = 'translateX(-100px)';
            wrapper.style.opacity = '0.5';
            
            setTimeout(() => {
                habitContainer.appendChild(wrapper);
                wrapper.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    wrapper.style.transform = 'translateX(0)';
                    wrapper.style.opacity = '1';
                }, 50);
            }, 300);

            check.src = window.STATIC_URLS.checkEmpty;
            check.alt = "check-empty";
            check.style.animation = '';

            // Remove from log
            await fetch(`/api/habit/log/delete/`, {
                method: "DELETE",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({
                    name: habitObj.name,
                    habit_type: habitObj.habit_type,
                    date: new Date().toISOString().split("T")[0],
                }),
            });

            showNotification(`"${habitObj.name}" moved back to todo.`, 'info');
        }

        // Update badges after a delay to account for animation
        setTimeout(() => {
            const todoCount = habitContainer.querySelectorAll('.habit-wrapper').length;
            const doneCount = doneContainer.querySelectorAll('.habit-wrapper').length;
            updateHabitBadges(todoCount, doneCount);
        }, 400);
        
        // Reload habits for the current date to refresh the view
        setTimeout(() => {
            if (currentSelectedDate) {
                loadHabitsForDate(currentSelectedDate);
            } else {
                loadCreatedHabits();
            }
        }, 500);

    } catch (error) {
        console.error("Error toggling habit:", error);
        check.src = originalSrc;
        check.style.animation = '';
        showNotification('Failed to update habit. Please try again.', 'error');
    }
}

function showHabitEditor(habitObj) {
    if (!habitEditor) return;

    openHabitEditor();
    
    // Populate habit info with animation
    const nameElement = habitEditor.querySelector("h3");
    const descElement = habitEditor.querySelector("h4");
    
    if (nameElement) {
        nameElement.style.opacity = '0';
        nameElement.textContent = habitObj.name;
        setTimeout(() => {
            nameElement.style.transition = 'opacity 0.3s ease';
            nameElement.style.opacity = '1';
        }, 100);
    }
    
    if (descElement) {
        descElement.style.opacity = '0';
        descElement.textContent = habitObj.description || "No description";
        setTimeout(() => {
            descElement.style.transition = 'opacity 0.3s ease';
            descElement.style.opacity = '1';
        }, 200);
    }

    // Show repeating days with staggered animation
    const editorDays = habitEditor.querySelectorAll(".day-box");
    editorDays.forEach((box, index) => {
        box.classList.remove("selected");
        box.style.transform = 'scale(0.8)';
        box.style.opacity = '0.5';
        
        setTimeout(() => {
            const dayText = box.textContent.trim();
            if (habitObj.weekdays && habitObj.weekdays.includes(dayText)) {
                box.classList.add("selected");
            }
            
            box.style.transition = 'all 0.3s ease';
            box.style.transform = 'scale(1)';
            box.style.opacity = '1';
        }, index * 50);
    });

    // Save data for deletion
    if (habitEditor.dataset) {
        habitEditor.dataset.name = habitObj.name;
        habitEditor.dataset.habitType = habitObj.habit_type;
    }
}

// Delete habit functionality with confirmation
if (deleteHabit) {
    deleteHabit.addEventListener("click", async () => {
        if (!habitEditor.dataset.name || !habitEditor.dataset.habitType) {
            showNotification("No habit selected for deletion.", 'error');
            return;
        }

        // Enhanced confirmation with custom styling
        const confirmDelete = confirm(`Are you sure you want to delete "${habitEditor.dataset.name}"?\n\nThis action cannot be undone.`);
        
        if (!confirmDelete) return;

        // Add loading state to delete button
        const originalText = deleteHabit.innerHTML;
        deleteHabit.innerHTML = '<span class="btn-icon">⏳</span> Deleting...';
        deleteHabit.disabled = true;

        try {
            const resp = await fetch("/api/habit/recurring/delete/", {
                method: "DELETE",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({
                    name: habitEditor.dataset.name,
                    habit_type: habitEditor.dataset.habitType,
                }),
            });

            const result = await resp.json();
            if (resp.ok && result.success) {
                // Success animation
                deleteHabit.innerHTML = '<span class="btn-icon">✅</span> Deleted!';
                deleteHabit.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                
                setTimeout(() => {
                    closeHabitEditor();
                    // Reload habits for the current selected date
                    if (currentSelectedDate) {
                        loadHabitsForDate(currentSelectedDate);
                    } else {
                        loadCreatedHabits();
                    }
                    showNotification('Habit deleted successfully.', 'success');
                }, 1000);
            } else {
                throw new Error(result.error || resp.statusText);
            }
        } catch (error) {
            console.error("Error deleting habit:", error);
            showNotification('Failed to delete habit. Please try again.', 'error');
            
            // Reset button
            deleteHabit.innerHTML = originalText;
            deleteHabit.disabled = false;
            deleteHabit.style.background = '';
        }
    });
}

// --- UTILITY FUNCTIONS ---

function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1] || '';
}

function updateHabitBadges(todoCount, doneCount) {
    const todoBadge = document.querySelector('.todo-card .card-badge');
    const doneBadge = document.querySelector('.done-card .card-badge');
    
    if (todoBadge) {
        todoBadge.textContent = `${todoCount} left`;
        todoBadge.style.transform = 'scale(1.1)';
        setTimeout(() => {
            todoBadge.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (doneBadge) {
        doneBadge.textContent = `${doneCount} done`;
        doneBadge.style.transform = 'scale(1.1)';
        setTimeout(() => {
            doneBadge.style.transform = 'scale(1)';
        }, 200);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">×</button>
    `;
    
    // Add styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#22c55e' : 
                   type === 'error' ? '#ef4444' : 
                   type === 'warning' ? '#eab308' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        maxWidth: '400px',
        fontSize: '0.95rem',
        fontWeight: '500'
    };
    
    Object.assign(notification.style, styles);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.style.padding = '0';
    closeBtn.style.marginLeft = '8px';
    
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// --- NAVIGATION ---

// Progress page navigation
const progressElement = document.getElementById('streak-progress');
if (progressElement) {
    progressElement.addEventListener('click', () => {
        // Add click animation
        progressElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            progressElement.style.transform = 'scale(1)';
            window.location.href = '/progress';
        }, 150);
    });
}

// Navigation link functionality
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '30px';
        ripple.style.height = '30px';
        ripple.style.marginLeft = '-15px';
        ripple.style.marginTop = '-15px';
        ripple.style.pointerEvents = 'none';
        
        link.style.position = 'relative';
        link.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
});

// --- CALENDAR DATE FUNCTIONALITY ---

let currentSelectedDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
        day.addEventListener('click', async (e) => {
            const dateStr = day.getAttribute('data-date');
            if (!dateStr) return;
            
            // Add click animation
            day.style.transform = 'scale(0.95)';
            setTimeout(() => {
                day.style.transform = 'scale(1.05)';
            }, 100);
            
            // Remove 'today' class from all days
            calendarDays.forEach(d => {
                d.classList.remove('today');
                d.style.transform = 'scale(1)';
            });
            
            // Add 'today' class to clicked day
            day.classList.add('today');
            
            // Update current selected date
            currentSelectedDate = dateStr;
            
            // Add loading state while fetching habits
            habitContainer.innerHTML = '<div class="loading-spinner">Loading habits for selected date...</div>';
            doneContainer.innerHTML = '<div class="loading-spinner">Loading completed habits...</div>';
            
            // Fetch habits for the selected date
            await loadHabitsForDate(dateStr);
        });
        
        // Add hover effects
        day.addEventListener('mouseenter', () => {
            if (!day.classList.contains('today')) {
                day.style.transform = 'translateY(-2px)';
            }
        });
        
        day.addEventListener('mouseleave', () => {
            if (!day.classList.contains('today')) {
                day.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Initial load with animation
    setTimeout(() => {
        loadCreatedHabits();
    }, 300);
});

// Function to load habits for a specific date
async function loadHabitsForDate(dateStr) {
    const COLOR_MAP = {
        Green: "green",
        Purple: "purple", 
        Red: "red",
        Blue: "blue",
        Gold: "gold",
    };

    if (!habitContainer || !doneContainer) {
        console.error("Habit containers not found");
        return;
    }

    try {
        const resp = await fetch(`/api/habit/recurring/date/${dateStr}/`, {
            method: "GET",
            credentials: "same-origin"
        });

        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const data = await resp.json();
        console.log("⇨ fetched data for date:", dateStr, data);

        // Clear containers
        habitContainer.innerHTML = "";
        doneContainer.innerHTML = "";

        // Process TODO habits with staggered animation
        if (data.todo && data.todo.length > 0) {
            data.todo.forEach((habitObj, index) => {
                setTimeout(() => {
                    const wrapper = createHabitElement(habitObj, COLOR_MAP, false);
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateX(-30px)';
                    habitContainer.appendChild(wrapper);
                    
                    // Animate in
                    setTimeout(() => {
                        wrapper.style.transition = 'all 0.4s ease';
                        wrapper.style.opacity = '1';
                        wrapper.style.transform = 'translateX(0)';
                    }, 50);
                }, index * 100);
            });
        } else {
            habitContainer.innerHTML = '<div class="empty-state">No habits for this date. Create one! ✨</div>';
        }

        // Process DONE habits with staggered animation
        if (data.done && data.done.length > 0) {
            data.done.forEach((habitObj, index) => {
                setTimeout(() => {
                    const wrapper = createHabitElement(habitObj, COLOR_MAP, true);
                    wrapper.style.opacity = '0';
                    wrapper.style.transform = 'translateX(30px)';
                    doneContainer.appendChild(wrapper);
                    
                    // Animate in
                    setTimeout(() => {
                        wrapper.style.transition = 'all 0.4s ease';
                        wrapper.style.opacity = '1';
                        wrapper.style.transform = 'translateX(0)';
                    }, 50);
                }, index * 100);
            });
        } else {
            doneContainer.innerHTML = '<div class="empty-state">No completed habits for this date. 🎯</div>';
        }

        // Update badges
        updateHabitBadges(data.todo?.length || 0, data.done?.length || 0);

    } catch (err) {
        console.error("Failed to load habits for date:", err);
        habitContainer.innerHTML = '<div class="error-state">Failed to load habits. Please refresh.</div>';
        doneContainer.innerHTML = '<div class="error-state">Failed to load completed habits.</div>';
        showNotification('Failed to load habits. Please refresh the page.', 'error');
    }
}

// --- KEYBOARD SHORTCUTS ---

document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closeModal();
        closeHabitEditor();
    }
    
    // Ctrl/Cmd + N opens new habit modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openModal();
    }
    
    // Ctrl/Cmd + R refreshes habits
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        loadCreatedHabits();
        showNotification('Habits refreshed!', 'info');
    }
});

// --- ENHANCED INTERACTIONS ---

// Add smooth scrolling to page sections
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add loading states and empty states styles
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .loading-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: var(--text-muted);
        font-style: italic;
    }
    
    .loading-spinner::before {
        content: '';
        width: 20px;
        height: 20px;
        border: 2px solid var(--border-color);
        border-top: 2px solid var(--accent-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 10px;
    }
    
    .empty-state, .error-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: var(--text-muted);
        font-style: italic;
        text-align: center;
        background: rgba(102, 126, 234, 0.05);
        border-radius: var(--radius-md);
        border: 2px dashed var(--border-color);
    }
    
    .error-state {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.05);
        border-color: rgba(239, 68, 68, 0.2);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .habit-text {
        flex: 1;
        font-weight: 500;
    }
    
    .notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(additionalStyles);

// --- ERROR HANDLING ---

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('A network error occurred. Please check your connection.', 'error');
});

// --- PERFORMANCE OPTIMIZATIONS ---

// Throttle function for scroll events
function throttle(func, wait) {
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

// Add scroll-based navbar transparency
const navbar = document.getElementById('navbar');
if (navbar) {
    const handleScroll = throttle(() => {
        const scrolled = window.scrollY > 50;
        navbar.style.background = scrolled ? 
            'rgba(255, 255, 255, 0.9)' : 
            'rgba(255, 255, 255, 0.95)';
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
}

// Lazy load animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
};

// Initialize lazy loading after DOM is ready
document.addEventListener('DOMContentLoaded', observeElements);

console.log('🎉 Habit Tracker initialized successfully!');