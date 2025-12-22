// Professional Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Skydaddy Technologies Portfolio - Initializing');
    
    // Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const sections = document.querySelectorAll('.section');
    
    // Initialize all functionality
    initNavigation();
    initSmoothScroll();
    initContactForm();
    initIntersectionObserver();
    
    // Navigation Toggle for Mobile
    function initNavigation() {
        if (navToggle) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.setAttribute('aria-expanded', 
                    this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
            });
            
            // Close menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // Smooth Scrolling for Navigation Links
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(targetId);
                }
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', updateActiveNavLinkOnScroll);
    }
    
    // Update active navigation link based on scroll position
    function updateActiveNavLinkOnScroll() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = '#' + section.getAttribute('id');
            }
        });
        
        updateActiveNavLink(current);
    }
    
    // Update active nav link
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    // Contact Form Handling
    function initContactForm() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Create WhatsApp message
            const whatsappMessage = `*New Project Inquiry from Skydaddy Portfolio*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Project Type:* ${formData.subject}%0A%0A*Message:*%0A${formData.message}%0A%0A_This inquiry was submitted via the contact form on Skydaddy.tech_`;
            
            // Send via WhatsApp
            const whatsappUrl = `https://wa.me/254117702463?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp based on device
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                window.location.href = whatsappUrl;
            } else {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }
            
            // Show success message
            showFormSuccess();
        });
    }
    
    // Form validation
    function validateForm(data) {
        if (!data.name || !data.email || !data.subject || !data.message) {
            alert('Please fill in all required fields.');
            return false;
        }
        
        if (!isValidEmail(data.email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show form success
    function showFormSuccess() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#10b981';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
    
    // Intersection Observer for animations
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);
        
        // Observe service cards and project cards
        document.querySelectorAll('.service-card, .project-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .project-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.in-view, .project-card.in-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card:nth-child(1) { transition-delay: 0.1s; }
        .service-card:nth-child(2) { transition-delay: 0.2s; }
        .service-card:nth-child(3) { transition-delay: 0.3s; }
        .service-card:nth-child(4) { transition-delay: 0.4s; }
        
        .project-card:nth-child(1) { transition-delay: 0.1s; }
        .project-card:nth-child(2) { transition-delay: 0.2s; }
        .project-card:nth-child(3) { transition-delay: 0.3s; }
        .project-card:nth-child(4) { transition-delay: 0.4s; }
        
        @media (prefers-reduced-motion: reduce) {
            .service-card, .project-card {
                transition: none;
                opacity: 1;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize current section on load
    updateActiveNavLinkOnScroll();
    
    console.log('Skydaddy Technologies Portfolio - Ready');
});
