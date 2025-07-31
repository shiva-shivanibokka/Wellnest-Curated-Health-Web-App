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
  form.reset();
  habitModal.showModal();
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
    Gold:   '#f1c40f',
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

        // check-mark icon
        const check = document.createElement('img');
        check.src = doneFlag 
          ? window.STATIC_URLS.checkDone 
          : window.STATIC_URLS.checkEmpty;
        check.className = 'check-empty';
        check.addEventListener('click', async () => {
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

        } else {
    
            wrapper.remove();
            habitContainer.append(wrapper);
            check.src = window.STATIC_URLS.checkEmpty;

            // DELETE the existing log
            await fetch('/api/habit/log/delete/', {
            method:      'DELETE',
            credentials: 'same-origin',
            headers:     { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
            body:        JSON.stringify({
                name:       habitObj.name,
                habit_type: habitObj.habit_type,
                date:       new Date().toISOString().split('T')[0]
            })
            });
        }
        });

        habit.append(check, document.createTextNode(habitObj.name));
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
        valueInput.style.width = '100px';
        break;
      case 'food':
        valueInput.min         = 0;
        valueInput.max         = 5000;
        valueInput.placeholder = 'calories (0–5000)';
        valueInput.style.width = '150px';
        break;
      case 'sleep':
        valueInput.min         = 0;
        valueInput.max         = 24;
        valueInput.placeholder = 'hours (0–24)';
        valueInput.style.width = '100px';
        break;
      case 'workout':
        valueInput.min         = 0;
        valueInput.max         = 12;
        valueInput.placeholder = 'hours (0–12)';
        valueInput.style.width = '100px';
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

document.addEventListener('DOMContentLoaded', () => {
    initDayToggles();
    initValuePlaceholder();
    loadCreatedHabits();
});

//csrf
function getCSRFToken() {
  return document.cookie.split('; ')
    .find(r => r.startsWith('csrftoken'))
    ?.split('=')[1];
}

