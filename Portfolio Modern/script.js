document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.querySelector('.scroll-wrapper');
    const sections = document.querySelectorAll('.snap-section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSectionIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

    // --- 1. CORE SCROLL LOGIC ---
    // Smoothly moves the wrapper to the target section index
    const scrollToSection = (index) => {
        // Prevent out of bounds
        if (index < 0 || index >= sections.length) return;

        currentSectionIndex = index;

        // Move the wrapper
        wrapper.style.transform = `translateY(-${currentSectionIndex * 100}vh)`;

        // Update Active Classes for Animations
        updateActiveClasses(index);

        // Lock scrolling briefly to prevent double-skips
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 1200); // Match CSS transition duration (1.2s)
    };

    // Helper to toggle .active class manually
    const updateActiveClasses = (index) => {
        sections.forEach((sec, i) => {
            if (i === index) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    };

    // --- 2. DESKTOP WHEEL HANDLER ---
    window.addEventListener('wheel', (e) => {
        // Prevent default browser scroll
        e.preventDefault();

        if (isScrolling) return;

        if (e.deltaY > 0) {
            // Scroll Down
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else {
            // Scroll Up
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    }, { passive: false });

    // --- 3. MOBILE TOUCH HANDLER ---
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        if (isScrolling) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        // Threshold of 50px to count as a swipe
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe Up -> Scroll Down Content
                if (currentSectionIndex < sections.length - 1) {
                    scrollToSection(currentSectionIndex + 1);
                }
            } else {
                // Swipe Down -> Scroll Up Content
                if (currentSectionIndex > 0) {
                    scrollToSection(currentSectionIndex - 1);
                }
            }
        }
    }, { passive: false });

    // --- 4. NAVIGATION LINKS HANDLER ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Find index of the target section
            if (targetSection) {
                // Convert NodeList to Array to find index
                const sectionArray = Array.from(sections);
                const index = sectionArray.indexOf(targetSection);

                if (index !== -1) {
                    scrollToSection(index);
                }
            }
        });
    });

    // --- 5. INITIALIZATION ---
    // Make sure we start at the top or at the anchor if refreshed (optional, but starts at 0 for now)
    // Also trigger animations for first section
    setTimeout(() => {
        updateActiveClasses(0);
    }, 100);

    // Optional: Handle keyboard arrows
    window.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if (e.key === 'ArrowDown') {
            if (currentSectionIndex < sections.length - 1) scrollToSection(currentSectionIndex + 1);
        } else if (e.key === 'ArrowUp') {
            if (currentSectionIndex > 0) scrollToSection(currentSectionIndex - 1);
        }
    });

    // --- 6. MOBILE MENU HANDLER ---
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // Open mobile menu
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    // Close mobile menu
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // Handle mobile nav links - scroll to section and close menu
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const sectionArray = Array.from(sections);
                const index = sectionArray.indexOf(targetSection);

                if (index !== -1) {
                    // Close menu first
                    mobileMenu.classList.remove('active');

                    // Then scroll after a short delay
                    setTimeout(() => {
                        scrollToSection(index);
                    }, 300);
                }
            }
        });
    });

});