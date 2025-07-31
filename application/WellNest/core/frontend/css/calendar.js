

const container     = document.getElementById("habit-info");
const form          = document.getElementById("habit-form");
const habitEditor   = document.getElementById("habit-editor");
const habitContainer = document.getElementById("habit-container");
const addHabitBtn   = document.getElementById("add-habit-button");
const deleteHabit =  document.getElementById("delete-habit")

    habitContainer.addEventListener("click", () => {
    container.style.display = "none";
    form.style.display      = "none";
    habitEditor.classList = "on";
    form.reset();
    });

    addHabitBtn.addEventListener("click", () => {
    container.style.display = "block";
    form.style.display      = "block";
    habitEditor.classList = "";
    form.reset();
    });



//created habits
async function loadCreatedHabits() {
    const habitContainer = document.getElementById("habit-container");
    const doneContainer  = document.getElementById("done-container");

    const COLOR_MAP = {

    Green: "#295529",
    Purple: "#4E148C",
    Red: "#e74c3c",
    Blue: "#3498db",
    Gold: "#f1c40f",

    };

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
            habit.style.backgroundColor = COLOR_MAP[habitObj.color];

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
                    habit.style.backgroundColor = COLOR_MAP[habitObj.color] ;


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
                    habit.style.backgroundColor = COLOR_MAP[habitObj.color] ;

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

            habit.addEventListener("click", () => {

            habitEditor.classList.add = "on";

            //get habit info
            habitEditor.querySelector("h3").textContent = habitObj.name;
            habitEditor.querySelector("h4").textContent = habitObj.description;

            // show repeating days
            const editorDays = habitEditor.querySelectorAll(".d-box");
            editorDays.forEach(box => {
                box.classList.remove("selected");
                if (habitObj.weekdays?.includes(box.dataset.day)) {
                box.classList.add("selected");
                console.log("Selected:", box.dataset.day);
                }
            });

            // save data for if deleting
            habitEditor.dataset.name = habitObj.name;
            habitEditor.dataset.habitType = habitObj.habit_type;
            });

            wrapper.appendChild(habit);
            document.getElementById("habit-container").appendChild(wrapper);
        }
        // done habits logic so they don't show up after refresh as recurring habits on that day but show as Done tasks
    
        for (const habitObj of data.done) {
            const wrapper = document.createElement("div");
            wrapper.className = "habit-wrapper";

            const habit = document.createElement("div");
            habit.className = "habit";
            habit.style.backgroundColor = COLOR_MAP[habitObj.color] || "#ccc";

            const check = document.createElement("img");
            check.src = window.STATIC_URLS.checkDone;
            check.alt = "check";
            check.className = "check-empty";

            check.addEventListener("click", async () => {
                habitContainer.appendChild(wrapper);
                check.src = window.STATIC_URLS.checkEmpty;
                check.alt = "check-empty";
                habit.style.backgroundColor = COLOR_MAP[habitObj.color];

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

            habit.addEventListener("click", () => {

            habitEditor.classList = "on";

            //get habit info
            habitEditor.querySelector("h3").textContent = habitObj.name;
            habitEditor.querySelector("h4").textContent = habitObj.description;

            // show repeating days
            const editorDays = habitEditor.querySelectorAll(".d-box");
            editorDays.forEach(box => {
                box.classList.remove("selected");
                if (habitObj.weekdays?.includes(box.dataset.day)) {
                box.classList.add("selected");
                }
            });

            // save data for if deleting
            habitEditor.dataset.name = habitObj.name;
            habitEditor.dataset.habitType = habitObj.habit_type;
            });




            wrapper.appendChild(habit);
            doneContainer.appendChild(wrapper); 
        }

    } catch (err) {
        console.error("Failed to load recurring habits:", err);
    }




//deleting habit
deleteHabit.addEventListener("click", async () => {

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
        alert("Habit deleted.");
        habitEditor.classList.remove("on");
        loadCreatedHabits();  // refresh the habit list
    } else {
        alert("Delete failed: " + (result.error || resp.statusText));
    }
});


//cancel habit creation
const cancelHabitBtn = document.getElementById("cancel-habit-creation");

cancelHabitBtn.addEventListener("click", () => {
    container.style.display = "none";
    form.style.display = "none";
    form.reset(); // clear form
});

// close editor
const habitEditor = document.getElementById("habit-editor");
const closeEditorBtn = document.getElementById("close-editor");
closeEditorBtn.addEventListener("click", () => {
    habitEditor.classList.remove("on");
});



  

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
