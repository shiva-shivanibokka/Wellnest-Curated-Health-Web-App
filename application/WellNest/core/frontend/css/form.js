document.addEventListener("DOMContentLoaded", () => {
  const addHabitBtn   = document.getElementById("add-habit-button");
  const container     = document.getElementById("habit-info");
  const form          = document.getElementById("habit-form");
  const csrfToken     = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  const habitEditor   = document.getElementById("habit-editor");

  // Show the form container
  addHabitBtn.addEventListener("click", () => {
    container.style.display = "block";
    form.style.display      = "block";
    habitEditor.classList = "off";
    form.reset();
  });

  // Toggle weekdays
  form.querySelectorAll(".day-box").forEach(box =>
    box.addEventListener("click", () => box.classList.toggle("selected"))
  );

  // Value‐input dynamic placeholder & constraints 
  const valueInput = document.getElementById("value-input");
  document.getElementById("habit-type").addEventListener("change", function () {
    const type = this.value;
    switch (type) {
      case "water":
        valueInput.min = 0;
        valueInput.max = 160;
        valueInput.placeholder = "oz (0–160)";
        valueInput.style.width = "100px";
        break;
      case "food":
        valueInput.min = 0;
        valueInput.max = 5000;
        valueInput.placeholder = "calories (0–5000)";
        valueInput.style.width = "150px";
        break;
      case "sleep":
        valueInput.min = 0;
        valueInput.max = 24;
        valueInput.placeholder = "hours (0–24)";
        valueInput.style.width = "100px";
        break;
      case "workout":
        valueInput.min = 0;
        valueInput.max = 12;
        valueInput.placeholder = "hours (0–12)";
        valueInput.style.width = "100px";
        break;
      default:
        valueInput.removeAttribute("min");
        valueInput.removeAttribute("max");
        valueInput.placeholder = "Enter value";
    }
    valueInput.value = "";
  });

  //  Form submission & value validation 
  form.addEventListener("submit", async e => {
    // Front‐end range check
    const habitType = document.getElementById("habit-type").value;
    const val       = parseFloat(valueInput.value);
    let min = 0, max = Infinity;
    if (habitType === "water")    max = 160;
    else if (habitType === "food")   max = 5000;
    else if (habitType === "sleep")  max = 24;
    else if (habitType === "workout")max = 12;

    if (isNaN(val) || val < min || val > max) {
      e.preventDefault();
      alert(`Please enter a valid ${habitType} value between ${min} and ${max}.`);
      valueInput.focus();
      return;
    }

    e.preventDefault();

    // Build payload
    const payload = {
      name:        document.getElementById("habit-form-name").value.trim(),
      description: document.getElementById("habit-form-description").value.trim(),
      color:       document.getElementById("color-picker").value,
      habit_type:  habitType,
      value:       val,
      weekdays:    Array.from(form.querySelectorAll(".day-box.selected"))
                         .map(el => el.dataset.day),
    };

    // Basic field check
    if (!payload.name || !payload.description || !payload.color
        || !payload.habit_type || !payload.weekdays.length) {
      return alert("Please complete all fields and select at least one day.");
    }

    // POST to unified endpoint
    const resp = await fetch("/api/habit/recurring/", {
      method:      "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken":  csrfToken,
      },
      body: JSON.stringify(payload),
    });

    if (resp.ok) {
      alert("Habit added!");
      form.reset();
      form.style.display      = "none";
      container.style.display = "none";
      loadCreatedHabits();    // GET+ display function
    } else {
      const err = await resp.json();
      alert("Error: " + JSON.stringify(err));
    }
  });
});

