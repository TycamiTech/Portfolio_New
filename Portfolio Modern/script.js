document.addEventListener('DOMContentLoaded', () => {

    const wrapper = document.querySelector('.scroll-wrapper');
    const sections = document.querySelectorAll('.snap-section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const snapContainer = document.querySelector('.snap-container');

    let currentSectionIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

    // Detect mobile device
    const isMobile = () => window.innerWidth <= 768;

    // Helper to toggle .active class
    const updateActiveClasses = (index) => {
        sections.forEach((sec, i) => {
            if (i === index) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    };

    // --- MOBILE SETUP ---
    // Use native CSS scroll-snap for mobile (smoother, no glitches)
    const setupMobile = () => {
        if (!isMobile()) return;

        // Enable native scrolling on container
        snapContainer.style.overflowY = 'auto';
        snapContainer.style.scrollSnapType = 'y mandatory';
        wrapper.style.transform = 'none';

        // Make sections snap
        sections.forEach(section => {
            section.style.scrollSnapAlign = 'start';
            section.style.scrollSnapStop = 'always';
        });

        // Track active section during scroll
        let scrollTimeout;
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
            }, 150);
        }, { passive: true });
    };

    // --- DESKTOP SETUP ---
    // Use JavaScript-controlled translateY for desktop (for smooth animated transitions)
    const setupDesktop = () => {
        if (isMobile()) return;

        // Disable native scroll on container
        snapContainer.style.overflowY = 'hidden';
        snapContainer.style.scrollSnapType = 'none';

        // Reset section snap styles
        sections.forEach(section => {
            section.style.scrollSnapAlign = '';
            section.style.scrollSnapStop = '';
        });
    };

    // Desktop scroll to section function
    const scrollToSection = (index) => {
        if (index < 0 || index >= sections.length) return;
        if (isMobile()) return; // Mobile uses native scroll-snap

        currentSectionIndex = index;
        wrapper.style.transform = `translateY(-${currentSectionIndex * 100}vh)`;
        updateActiveClasses(index);

        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 1200);
    };

    // --- DESKTOP WHEEL HANDLER ---
    window.addEventListener('wheel', (e) => {
        if (isMobile()) return;
        e.preventDefault();
        if (isScrolling) return;

        if (e.deltaY > 0) {
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else {
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    }, { passive: false });

    // --- NAVIGATION LINKS HANDLER ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const sectionArray = Array.from(sections);
                const index = sectionArray.indexOf(targetSection);

                if (index !== -1) {
                    if (isMobile()) {
                        // Mobile: native scroll
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        currentSectionIndex = index;
                        updateActiveClasses(index);
                    } else {
                        // Desktop: animated scroll
                        scrollToSection(index);
                    }
                }
            }
        });
    });

    // --- RESIZE HANDLER ---
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile()) {
                setupMobile();
                sections[currentSectionIndex].scrollIntoView({ behavior: 'auto', block: 'start' });
            } else {
                setupDesktop();
                wrapper.style.transform = `translateY(-${currentSectionIndex * 100}vh)`;
            }
        }, 100);
    });

    // --- KEYBOARD HANDLER (Desktop only) ---
    window.addEventListener('keydown', (e) => {
        if (isMobile()) return;
        if (isScrolling) return;
        if (e.key === 'ArrowDown') {
            if (currentSectionIndex < sections.length - 1) scrollToSection(currentSectionIndex + 1);
        } else if (e.key === 'ArrowUp') {
            if (currentSectionIndex > 0) scrollToSection(currentSectionIndex - 1);
        }
    });

    // --- MOBILE MENU HANDLER ---
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const sectionArray = Array.from(sections);
                const index = sectionArray.indexOf(targetSection);

                if (index !== -1) {
                    mobileMenu.classList.remove('active');

                    setTimeout(() => {
                        if (isMobile()) {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            currentSectionIndex = index;
                            updateActiveClasses(index);
                        } else {
                            scrollToSection(index);
                        }
                    }, 300);
                }
            }
        });
    });

    // --- INITIALIZATION ---
    setTimeout(() => {
        updateActiveClasses(0);
        if (isMobile()) {
            setupMobile();
        } else {
            setupDesktop();
        }
    }, 100);

});