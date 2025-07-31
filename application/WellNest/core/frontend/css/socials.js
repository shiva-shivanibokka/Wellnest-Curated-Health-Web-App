
//using modal for notification is easier use dive if necessary 

document.addEventListener('DOMContentLoaded', () => {
    const notifIcon = document.getElementById('notification-icon');
    const modal = document.getElementById('notification-modal');
    const closeModal = document.getElementById('close-modal');

    notifIcon.addEventListener('click', () => {
        modal.classList.remove('hidden');

        fetch('/api/notifications/')
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('notification-list');
                list.innerHTML = '';

                data.forEach(n => {
                    const li = document.createElement('li');
                    li.textContent = n.message;
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




document.addEventListener('DOMContentLoaded', function () {
    // ADD CIRCLE FUNCTION
    document.getElementById('addCircle').addEventListener('click', function () {
        const container = document.getElementById('wellNestCircles-container');

        const newCircle = document.createElement('div');
        newCircle.className = 'circle';
        newCircle.style.backgroundColor = '#6a994e';

        const titleDiv = document.createElement('div');
        const h3 = document.createElement('h3');
        h3.textContent = 'New Circle';
        titleDiv.appendChild(h3);

        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';

        const detail1 = document.createElement('div');
        detail1.textContent = 'Lorem ipsum dolor sit amet';
        const detail2 = document.createElement('div');
        detail2.textContent = '5 members';

        infoDiv.appendChild(detail1);
        infoDiv.appendChild(detail2);

        newCircle.appendChild(titleDiv);
        newCircle.appendChild(infoDiv);

        container.appendChild(newCircle);
    });

    // SEARCH FUNCTION
    document.getElementById('search-box').addEventListener('input', function () {
        const query = this.value.trim();

        const resultElement = document.getElementById('searchResults');
        const circlesResult = document.getElementById('circlesResult-list');  // Moved this line here

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

//csrf token don't touch
function getCSRFToken() {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken"))
      ?.split("=")[1];
}

        // CIRCLE MOCK SEARCH
        const mockCircles = [
            { name: 'Hackers United', task: 'Daily Hackathons', members: 12 },
            { name: 'Study Buddies', task: 'Weekly study sync', members: 5 },
            { name: 'Lorem Ipsum Crew', task: 'Lorem ipsum dolor sit amet', members: 8 }
        ];

        const filtered = mockCircles.filter(c =>
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

                const task = document.createElement('p');
                task.textContent = `Task: ${c.task}`;

                const members = document.createElement('p');
                members.textContent = `Members: ${c.members}`;

                circleCard.appendChild(name);
                circleCard.appendChild(task);
                circleCard.appendChild(members);

                circlesResult.appendChild(circleCard);
            });
        }
    });
});
