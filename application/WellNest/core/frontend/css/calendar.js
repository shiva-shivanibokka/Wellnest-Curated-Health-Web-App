
  const habitContainer = document.getElementById("habit-container");
  const habitInfo      = document.getElementById("habit-info");

  // Show info when clicking a habit
  habitContainer.addEventListener("click", e => {
    const habit = e.target.closest(".habit");
    if (habit) {
      const habitName = habit.textContent.trim();
      habitInfo.querySelector("h3").textContent = habitName;
      habitInfo.querySelector("p").textContent  = `Description for ${habitName}`;
      habitInfo.style.display = "block";
      return; 
    }
  });

  // Hide info when clicking anywhere else
  document.addEventListener("click", e => {
    const clickedHabit     = e.target.closest(".habit");
    const clickedInfoPanel = e.target.closest("#habit-info");
    if (!clickedHabit && !clickedInfoPanel) {
      habitInfo.style.display = "none";
    }
  });


    document.getElementById('streak-progress').addEventListener('click', () => {
        window.location.href = '/progress';
    });


   // JS habit creator 
console.log('document.cookie =', document.cookie);
const addHabitButton = document.querySelector(".main-button");
const doneContainer = document.getElementById("done-container");

let count = 1;

function createHabitElement(text) {
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
    habit.appendChild(document.createTextNode(text));
    wrapper.appendChild(habit);
    return wrapper;
}


addHabitButton.addEventListener("click", () => {
    const newHabit = createHabitElement(`New Habit ${count++}`);
    habitContainer.appendChild(newHabit);
});

document.querySelectorAll(".check-empty").forEach(check => {
    check.addEventListener("click", () => {
        const wrapper = check.closest(".habit-wrapper");
        const habit = wrapper.querySelector(".habit");
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
});

//water habit 
document.getElementById("water-habit").addEventListener("click", async () => {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch("/api/water/add/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
        },
        credentials: "same-origin"
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message); 
    } else {
        alert("Failed: " + (data.detail || "Unknown error"));
    }
});
//created habits
async function loadCreatedHabits() {
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
document.addEventListener("DOMContentLoaded", () => {
    loadCreatedHabits();
});