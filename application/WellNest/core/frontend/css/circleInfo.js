document.addEventListener('DOMContentLoaded', () => {
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
                    document.getElementById('circle-description').textContent = data.description;
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
});
