// Initialize the portfolio application
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const mainContainer = document.getElementById('mainContainer');
    const navDots = document.querySelectorAll('.dot');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const contactForm = document.getElementById('contactForm');
    
    // Current section tracking
    let currentSection = 'home';
    let isScrolling = false;
    
    // Initialize horizontal scrolling
    function initHorizontalScroll() {
        // Configure horizontal scroll behavior
        mainContainer.addEventListener('scroll', handleHorizontalScroll);
        
        // Configure wheel events for horizontal scroll
        mainContainer.addEventListener('wheel', handleWheelScroll, { passive: false });
        
        // Configure touch events for mobile
        let startX = 0;
        let scrollLeft = 0;
        
        mainContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = mainContainer.scrollLeft;
        });
        
        mainContainer.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 2;
            mainContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial scroll position
        mainContainer.scrollLeft = 0;
    }
    
    // Handle horizontal scroll to update navigation
    function handleHorizontalScroll() {
        if (isScrolling) return;
        
        const scrollPosition = mainContainer.scrollLeft;
        const windowWidth = window.innerWidth;
        const sectionIndex = Math.round(scrollPosition / windowWidth);
        
        const sections = ['home', 'services', 'projects', 'contact'];
        const newSection = sections[sectionIndex];
        
        if (newSection && newSection !== currentSection) {
            updateNavigation(newSection);
            currentSection = newSection;
        }
    }
    
    // Handle wheel scroll for horizontal movement
    function handleWheelScroll(e) {
        // Prevent default vertical scroll
        e.preventDefault();
        
        // If we're in the middle of a scroll, ignore new wheel events
        if (isScrolling) return;
        
        isScrolling = true;
        
        // Calculate direction and amount
        const delta = Math.max(-1, Math.min(1, e.deltaY));
        const scrollAmount = window.innerWidth * delta;
        
        // Calculate new scroll position
        const currentScroll = mainContainer.scrollLeft;
        const newScroll = currentScroll + scrollAmount;
        
        // Animate the scroll
        mainContainer.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }
    
    // Update navigation dots and mobile menu
    function updateNavigation(section) {
        // Update dots
        navDots.forEach(dot => {
            if (dot.getAttribute('data-section') === section) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update mobile menu
        mobileNavItems.forEach(item => {
            if (item.getAttribute('href') === `#${section}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update URL hash without scrolling
        history.pushState(null, null, `#${section}`);
    }
    
    // Navigation dot click handler
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = dot.getAttribute('data-section');
            scrollToSection(targetSection);
        });
    });
    
    // Mobile navigation item click handler
    mobileNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = item.getAttribute('href').substring(1);
            scrollToSection(targetSection);
            closeMobileMenu();
        });
    });
    
    // Scroll to specific section
    function scrollToSection(section) {
        if (isScrolling) return;
        
        isScrolling = true;
        
        const sections = ['home', 'services', 'projects', 'contact'];
        const sectionIndex = sections.indexOf(section);
        
        if (sectionIndex !== -1) {
            const scrollPosition = window.innerWidth * sectionIndex;
            
            mainContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            updateNavigation(section);
            currentSection = section;
            
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }
    
    // Mobile menu functionality
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    closeMenuBtn.addEventListener('click', closeMobileMenu);
    
    function openMobileMenu() {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Create WhatsApp message
            const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
            
            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/254117702463?text=${whatsappMessage}`;
            
            // Open in new tab
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Opening WhatsApp to send your message. Please complete the conversation there.');
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            
            const sections = ['home', 'services', 'projects', 'contact'];
            const currentIndex = sections.indexOf(currentSection);
            let nextIndex;
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                nextIndex = currentIndex - 1;
            } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
                nextIndex = currentIndex + 1;
            } else {
                return;
            }
            
            scrollToSection(sections[nextIndex]);
        }
    });
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Service card animations
    const serviceCards = document.querySelectorAll('.service-card');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Initialize everything
    initHorizontalScroll();
    
    // Check initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && ['home', 'services', 'projects', 'contact'].includes(initialHash)) {
        setTimeout(() => {
            scrollToSection(initialHash);
        }, 100);
    }
    
    // Add animation to floating icons
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = targetId.substring(1);
            if (['home', 'services', 'projects', 'contact'].includes(targetSection)) {
                scrollToSection(targetSection);
            }
        });
    });
});