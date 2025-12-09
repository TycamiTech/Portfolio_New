// Menunggu dokumen dimuat sepenuhnya
document.addEventListener("DOMContentLoaded", function () {

    // --- 1. ANIMASI SCROLL (Intersection Observer) ---
    // Ini membuat elemen muncul perlahan saat user scroll ke bawah
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Hanya animasi sekali
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Muncul ketika 15% elemen terlihat
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 2. HOVER EFFECT PADA JUDUL HERO (Interaktif) ---
    const heroTitle = document.querySelector('.big-text');
    if (heroTitle) {
        heroTitle.addEventListener('mouseover', () => {
            heroTitle.style.color = 'var(--accent)';
            heroTitle.style.transition = '0.3s';
        });
        heroTitle.addEventListener('mouseout', () => {
            heroTitle.style.color = 'var(--text-main)';
        });
    }

    // --- 3. MOBILE MENU TOGGLE (Opsional) ---
    // Jika ingin menu burger berfungsi
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = (navLinks.style.display === 'flex') ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.right = '5%';
            navLinks.style.background = '#111';
            navLinks.style.padding = '20px';
            navLinks.style.borderRadius = '10px';
            navLinks.style.border = '1px solid var(--accent)';
        });
    }
});