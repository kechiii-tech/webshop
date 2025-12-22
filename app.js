// Skydaddy Technologies Portfolio - WhatsApp Integration

document.addEventListener('DOMContentLoaded', function() {
    console.log('Skydaddy Technologies Portfolio - Initializing WhatsApp Integration');
    
    // Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const whatsappForm = document.getElementById('whatsappForm');
    const messageInput = document.getElementById('userMessage');
    const charCount = document.getElementById('charCount');
    const sections = document.querySelectorAll('.section');
    
    // WhatsApp phone number
    const WHATSAPP_NUMBER = '254117702463';
    
    // Initialize all functionality
    initNavigation();
    initSmoothScroll();
    initWhatsAppForm();
    initMessageCounter();
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
                    const offsetTop = targetSection.offsetTop - 70;
                    
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
    
    // Initialize WhatsApp Form
    function initWhatsAppForm() {
        if (!whatsappForm) return;
        
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                projectType: document.getElementById('messageType').value,
                message: document.getElementById('userMessage').value.trim()
            };
            
            // Validate form
            if (!validateWhatsAppForm(formData)) {
                return;
            }
            
            // Create WhatsApp message
            const whatsappMessage = formatWhatsAppMessage(formData);
            
            // Send via WhatsApp
            sendToWhatsApp(whatsappMessage);
            
            // Show success message and reset form
            showFormSuccess();
        });
    }
    
    // Validate WhatsApp Form
    function validateWhatsAppForm(data) {
        // Check required fields
        if (!data.name || !data.email || !data.projectType || !data.message) {
            alert('Please fill in all required fields.');
            return false;
        }
        
        // Validate email
        if (!isValidEmail(data.email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        
        // Validate message length
        if (data.message.length < 10) {
            alert('Please provide a more detailed message (at least 10 characters).');
            return false;
        }
        
        return true;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Format WhatsApp Message
    function formatWhatsAppMessage(data) {
        const timestamp = new Date().toLocaleString();
        
        return `*New Message from Skydaddy Portfolio*%0A%0A` +
               `*Date:* ${timestamp}%0A` +
               `*Name:* ${data.name}%0A` +
               `*Email:* ${data.email}%0A` +
               `*Project Type:* ${data.projectType}%0A%0A` +
               `*Message:*%0A${data.message}%0A%0A` +
               `_This message was sent through the contact form on skydaddy.tech_`;
    }
    
    // Send message to WhatsApp
    function sendToWhatsApp(message) {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp based on device
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            // Mobile device - open in WhatsApp app
            window.location.href = whatsappUrl;
        } else {
            // Desktop - open in new tab
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Show confirmation message for desktop users
            setTimeout(() => {
                alert('WhatsApp has been opened in a new tab. Please complete sending your message there.');
            }, 500);
        }
    }
    
    // Initialize message character counter
    function initMessageCounter() {
        if (!messageInput || !charCount) return;
        
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            // Update color based on length
            if (length > 400) {
                charCount.style.color = '#dc2626';
            } else if (length > 300) {
                charCount.style.color = '#ea580c';
            } else {
                charCount.style.color = '#374151';
            }
            
            // Enforce max length
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
            }
        });
    }
    
    // Show form success
    function showFormSuccess() {
        const submitBtn = whatsappForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Opening WhatsApp...';
        submitBtn.disabled = true;
        
        // Reset form after 3 seconds
        setTimeout(() => {
            whatsappForm.reset();
            charCount.textContent = '0';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
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
        
        /* Form validation styles */
        .form-group input:invalid,
        .form-group select:invalid,
        .form-group textarea:invalid {
            border-color: #dc2626;
        }
        
        .form-group input:valid,
        .form-group select:valid,
        .form-group textarea:valid {
            border-color: #10b981;
        }
        
        /* Loading animation for form submission */
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .btn-whatsapp:disabled {
            animation: pulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize current section on load
    updateActiveNavLinkOnScroll();
    
    // Add form validation feedback
    whatsappForm.addEventListener('change', function(e) {
        if (e.target.matches('input, select, textarea')) {
            validateField(e.target);
        }
    });
    
    function validateField(field) {
        if (field.validity.valid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
        }
    }
    
    console.log('Skydaddy Technologies Portfolio - WhatsApp Integration Ready');
});
