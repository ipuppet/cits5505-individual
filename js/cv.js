const navbar = document.querySelector(".navbar")
const navHomeBtn = document.querySelector(".nav-links li:first-child")

// Change navbar style on scroll
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
        navHomeBtn.style.display = "block"
    } else {
        navbar.classList.remove("scrolled")
        navHomeBtn.style.display = "none"
    }
})
