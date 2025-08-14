document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("signinDialog");
  const template = document.getElementById("signin-template");
  
  if (dialog && template) {
    dialog.innerHTML = template.innerHTML;
  }

  //  reset dialog 
  function resetSigninDialogContent() {
    if (dialog && template) {
      dialog.innerHTML = template.innerHTML;
      setupFormEventListeners();
      setupToggleEventListener();
      const toggle = document.getElementById('toggle');
    }
  }


  function setupFormEventListeners() {
    // Sign In Form
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
      signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        try {
          const resp = await fetch('/api/users/login/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
              email: form.email.value,
              password: form.password.value
            })
          });

          const errorDiv = document.getElementById('error');
          if (resp.ok) {
            const nextUrl = new URLSearchParams(window.location.search).get('next') || '/calendar/';
            window.location.href = nextUrl;
          } else {
            const { detail } = await resp.json();
            if (errorDiv) {
              errorDiv.textContent = detail;
              errorDiv.style.display = 'block';
            }
          }
        } catch (err) {
          console.error('Login error:', err);
          const errorDiv = document.getElementById('error');
          if (errorDiv) {
            errorDiv.textContent = 'Network error. Please try again.';
            errorDiv.style.display = 'block';
          }
        }
      });
    }

    
// Sign Up Form
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('signup-btn');
    const messageDiv = document.getElementById('message');
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.value = 'Signing up...';
    }

    const data = {
      username: document.getElementById('username')?.value,
      email: document.getElementById('email')?.value,
      password: document.getElementById('password')?.value,
      first_name: document.getElementById('first_name')?.value,
      last_name: document.getElementById('last_name')?.value,
      gender: document.getElementById('gender')?.value
    };

    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
      const resp = await fetch('/api/users/create/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
      });

      const result = await resp.json();

      if (resp.ok) {
        
        localStorage.setItem('signupCompleted', 'true');
        window.location.href = '/calendar';
        return;
    } else {
        if (messageDiv) {
          messageDiv.style.display = 'block';
          messageDiv.style.color = 'red';

          if (result.username) messageDiv.textContent = `Username error: ${result.username[0]}`;
          else if (result.email) messageDiv.textContent = `Email error: ${result.email[0]}`;
          else if (result.password) messageDiv.textContent = `Password error: ${result.password[0]}`;
          else messageDiv.textContent = 'Error creating account. Please try again.';
        }
      }
    } catch (err) {
      if (messageDiv) {
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Network error. Please try again.';
      }
      console.error(err);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.value = 'Sign Up';
      }
    }
  });
}

  }

  //toggle 
  function setupToggleEventListener() {
    const toggle = document.getElementById('toggle');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const slideText = document.getElementById('slideText');
    const slideBtn = document.getElementById('slideBtn');

    if (toggle && signInForm && signUpForm && slideText && slideBtn) {
      toggle.addEventListener('change', () => {
        const isSignUp = toggle.checked;
        signInForm.style.display = isSignUp ? 'none' : 'block';
        signUpForm.style.display = isSignUp ? 'block' : 'none';
        slideText.textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
        slideBtn.textContent = isSignUp ? 'Sign In' : 'Sign Up';
      });
    }
  }


  setupFormEventListeners();
  setupToggleEventListener();
    if (toggle) {
    toggle.checked = true;                       
    toggle.dispatchEvent(new Event('change'));
    }

  // Show dialog on load if not authenticated
const comingFromSurvey = localStorage.getItem('comingFromSurvey') === 'true';

    if (!window.IS_AUTHENTICATED && dialog && !comingFromSurvey) {
        dialog.showModal();
    }

  //click outside to close dialog
  if (dialog) {
    dialog.addEventListener("click", (event) => {
      const container = dialog.querySelector(".container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const clickedInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        if (!clickedInside) {
          dialog.close();
        }
      }
    });

    // Handle dialog close event
    dialog.addEventListener("close", () => {
      document.body.style.pointerEvents = 'auto';
      
      // Automatically open the nav bar
      const sideNav = document.getElementById("sideNav");
      if (sideNav) {
        sideNav.classList.add("active");
      }
    });
  }

  // requires-auth buttons
  document.querySelectorAll('.requires-auth').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!window.IS_AUTHENTICATED) {
        e.preventDefault();
        resetSigninDialogContent();
        if (dialog) {
          dialog.showModal();
        }
      }
    });
  });

  // add habit button 
  const addHabitBtn = document.getElementById('add-habit-button');
  if (addHabitBtn) {
    addHabitBtn.addEventListener('click', (e) => {
      if (!window.IS_AUTHENTICATED) {
        e.preventDefault();
        resetSigninDialogContent();
        if (dialog) {
          dialog.showModal();
        }
      }
    });
  }

  // Make resetSigninDialogContent available globally 
  window.resetSigninDialogContent = resetSigninDialogContent;
});