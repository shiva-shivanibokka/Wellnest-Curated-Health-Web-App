//Dialogs 
const habitModal        = document.getElementById('habit-modal');
const habitEditorModal  = document.getElementById('habit-editor-modal');
const addHabitBtn       = document.getElementById('add-habit-button');
const closeButtons      = document.querySelectorAll('.close-btn');
const form              = document.getElementById('habit-form');
const deleteHabitBtn    = document.getElementById('delete-habit');
const habitContainer    = document.getElementById('habit-container');
const doneContainer     = document.getElementById('done-container');


addHabitBtn.addEventListener('click', () => {
  if (window.IS_AUTHENTICATED) {
    form.reset();
    habitModal.showModal();
  } else {
    const dialog = document.getElementById("signinDialog");
    if (dialog) dialog.showModal();
  }
});

closeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const dlg = document.getElementById(btn.dataset.dialogId);
    if (dlg) dlg.close();
  });
});

[habitModal, habitEditorModal].forEach(dlg => {
  dlg.addEventListener('click', e => {
    if (e.target === dlg) dlg.close();
  });
});

// Load Habits
async function loadCreatedHabits() {
  habitContainer.innerHTML = '';
  doneContainer.innerHTML  = '';

  const COLOR_MAP = {
    Green:  '#295529',
    Purple: '#4E148C',
    Red:    '#e74c3c',
    Blue:   '#3498db',
    Gold:   '#c5a522ff',
  };

  try {
    const resp = await fetch('/api/habit/recurring/today/', {
      method: 'GET',
      credentials: 'same-origin'
    });
    const { todo, done } = await resp.json();

 function renderList(list, container, doneFlag) {
      list.forEach(habitObj => {
        const wrapper = document.createElement('div');
        wrapper.className = 'habit-wrapper';


        const habit = document.createElement('div');
        habit.className = 'habit';
        habit.style.backgroundColor = COLOR_MAP[habitObj.color] || '#ccc';


        // Check icon
        const check = document.createElement('img');
        check.src = doneFlag ? window.STATIC_URLS.checkDone : window.STATIC_URLS.checkEmpty;
        check.className = 'check-empty';
        check.addEventListener('click', async (event) => {
          event.stopPropagation();
        const isInToDo = wrapper.parentElement === habitContainer;
 
        // todo and done
        if (isInToDo) {
            wrapper.remove();
            doneContainer.append(wrapper);
            check.src = window.STATIC_URLS.checkDone;


            // POST a new log
            await fetch('/api/habit/log/', {
            method:      'POST',
            credentials: 'same-origin',
            headers:     { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
            body:        JSON.stringify({
                name:        habitObj.name,
                habit_type:  habitObj.habit_type,
                description: habitObj.description  || '',
                color:       habitObj.color,
                value:       habitObj.value        || null
            })
            });
            await refreshStreak();


        } else {
   
            wrapper.remove();
            habitContainer.append(wrapper);
            check.src = window.STATIC_URLS.checkEmpty;
            const today = new Date();
            const localDateStr = today.toLocaleDateString('en-CA');


            // DELETE the existing log
            await fetch('/api/habit/log/delete/', {
            method:      'DELETE',
            credentials: 'same-origin',
            headers:     { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
            body:        JSON.stringify({
                name:       habitObj.name,
                habit_type: habitObj.habit_type,
                date: localDateStr
            })
            });
            await refreshStreak();
        }
        });


      // Habit name and days in cards
      const textWrapper = document.createElement('div');
      textWrapper.className = 'habit-text-wrapper';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'habit-name';
      nameDiv.textContent = habitObj.name;

      const daysDiv = document.createElement('div');
      daysDiv.className = 'habit-days';
      const dayInitialMap = {
        Monday: 'M', Tuesday: 'T', Wednesday: 'W', Thursday: 'Th',
        Friday: 'F', Saturday: 'Sa', Sunday: 'Su'
      };
      const initials = habitObj.weekdays.map(day => dayInitialMap[day] || day[0]);
      daysDiv.textContent = initials.join(' ');

      textWrapper.appendChild(nameDiv);
      textWrapper.appendChild(daysDiv);

      habit.appendChild(check);
      habit.appendChild(textWrapper);
      wrapper.appendChild(habit);
      container.appendChild(wrapper);

        //EDITOR
        habit.addEventListener('click', () => {
          document.getElementById('editor-name').textContent = habitObj.name;
          document.getElementById('editor-desc').textContent = habitObj.description || '';

          document.getElementById('editor-description').value = habitObj.description || '';
          document.getElementById('editor-color').value       = habitObj.color;

          //selected days
          document.querySelectorAll('#habit-editor-modal .d-box')
            .forEach(box => {
              box.classList.toggle(
                'selected',
                habitObj.weekdays.includes(box.dataset.day)
              );
            });

          habitEditorModal.dataset.name      = habitObj.name;
          habitEditorModal.dataset.habitType = habitObj.habit_type;
          habitEditorModal.showModal();
        });
      });
    }

    renderList(todo, habitContainer, false);
    renderList(done, doneContainer, true);

  } catch (err) {
    console.error('Failed to load recurring habits:', err);
  }
}

// Editor Delete habit 
deleteHabitBtn.addEventListener('click', async () => {
  await fetch('/api/habit/recurring/delete/', {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
    body: JSON.stringify({
      name: habitEditorModal.dataset.name,
      habit_type: habitEditorModal.dataset.habitType
    })
  });
  habitEditorModal.close();
  loadCreatedHabits();
});

const saveBtn = document.getElementById('save-habit');
if (saveBtn) {
  saveBtn.addEventListener('click', async () => {
    const updatedDesc  = document.getElementById('editor-description').value.trim();
    const updatedColor = document.getElementById('editor-color').value;
    const name         = habitEditorModal.dataset.name;
    const type         = habitEditorModal.dataset.habitType;

    const resp = await fetch('/api/habit/recurring/update/', {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      body: JSON.stringify({
        name:        name,
        habit_type:  type,
        description: updatedDesc,
        color:       updatedColor
      })
    });

    if (resp.ok) {
      habitEditorModal.close();
      loadCreatedHabits();
    } else {
      const err = await resp.json();
      alert('Update failed: ' + JSON.stringify(err));
    }
  });
}



// Add habit form
form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    name:        form.querySelector('#habit-form-name').value.trim(),
    description: form.querySelector('#habit-form-description').value.trim(),
    color:       form.querySelector('#color-picker').value,
    habit_type:  form.querySelector('#habit-type').value,
    value:       parseFloat(form.querySelector('#value-input').value) || null,
    weekdays:    Array.from(form.querySelectorAll('.day-box.selected'))
                    .map(el => el.dataset.day)
  };

  const resp = await fetch('/api/habit/recurring/', {
    method:      'POST',
    credentials: 'same-origin',
    headers:      { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
    body:        JSON.stringify(payload)
  });

  if (resp.ok) {
    habitModal.close();
    loadCreatedHabits();
  } else {
    const err = await resp.json();
    alert('Error: ' + JSON.stringify(err));
  }
});

