document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.querySelector('.scroll-wrapper');
    const sections = document.querySelectorAll('.snap-section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSectionIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

    // Detect mobile device
    const isMobile = () => window.innerWidth <= 768;

    // --- 1. CORE SCROLL LOGIC ---
    // Smoothly moves to the target section index
    const scrollToSection = (index) => {
        // Prevent out of bounds
        if (index < 0 || index >= sections.length) return;

        currentSectionIndex = index;

        if (isMobile()) {
            // Mobile: Use scrollIntoView for better handling of variable-height sections
            sections[index].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // Desktop: Use translateY for smooth snap effect
            wrapper.style.transform = `translateY(-${currentSectionIndex * 100}vh)`;
        }

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
        if (isMobile()) return; // Skip for mobile

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
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!isMobile()) return; // Only for mobile
        if (isScrolling) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        // Threshold of 80px to count as a swipe (increased for better UX)
        if (Math.abs(diff) > 80) {
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
    }, { passive: true });

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
    // Handle resize events to update scroll position
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile()) {
                // Reset transform for mobile
                wrapper.style.transform = 'none';
                sections[currentSectionIndex].scrollIntoView({
                    behavior: 'auto',
                    block: 'start'
                });
            } else {
                // Restore transform for desktop
                wrapper.style.transform = `translateY(-${currentSectionIndex * 100}vh)`;
            }
        }, 100);
    });

    // Initialize on load
    setTimeout(() => {
        updateActiveClasses(0);
        if (isMobile()) {
            wrapper.style.transform = 'none';
        }
    }, 100);

    // Optional: Handle keyboard arrows (desktop only)
    window.addEventListener('keydown', (e) => {
        if (isMobile()) return;
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

    // --- 7. SCROLL DETECTION FOR MOBILE ---
    // Track which section is visible during native scroll on mobile
    if (isMobile()) {
        let scrollTimeout;
        const snapContainer = document.querySelector('.snap-container');
        
        if (snapContainer) {
            snapContainer.style.overflowY = 'auto';
            snapContainer.style.scrollSnapType = 'y mandatory';
            
            sections.forEach(section => {
                section.style.scrollSnapAlign = 'start';
            });

            snapContainer.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Find which section is most visible
                    let closestIndex = 0;
                    let closestDistance = Infinity;
                    
                    sections.forEach((section, i) => {
                        const rect = section.getBoundingClientRect();
                        const distance = Math.abs(rect.top);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestIndex = i;
                        }
                    });

                    if (closestIndex !== currentSectionIndex) {
                        currentSectionIndex = closestIndex;
                        updateActiveClasses(closestIndex);
                    }
                }, 100);
            }, { passive: true });
        }
    }

});