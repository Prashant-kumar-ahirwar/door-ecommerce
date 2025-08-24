// Enhanced DoorCraft Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const headerHeight = header.offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Product category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Scroll animations
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }

    // Enhanced product card interactions
    function enhanceProductCards() {
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Contact button interactions with loading states
    function enhanceContactButtons() {
        const contactButtons = document.querySelectorAll('.contact-btn, .btn-primary');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.href && (this.href.startsWith('tel:') || this.href.startsWith('https://wa.me/'))) {
                    const originalText = this.innerHTML;
                    const loadingText = this.href.startsWith('tel:') ? '📞 Connecting...' : '💬 Opening WhatsApp...';
                    
                    this.innerHTML = loadingText;
                    this.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.pointerEvents = 'auto';
                    }, 2000);
                }
            });
        });
    }

    // Initialize all functionality
    updateActiveNavLink();
    animateOnScroll();
    enhanceProductCards();
    enhanceContactButtons();

    // Event listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        animateOnScroll();
    });

    // Resize handler for mobile responsiveness
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Accessibility improvements
    function improveAccessibility() {
        // Add aria labels to interactive elements
        const interactiveElements = document.querySelectorAll('button, a[href], .category-btn');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.getAttribute('title')) {
                const text = element.textContent.trim() || element.alt || 'Interactive element';
                element.setAttribute('aria-label', text);
            }
        });

        // Keyboard navigation for product categories
        categoryButtons.forEach((button, index) => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft' && index > 0) {
                    categoryButtons[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < categoryButtons.length - 1) {
                    categoryButtons[index + 1].focus();
                }
            });
        });
    }

    improveAccessibility();

    // Performance optimization - lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add click tracking for analytics
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .contact-btn, .category-btn')) {
            console.log('User interaction:', e.target.textContent.trim());
            // Analytics tracking can be added here
        }
    });

    // Error handling for contact methods
    window.addEventListener('error', function(e) {
        console.log('Error detected, but website continues to function normally');
    });

    // Initialize success message
    console.log('DoorCraft website loaded successfully! All features initialized.');
});

// Prevent right-click and key combinations (optional security)
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey && ['u', 's', 'c', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
    if (e.key === 'F12') {
        e.preventDefault();
    }
});

// Page performance optimization
window.addEventListener('load', function() {
    // Remove loading states
    document.body.classList.add('loaded');
    
    // Preload important images
    const importantImages = [
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23D4AF37"%3E%3Cpath d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/%3E%3C/svg%3E'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});