function initDayToggles() {
  // Add-habit form day boxes
  document
    .querySelectorAll('#habit-modal .day-box')
    .forEach(box =>
      box.addEventListener('click', () => box.classList.toggle('selected'))
    );
}

function initValuePlaceholder() {
  const habitType      = document.getElementById('habit-type');
  const valueInput     = document.getElementById('value-input');
  habitType.addEventListener('change', () => {
    const type = habitType.value;
    switch (type) {
      case 'water':
        valueInput.min         = 0;
        valueInput.max         = 160;
        valueInput.placeholder = 'oz (0–160)';
        valueInput.style.width = '200px';
        break;
      case 'food':
        valueInput.min         = 0;
        valueInput.max         = 5000;
        valueInput.placeholder = 'calories (0–5000)';
        valueInput.style.width = '200px';
        break;
      case 'sleep':
        valueInput.min         = 0;
        valueInput.max         = 24;
        valueInput.placeholder = 'hours (0–24)';
        valueInput.style.width = '200px';
        break;
      case 'workout':
        valueInput.min         = 0;
        valueInput.max         = 12;
        valueInput.placeholder = 'hours (0–12)';
        valueInput.style.width = '200px';
        break;
      default:
        valueInput.removeAttribute('min');
        valueInput.removeAttribute('max');
        valueInput.placeholder = 'Enter value';
        valueInput.style.width = 'auto';
    }

    valueInput.value = '';
  });
}

