// ===== DOM ELEMENTS =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const skipLink = document.querySelector('.skip-link');
const projectCards = document.querySelectorAll('.project-card');
const contactBtn = document.querySelector('.btn-primary[href^="mailto"]');

// ===== ACTIVE NAVIGATION ON SCROLL =====
const updateActiveNav = () => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            });
            
            // Add active class to current nav link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'page');
                
                // Update hamburger aria label if menu is open
                if (hamburger.getAttribute('aria-expanded') === 'true') {
                    hamburger.setAttribute('aria-label', `Close navigation menu, currently on ${sectionId} section`);
                }
            }
        }
    });
};

// ===== MOBILE NAVIGATION TOGGLE =====
const toggleMobileMenu = () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    
    // Toggle menu visibility
    hamburger.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    
    // Update hamburger label
    const label = !isExpanded ? 'Close navigation menu' : 'Open navigation menu';
    hamburger.setAttribute('aria-label', label);
    
    // Toggle body scroll lock when menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
};

// ===== CLOSE MOBILE MENU ON LINK CLICK =====
const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        document.body.style.overflow = '';
    }
};

// ===== STICKY HEADER ON SCROLL =====
const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        header.style.backdropFilter = 'blur(10px)';
    }
};

// ===== PROJECT CARD INTERACTIONS =====
const enhanceProjectCards = () => {
    projectCards.forEach((card, index) => {
        // Add animation delay for staggered entrance
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add click handler for better UX
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            }
        });
        
        // Add keyboard navigation support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
};

// ===== SMOOTH SCROLLING =====
const smoothScrollToSection = (e) => {
    const targetId = e.currentTarget.getAttribute('href');
    
    if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            closeMobileMenu();
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update URL without page jump
            history.pushState(null, null, targetId);
        }
    }
};

// ===== CONTACT BUTTON INTERACTION =====
const enhanceContactButton = () => {
    if (contactBtn) {
        contactBtn.addEventListener('mouseenter', () => {
            contactBtn.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        contactBtn.addEventListener('mouseleave', () => {
            contactBtn.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        contactBtn.addEventListener('click', () => {
            contactBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                contactBtn.style.transform = '';
            }, 200);
            
            // Optional: Track contact button click
            console.log('Contact button clicked - Email initiated');
        });
    }
};

// ===== SKIP LINK FOCUS =====
const handleSkipLink = () => {
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '20px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-50px';
    });
};

// ===== RESIZE HANDLER =====
const handleResize = () => {
    // Reset mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
};

// ===== INITIALIZE ANIMATIONS =====
const initializeAnimations = () => {
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
};

// ===== EVENT LISTENERS =====
const setupEventListeners = () => {
    // Scroll events
    window.addEventListener('scroll', () => {
        updateActiveNav();
        handleHeaderScroll();
    });
    
    // Resize event
    window.addEventListener('resize', handleResize);
    
    // Hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            smoothScrollToSection(e);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !e.target.closest('.nav') && 
            !e.target.closest('.hamburger')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle skip link
    handleSkipLink();
};

// ===== INITIALIZATION =====
const init = () => {
    console.log('Portfolio initialized');
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Set up initial active nav based on hash
    const hash = window.location.hash;
    if (hash) {
        const initialActiveLink = document.querySelector(`.nav-link[href="${hash}"]`);
        if (initialActiveLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            initialActiveLink.classList.add('active');
            initialActiveLink.setAttribute('aria-current', 'page');
        }
    }
    
    // Initialize components
    setupEventListeners();
    enhanceProjectCards();
    enhanceContactButton();
    initializeAnimations();
    updateActiveNav(); // Set initial active nav
    handleHeaderScroll(); // Set initial header style
    
    // Add loaded class for CSS transitions
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
};

// ===== EXPOSE FUNCTIONS FOR DEBUGGING (optional) =====
window.portfolio = {
    toggleMobileMenu,
    updateActiveNav,
    closeMobileMenu,
    init
};

// ===== INITIALIZE WHEN DOM IS LOADED =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

