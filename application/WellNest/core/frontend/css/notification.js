// csrf helper
function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];
}

// check for unread notifications and toggle icon
async function checkUnreadNotifications() {
    try {
        const response = await fetch('/api/notifications/');
        const notifications = await response.json();

        const notifIcon = document.getElementById('notification-icon');
        const hasUnread = notifications.some(n => !n.is_read);

        if (notifIcon) {
            if (hasUnread) {
                notifIcon.src = notifIcon.src.replace('notification-off.png', 'notification-on.png');
            } else {
                notifIcon.src = notifIcon.src.replace('notification-on.png', 'notification-off.png');
            }
        }
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
}

async function markNotificationsAsRead() {
    try {
        await fetch('/api/notifications/mark-read/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        });

        const notifIcon = document.getElementById('notification-icon');
        if (notifIcon) {
            notifIcon.src = notifIcon.src.replace('notification-on.png', 'notification-off.png');
        }
    } catch (error) {
        console.error('Error marking notifications as read:', error);
    }
}

function setupNotificationModal() {
    const notifIcon = document.getElementById('notification-icon');
    const modal = document.getElementById('notification-modal');
    const closeModal = document.getElementById('close-modal');

    if (!notifIcon || !modal || !closeModal) return;

    notifIcon.addEventListener('click', () => {
        modal.classList.remove('hidden');
        markNotificationsAsRead();

        fetch('/api/notifications/')
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('notification-list');
                list.innerHTML = '';

                data.forEach(n => {
                    const li = document.createElement('li');
                    li.textContent = n.message;

                    if (n.message.includes("sent you a friend request") && n.request_id) {
                        const acceptBtn = document.createElement("button");
                        acceptBtn.textContent = "Accept";
                        acceptBtn.addEventListener("click", () => {
                            fetch('/api/friends/accept/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': getCSRFToken()
                                },
                                body: JSON.stringify({ request_id: n.request_id })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    alert(data.message || data.error);
                                    li.textContent = `${n.message} Accepted`;
                                    if (typeof loadFriendsList === 'function') loadFriendsList();
                                });
                        });
                        li.appendChild(acceptBtn);
                    }

                    list.appendChild(li);
                });
            });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkUnreadNotifications();
    setInterval(checkUnreadNotifications, 30000);
    setupNotificationModal();
});