//csrf
function getCSRFToken() {
  return document.cookie.split('; ')
    .find(r => r.startsWith('csrftoken'))
    ?.split('=')[1];
}

document.addEventListener('DOMContentLoaded', function () {
  const dayBoxes = document.querySelectorAll('#calendarDates .days');

dayBoxes.forEach(day => {
  day.addEventListener('click', () => {
    
    dayBoxes.forEach(d => {
      d.classList.remove('selected-day', 'unselected');
      if (d.classList.contains('today-box')) {
        d.classList.add('unselected');
      }
    });

    // mark clicked
    day.classList.add('selected-day');
    day.classList.remove('unselected');

    // Get the date from text
    const dateText = day.innerText; 
    const dateObj = new Date(dateText + ' ' + new Date().getFullYear());

    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    fetchHabitsForDate(formattedDate);
      });
    });
  });
  async function fetchHabitsForDate(dateStr) {
  try {
    const resp = await fetch(`/api/habit/recurring/date/?date=${dateStr}`, {
      credentials: 'same-origin'
    });
    const { todo, done } = await resp.json();
    renderHabits(todo, done);
  } catch (err) {
    console.error("Error loading habits for date", dateStr, err);
  }
}

function renderHabits(todoList, doneList) {
  habitContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  const COLOR_MAP = {
    Green:  '#295529',
    Purple: '#4E148C',
    Red:    '#e74c3c',
    Blue:   '#3498db',
    Gold:   '#c5a522ff',
  };

function renderList(list, container, doneFlag) {
  list.forEach(habitObj => {
    const wrapper = document.createElement('div');
    wrapper.className = 'habit-wrapper';

    const habit = document.createElement('div');
    habit.className = 'habit';
    habit.style.backgroundColor = COLOR_MAP[habitObj.color] || '#ccc';

    // Check icon
    const check = document.createElement('img');
    check.src = doneFlag ? window.STATIC_URLS.checkDone : window.STATIC_URLS.checkEmpty;
    check.className = 'check-empty';

    // Habit name and days
    const textWrapper = document.createElement('div');
    textWrapper.className = 'habit-text-wrapper';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'habit-name';
    nameDiv.textContent = habitObj.name;

    const daysDiv = document.createElement('div');
    daysDiv.className = 'habit-days';
    const dayInitialMap = {
      Monday: 'M', Tuesday: 'T', Wednesday: 'W', Thursday: 'Th',
      Friday: 'F', Saturday: 'Sa', Sunday: 'Su'
    };
    const initials = habitObj.weekdays.map(day => dayInitialMap[day] || day[0]);
    daysDiv.textContent = initials.join(' ');

    textWrapper.appendChild(nameDiv);
    textWrapper.appendChild(daysDiv);

    habit.appendChild(check);
    habit.appendChild(textWrapper);
    wrapper.appendChild(habit);
    container.appendChild(wrapper);

    // editor modal 
    habit.addEventListener('click', (e) => {
      // prevent opening editor if the check icon was clicked
      if (e.target.classList.contains('check-empty')) return;

      document.getElementById('editor-name').textContent = habitObj.name;
      document.getElementById('editor-desc').textContent = habitObj.description || '';

      document.getElementById('editor-description').value = habitObj.description || '';
      document.getElementById('editor-color').value = habitObj.color;
      
        //selected days
      document.querySelectorAll('#habit-editor-modal .d-box')
        .forEach(box => {
          box.classList.toggle('selected', habitObj.weekdays.includes(box.dataset.day));
        });

      habitEditorModal.dataset.name = habitObj.name;
      habitEditorModal.dataset.habitType = habitObj.habit_type;
      habitEditorModal.showModal();
    });
  });
}

  renderList(todoList, habitContainer, false);
  renderList(doneList, doneContainer, true);
}



