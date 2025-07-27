


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

        console.log("⇨ fetched data:", data);

// todo vs done habits filter

        for (const habitObj of data.todo) {
            const wrapper = document.createElement("div");
            wrapper.className = "habit-wrapper";

            const habit = document.createElement("div");
            habit.className = "habit";


            const check = document.createElement("img");
            check.src = window.STATIC_URLS.checkEmpty;
            check.alt = "check-empty";
            check.className = "check-empty";

            check.addEventListener("click", async () => {
                const isInToDo = wrapper.parentElement === habitContainer;
                if (isInToDo) {
                    doneContainer.appendChild(wrapper);
                    check.src = window.STATIC_URLS.checkDone;
                    check.alt = "check";
                    habit.style.backgroundColor = "#4E148C";


                    //posts to habit log
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

                } else {
                    habitContainer.appendChild(wrapper);
                    check.src = window.STATIC_URLS.checkEmpty;
                    check.alt = "check-empty";
                    habit.style.backgroundColor = "#295529";

                        // we remove from log 
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
                }
            });

            habit.appendChild(check);
            habit.appendChild(document.createTextNode(habitObj.name));
            wrapper.appendChild(habit);
            document.getElementById("habit-container").appendChild(wrapper);
        }
        // done habits logic so they don't show up after refresh as recurring habits on that day but show as Done tasks
    
        for (const habitObj of data.done) {
            const wrapper = document.createElement("div");
            wrapper.className = "habit-wrapper";

            const habit = document.createElement("div");
            habit.className = "habit";

            const check = document.createElement("img");
            check.src = window.STATIC_URLS.checkDone;
            check.alt = "check";
            check.className = "check-empty";

            check.addEventListener("click", async () => {
                habitContainer.appendChild(wrapper);
                check.src = window.STATIC_URLS.checkEmpty;
                check.alt = "check-empty";
                habit.style.backgroundColor = "#295529";

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
            });

            habit.appendChild(check);
            habit.appendChild(document.createTextNode(habitObj.name));
            wrapper.appendChild(habit);
            doneContainer.appendChild(wrapper); 
        }

    } catch (err) {
        console.error("Failed to load recurring habits:", err);
    }
}

function getCSRFToken() {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken"))
      ?.split("=")[1];
}



document.getElementById('streak-progress').addEventListener('click', () => {
    window.location.href = '/progress';
});


document.addEventListener("DOMContentLoaded", () => {
    loadCreatedHabits();
});
