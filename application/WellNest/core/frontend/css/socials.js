
//csrf token let be at the top of the page
function getCSRFToken() {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken"))
        ?.split("=")[1];
}

const getUserCircles = async () => {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    const res = await fetch("/api/circles/", requestOptions)
    return res.json();
}


//using modal for notification is easier use dive if necessary 

document.addEventListener('DOMContentLoaded', () => {
    const notifIcon = document.getElementById('notification-icon');
    const modal = document.getElementById('notification-modal');
    const closeModal = document.getElementById('close-modal');

notifIcon.addEventListener('click', () => {
    modal.classList.remove('hidden');

    // change icon to off
    markNotificationsAsRead();

    fetch('/api/notifications/')
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('notification-list');
            list.innerHTML = '';

            data.forEach(n => {
                const li = document.createElement('li');
                li.textContent = n.message;

                // Friend request logic 
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
                                loadFriendsList();
                            })
                            .catch(err => console.error("Error accepting friend request:", err));
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
});

//Read and unread notifications
const checkUnreadNotifications = async () => {
    try {
        const response = await fetch('/api/notifications/');
        const notifications = await response.json();
        
        const notifIcon = document.getElementById('notification-icon');
        const hasUnread = notifications.some(n => !n.is_read);
        
        if (hasUnread) {
            notifIcon.src = notifIcon.src.replace('notification-off.png', 'notification-on.png');
        } else {
            notifIcon.src = notifIcon.src.replace('notification-on.png', 'notification-off.png');
        }
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
};

const markNotificationsAsRead = async () => {
    try {
        await fetch('/api/notifications/mark-read/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        });

        // Turn the bell off
        const notifIcon = document.getElementById('notification-icon');
        notifIcon.src = notifIcon.src.replace('notification-on.png', 'notification-off.png');
    } catch (error) {
        console.error('Error marking notifications as read:', error);
    }
};







document.addEventListener('DOMContentLoaded', function () {
    // ADD CIRCLE FUNCTION
    document.getElementById('addCircle').addEventListener('click', async function () {
        const formDiv = document.querySelector('#createWellnestCircle');
        formDiv.style.display = 'flex';
    });

    document.querySelector('#createWellnestCircle').addEventListener('click', (event) => {
        const formDiv = document.querySelector('#createWellnestCircle');
        if (event.target == formDiv) {
            formDiv.style.display = 'none';
        }
    })

    // SEARCH FUNCTION
    document.getElementById('search-box').addEventListener('input', async function () {
        const query = this.value.trim();

        const resultElement = document.getElementById('searchResults');
        const circlesResult = document.getElementById('circlesResult-list'); 

        if (query.length === 0) {
            resultElement.textContent = '';
            circlesResult.textContent = '';
            return;
        }

        // user search and invite
        fetch(`/api/users/search/?search=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                console.log("Search result:", data);
                resultElement.innerHTML = '';
                resultElement.innerHTML = '';
                if (data.length === 0) {
                    resultElement.textContent = 'No matching users found.';
                } else {
                    data.forEach(user => {
                        const userCard = document.createElement('div');
                        userCard.style.display = "flex";
                        userCard.style.flexDirection = "column";
                        userCard.style.border = '1px solid #ccc';
                        userCard.style.borderRadius = '10px';
                        userCard.style.padding = '10px';
                        userCard.style.marginBottom = '10px';
                        userCard.style.backgroundColor = '#f9f9f9';
                        userCard.style.maxWidth = "400px";

                        // INFO ROW 
                        const infoRow = document.createElement('div');
                        infoRow.style.display = "flex";
                        infoRow.style.justifyContent = "space-between";
                        infoRow.style.gap = "10px";
                        infoRow.style.flexWrap = "wrap";

                        const username = document.createElement('p');
                        username.textContent = `Username: ${user.username}`;
                        infoRow.appendChild(username);

                        const fullName = document.createElement('p');
                        fullName.textContent = `Full Name: ${user.first_name} ${user.last_name}`;
                        infoRow.appendChild(fullName);

                        const gender = document.createElement('p');
                        gender.textContent = `Gender: ${user.gender}`;
                        infoRow.appendChild(gender);

                        userCard.appendChild(infoRow);

                        // invite ppl
                        const invite = document.createElement('button');
                        invite.textContent = "Invite";
                        invite.style.width = '80px';
                        invite.style.height = '30px';
                        invite.style.border = '1px solid black';
                        invite.style.borderRadius = '5px';
                        invite.style.padding = '5px';
                        invite.style.backgroundColor = "blue";
                        invite.style.color = "white";
                        invite.style.cursor = "pointer";
                        invite.style.marginTop = "10px";

                        // sending invite method
                        invite.addEventListener('click', () => {
                            console.log("Sending invite to user ID:", user.id);
                            fetch('/api/friends/send/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken': getCSRFToken()
                                },
                                body: JSON.stringify({
                                    receiver_id: user.id
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    alert(data.message || data.error);
                                })
                                .catch(err => {
                                    console.error('Error sending invite:', err);
                                });
                        });

                        userCard.appendChild(invite);
                        resultElement.appendChild(userCard);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                resultElement.textContent = 'An error occurred.';
            });



        // CIRCLE MOCK SEARCH
        const res = await fetch('/api/circles/search/?name=' + encodeURIComponent(query));
        const data = await res.json();
        console.log(data)

        const filtered = data.circles.filter(c =>
            c.name.toLowerCase().includes(query.toLowerCase())
        );

        circlesResult.innerHTML = '';

        if (filtered.length === 0) {
            circlesResult.textContent = 'No matching circles found.';
        } else {
            filtered.forEach(c => {
                const circleCard = document.createElement('div');
                circleCard.style.border = '1px solid #ccc';
                circleCard.style.borderRadius = '10px';
                circleCard.style.padding = '10px';
                circleCard.style.marginBottom = '10px';
                circleCard.style.backgroundColor = '#e6f4ea';

                const name = document.createElement('h4');
                name.textContent = c.name;

                const description = document.createElement('p');
                description.textContent = `Description: ${c.description}`;

                const members = document.createElement('p');
                members.textContent = `Member Count: ${c.member_count}`;

                circleCard.appendChild(name);
                circleCard.appendChild(description);
                circleCard.appendChild(members);

                if (!c.is_member) {
                    const joinBtn = document.createElement('button');
                    joinBtn.textContent = "Join";
                    joinBtn.style.marginTop = '10px';
                    joinBtn.style.padding = '5px 10px';
                    joinBtn.style.border = 'none';
                    joinBtn.style.borderRadius = '5px';
                    joinBtn.style.backgroundColor = '#4CAF50';
                    joinBtn.style.color = 'white';
                    joinBtn.style.cursor = 'pointer';

                    joinBtn.addEventListener('click', async () => {
                        try {
                            const res = await fetch(`/api/circle/join/${c.id}/`, {
                                method: 'POST',
                                headers: {
                                    'X-CSRFToken': getCSRFToken()
                                }
                            });

                            const result = await res.json();
                            if (result.success) {
                                alert(`Joined "${c.name}" successfully!`);
                                joinBtn.disabled = true;
                                joinBtn.textContent = "Joined";
                            } else {
                                alert(result.error || "Failed to join circle");
                            }

                        
                            loadUserCircles();
                        } catch (error) {
                            console.error("Error joining circle:", error);
                        }
                    });

                    circleCard.appendChild(joinBtn);
                }

                circlesResult.appendChild(circleCard);
            });
        }
    });





});

    // display friends on page load
    const loadFriendsList = async () => {
        try {
            const res = await fetch('/api/friends/list/');
            const data = await res.json();
            const friendsList = document.getElementById('friends-list');
            friendsList.innerHTML = ''; // clear placeholder

            data.forEach(friend => {
                const friendBox = document.createElement('div');
                friendBox.id = 'friend-element-info';
                const name = document.createElement('h3');
                name.textContent = `${friend.first_name} ${friend.last_name || ''}` || friend.username;
                friendBox.appendChild(name);

                const wrapper = document.createElement('div');
                wrapper.id = 'friend-element';
                wrapper.style.display = "flex";
                wrapper.appendChild(friendBox);

                friendsList.appendChild(wrapper);
            });
        } catch (err) {
            console.error("Error loading friends:", err);
        }
    };






// add circles and link with habit

document.querySelector('#create-circle-button').addEventListener('click', async function (e) {
    const name = document.querySelector('#circle-name').value;
    const description = document.querySelector('#circle-description').value;

    const raw = JSON.stringify({ name, description });

    const res = await fetch("/api/circle/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: raw,
    });

    const data = await res.json();
    if (!data.success) return;

    document.querySelector('#createWellnestCircle').style.display = 'none';

    // Show habit modal
    const modal = document.getElementById('habitTemplateModal');
    modal.style.display = 'block';

    // Store circle ID
    modal.dataset.circleId = data.circle_id;
});

document.querySelector('#createHabitTemplateForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const modal = document.getElementById('habitTemplateModal');
    const circleId = modal.dataset.circleId;

    const name = document.querySelector('#habit-name').value;
    const habit_type = document.querySelector('#habit-type').value;
    const color = document.querySelector('#habit-color').value;
    const weekdays = Array.from(document.querySelectorAll('input[name="weekdays"]:checked'))
    .map(cb => cb.value);

    const body = JSON.stringify({
        circle_id: circleId,
        name,
        habit_type,
        color,
        weekdays
    });

    await fetch("/api/circle/habit-template/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
    });

    // Close modal and refresh
    modal.style.display = 'none';
    loadUserCircles();
});
document.getElementById('close-habit-modal').addEventListener('click', () => {
    document.getElementById('habitTemplateModal').style.display = 'none';
});

    const loadUserCircles = async () => {
        const circles = await getUserCircles();
        if (!circles.success) return;

        const circlesDiv = document.querySelector('#wellNestCircles-container');
        circlesDiv.innerHTML = circles.circles.map(circle => {
            return `<div class="circle" data-circle-id="${circle.id}" style="cursor:pointer;">
                <div>
                    <h3>${circle.name}</h3>
                </div>
                <div class="info">
                    <div>${circle.description}</div>
                    <div>${circle.member_count} members</div>
                </div>
            </div>`;
        }).join('');

        // Add event listeners to each circle
        document.querySelectorAll('.circle').forEach(el => {
            el.addEventListener('click', async () => {
                const id = el.dataset.circleId;
                const res = await fetch(`/api/circle/details/${id}/`);
                const data = await res.json();

                if (data.success) {
                    document.getElementById('circle-title').textContent = data.name;
                    document.getElementById('circle-description-info').textContent = data.description;
                    document.getElementById('circle-habit').textContent = data.habit_name;
                    document.getElementById('circle-members-count').textContent = data.member_count;

                    // Top 5 members
                    const topList = document.getElementById('top-members-list');
                    topList.innerHTML = '';
                    data.top_members.forEach((member, index) => {
                        const li = document.createElement('li');
                        li.textContent = `${index + 1}. ${member.user__username} - Streak: ${member.streak}`;
                        topList.appendChild(li);
                    });

                    // User placement
                    document.getElementById('your-placement').textContent = data.user_placement;

                    document.getElementById('circle-info-modal').classList.remove('hidden');
                }
            });
        });
    };

    
    loadUserCircles();

    // Safe modal handling
    const closeBtn = document.getElementById('close-circle-info');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('circle-info-modal').classList.add('hidden');
        });
    }

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('circle-info-modal');
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });


document.querySelector('#add-friends-button').addEventListener("click", () => {
    const searchBox = document.getElementById("search-box");


    searchBox.classList.toggle("active");
    if (searchBox.classList.contains("active")) {
        searchBox.focus();
    }
});



document.addEventListener('DOMContentLoaded', async () => {

    // Check for unread notifications
    checkUnreadNotifications();
    loadFriendsList();
    // Check for new notifications every 30 seconds
    setInterval(checkUnreadNotifications, 30000);
});

