
const habitContainer = document.getElementById("habit-container");

//created habits
async function loadCreatedHabits() {
    const habitContainer = document.getElementById("habit-container");
    const doneContainer  = document.getElementById("done-container");
    habitContainer.innerHTML = "";
    doneContainer.innerHTML  = "";
    try {
        const resp = await fetch("/api/habit/recurring/today/", {
            method: "GET",
            credentials: "same-origin"
        });
        const data = await resp.json();


        for (const habitObj of data.habits) {
            const wrapper = document.createElement("div");
            wrapper.className = "habit-wrapper";

            const habit = document.createElement("div");
            habit.className = "habit";

            const check = document.createElement("img");
            check.src = window.STATIC_URLS.checkEmpty;
            check.alt = "check-empty";
            check.className = "check-empty";

            check.addEventListener("click", () => {
                const isInToDo = wrapper.parentElement === habitContainer;
                if (isInToDo) {
                    doneContainer.appendChild(wrapper);
                    check.src = window.STATIC_URLS.checkDone;
                    check.alt = "check";
                    habit.style.backgroundColor = "#4E148C";
                } else {
                    habitContainer.appendChild(wrapper);
                    check.src = window.STATIC_URLS.checkEmpty;
                    check.alt = "check-empty";
                    habit.style.backgroundColor = "#295529";
                }
            });

            habit.appendChild(check);
            habit.appendChild(document.createTextNode(habitObj.name));
            wrapper.appendChild(habit);
            document.getElementById("habit-container").appendChild(wrapper);
        }
    } catch (err) {
        console.error("Failed to load recurring habits:", err);
    }
}


document.getElementById('streak-progress').addEventListener('click', () => {
    window.location.href = '/progress';
});


document.addEventListener("DOMContentLoaded", () => {
    loadCreatedHabits();
});