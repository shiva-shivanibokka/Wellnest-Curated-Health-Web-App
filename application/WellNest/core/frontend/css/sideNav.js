
    const openNav = document.getElementById("hamburger-menu");
    const closeNav = document.getElementById("close-nav");
    const sideNav = document.getElementById("sideNav");

    openNav.addEventListener("click", () => {
        sideNav.classList.add("active");
    });

    closeNav.addEventListener("click", () => {
        sideNav.classList.remove("active");
    });
