document.addEventListener("DOMContentLoaded", () => {
    const searchIcon = document.getElementById("search-icon");
    const searchBox = document.getElementById("search-box");

    searchIcon.addEventListener("click", () => {
        searchBox.classList.toggle("active");
        if (searchBox.classList.contains("active")) {
            searchBox.focus();
        }
    });
});