function showHabitRecommendation() {
  const habitSuggestion = {
    name: 'Drink Water',
    description: 'stay hydrated',
    color: 'Blue',
    habit_type: 'water',
    value: 64,
    weekdays: ['Monday', 'Wednesday', 'Friday']
  };

  const dialog = document.getElementById('recommendation-modal');

  if (!dialog) {
    console.error("recommendation-modal not found!");
    return;
  }

  dialog.showModal();

 document.getElementById('acceptHabitBtn').onclick = () => {
  localStorage.setItem('recommendedHabit', JSON.stringify(habitSuggestion));
  localStorage.setItem('hasSeenRecommendation', 'true'); 
  dialog.close();
  localStorage.removeItem('comingFromSurvey');

  if (!window.IS_AUTHENTICATED) {
    setTimeout(() => {
      const signinDialog = document.getElementById('signinDialog');
      if (signinDialog) signinDialog.showModal();
    }, 200);
  }
};
}


function waitForAuthAndPostHabit(retries = 10) {
  if (window.IS_AUTHENTICATED) {
    const habit = JSON.parse(localStorage.getItem('recommendedHabit') || '{}');
    if (!habit.name) return;
    localStorage.removeItem('recommendedHabit');
    fetch('/api/habit/recurring/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      body: JSON.stringify(habit)
    }).then(async resp => {
      if (resp.ok) {
        localStorage.removeItem('recommendedHabit');
        localStorage.removeItem('comingFromSurvey');
        localStorage.removeItem('signupCompleted');
        localStorage.setItem('hasSeenRecommendation', 'true');
        loadCreatedHabits?.();
        alert(`Habit "${habit.name}" has been added!`);
      } else {
        const err = await resp.json();
        console.error("Habit creation failed:", err);
      }
    });

  } else if (retries > 0) {
    setTimeout(() => waitForAuthAndPostHabit(retries - 1), 500);
  } else {
    console.warn("User never authenticated. Skipping habit creation.");
  }}

document.addEventListener('DOMContentLoaded', () => {
  initDayToggles?.();
  initValuePlaceholder?.();
  loadCreatedHabits?.();

  const savedHabit = localStorage.getItem('recommendedHabit');
  const justSignedUp = localStorage.getItem('signupCompleted') === 'true';
  const comingFromSurvey = localStorage.getItem('comingFromSurvey') === 'true';
  const hasSeenRecommendation = localStorage.getItem('hasSeenRecommendation') === 'true';

  
  if (savedHabit && justSignedUp) {
    waitForAuthAndPostHabit(); 
  }


 if (!window.IS_AUTHENTICATED && comingFromSurvey && !hasSeenRecommendation) {
  showHabitRecommendation();
}

  const dayBoxes = document.querySelectorAll('#calendarDates .days');
  dayBoxes.forEach(day => {
    day.addEventListener('click', () => {
      dayBoxes.forEach(d => {
        d.classList.remove('selected-day', 'unselected');
        if (d.classList.contains('today-box')) {
          d.classList.add('unselected');
        }
      });

      day.classList.add('selected-day');
      day.classList.remove('unselected');

      const dateText = day.innerText; 
      const dateObj = new Date(dateText + ' ' + new Date().getFullYear());
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;
      fetchHabitsForDate(formattedDate);
    });
  });
});

const refreshStreak = async () => {
  try {
    const response = await fetch('/api/habit/streak/highest/');
    const data = await response.json();

    if (data && typeof data.streak === 'number') {
      const valueElem = document.getElementById('streak-value');
      const parts = valueElem.innerHTML.split(" ");
      if (parts.length > 0) {
        parts[0] = data.streak;  
        valueElem.innerHTML = parts.join(" ");
      } else {
        valueElem.innerHTML = `${data.streak} <img src="${window.STATIC_URLS.streakHot}" alt="" style="height: 40px;">`;
      }
    }

    if (data && data.name) {
      document.getElementById('streak-label').innerText = data.name;
    }
  } catch (err) {
    console.error("Failed to fetch streak data:", err);
  }
};
