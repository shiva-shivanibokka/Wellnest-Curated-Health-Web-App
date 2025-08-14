const form = document.getElementById("profile-form");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevents the page from refreshing

  // Optionally you could add validation or logging here

  // Show the popup
  popup.classList.remove("hidden");
});

closePopup.addEventListener("click", function () {
  popup.classList.add("hidden");

  // Optional: Reset form after saving
  form.reset();
});
