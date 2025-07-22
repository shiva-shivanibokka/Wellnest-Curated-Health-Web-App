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

        // === USER SEARCH ===
        fetch(`/api/users/search/?search=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                resultElement.innerHTML = '';
                if (data.length === 0) {
                    resultElement.textContent = 'No matching users found.';
                } else {
                    data.forEach(user => {
                        const userCard = document.createElement('div');
                        userCard.style.display = "flex";
                        userCard.style.justifyContent = "space-between";
                        userCard.style.border = '1px solid #ccc';
                        userCard.style.borderRadius = '10px';
                        userCard.style.padding = '5px';
                        userCard.style.marginBottom = '10px';
                        userCard.style.backgroundColor = '#f9f9f9';
                        userCard.style.maxWidth = "400px";

                        const username = document.createElement('p');
                        username.textContent = `Username: ${user.username}`;
                        userCard.appendChild(username);

                        const fullName = document.createElement('p');
                        fullName.textContent = `Full Name: ${user.first_name} ${user.last_name}`;
                        userCard.appendChild(fullName);

                        const gender = document.createElement('p');
                        gender.textContent = `Gender: ${user.gender}`;
                        userCard.appendChild(gender);

                        resultElement.appendChild(userCard);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                resultElement.textContent = 'An error occurred.';
            });

        // === CIRCLE MOCK SEARCH === (this part is chatGPT Code for now) 
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
