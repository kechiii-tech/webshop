// Skydaddy Technologies Portfolio - WhatsApp Integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('Skydaddy Technologies Portfolio - Initializing');
    
    // Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const whatsappForm = document.getElementById('whatsappForm');
    const messageInput = document.getElementById('userMessage');
    const charCount = document.getElementById('charCount');
    const sections = document.querySelectorAll('.section');
    
    // WhatsApp Configuration
    const WHATSAPP_NUMBER = '254117702463'; // Phone number without + or 00
    
    // Initialize
    initNavigation();
    initSmoothScroll();
    initWhatsAppForm();
    initMessageCounter();
    initAnimations();
    
    // ===== NAVIGATION =====
    function initNavigation() {
        if (!navToggle) return;
        
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
        
        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                    updateActiveLink(targetId);
                }
            });
        });
        
        window.addEventListener('scroll', updateActiveLinkOnScroll);
    }
    
    function updateActiveLinkOnScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = '#' + section.id;
            }
        });
        updateActiveLink(current);
    }
    
    function updateActiveLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    // ===== WHATSAPP FORM =====
    function initWhatsAppForm() {
        if (!whatsappForm) return;
        
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            // Get form values
            const name = document.getElementById('userName').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const projectType = document.getElementById('messageType').value;
            const message = document.getElementById('userMessage').value.trim();
            
            console.log('Form data:', { name, email, projectType, message });
            
            // Basic validation
            if (!validateForm(name, email, projectType, message)) {
                return;
            }
            
            // Create WhatsApp message
            const whatsappMessage = createWhatsAppMessage(name, email, projectType, message);
            console.log('WhatsApp message created');
            
            // Open WhatsApp
            openWhatsApp(whatsappMessage);
        });
    }
    
    function validateForm(name, email, projectType, message) {
        if (!name) {
            alert('Please enter your name');
            return false;
        }
        if (!email) {
            alert('Please enter your email');
            return false;
        }
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        if (!projectType) {
            alert('Please select a project type');
            return false;
        }
        if (!message) {
            alert('Please enter your message');
            return false;
        }
        if (message.length < 10) {
            alert('Please write a more detailed message (at least 10 characters)');
            return false;
        }
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function createWhatsAppMessage(name, email, projectType, message) {
        const date = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const time = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Create formatted message
        let formattedMessage = `*NEW MESSAGE FROM SKYDADDY PORTFOLIO*\n\n`;
        formattedMessage += `*Date:* ${date} ${time}\n`;
        formattedMessage += `*Name:* ${name}\n`;
        formattedMessage += `*Email:* ${email}\n`;
        formattedMessage += `*Project Type:* ${projectType}\n\n`;
        formattedMessage += `*Message:*\n${message}\n\n`;
        formattedMessage += `---\n`;
        formattedMessage += `_Sent via skydaddy.tech portfolio_`;
        
        return formattedMessage;
    }
    
    function openWhatsApp(message) {
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        console.log('Encoded message:', encodedMessage);
        
        // Create WhatsApp URL - CORRECT FORMAT
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        console.log('WhatsApp URL:', whatsappUrl);
        
        // Update button to show loading
        const submitBtn = whatsappForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
        submitBtn.disabled = true;
        
        // Try to open WhatsApp
        setTimeout(() => {
            try {
                // Open in new tab for better compatibility
                const newWindow = window.open(whatsappUrl, '_blank');
                
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // Fallback for mobile devices or blocked popups
                    window.location.href = whatsappUrl;
                }
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    whatsappForm.reset();
                    charCount.textContent = '0';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Error opening WhatsApp:', error);
                alert('Could not open WhatsApp. Please try again or contact us directly at +254 117 702 463');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }, 500);
    }
    
    // ===== CHARACTER COUNTER =====
    function initMessageCounter() {
        if (!messageInput || !charCount) return;
        
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            // Update color based on length
            if (length > 450) {
                charCount.style.color = '#dc2626';
            } else if (length > 350) {
                charCount.style.color = '#ea580c';
            } else {
                charCount.style.color = '#374151';
            }
            
            // Limit to 500 characters
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
            }
        });
    }
    
    // ===== ANIMATIONS =====
    function initAnimations() {
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            .service-card, .project-card, .contact-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .service-card.animated, .project-card.animated, .contact-card.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            .service-card:nth-child(1) { transition-delay: 0.1s; }
            .service-card:nth-child(2) { transition-delay: 0.2s; }
            .service-card:nth-child(3) { transition-delay: 0.3s; }
            .service-card:nth-child(4) { transition-delay: 0.4s; }
            
            .btn-whatsapp:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .fa-spin {
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);
        
        // Initialize intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements
        document.querySelectorAll('.service-card, .project-card, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ===== TEST WHATSAPP FUNCTION =====
    // Add a test button for debugging
    function addTestButton() {
        const testBtn = document.createElement('button');
        testBtn.innerHTML = 'Test WhatsApp Link';
        testBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
            display: none;
        `;
        testBtn.onclick = function() {
            const testMessage = 'Test message from Skydaddy portfolio';
            const encoded = encodeURIComponent(testMessage);
            const testUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
            console.log('Test URL:', testUrl);
            window.open(testUrl, '_blank');
        };
        document.body.appendChild(testBtn);
        
        // Show test button on shift+ctrl+T
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.ctrlKey && e.key === 'T') {
                testBtn.style.display = 'block';
            }
        });
    }
    
    // Initialize test button
    addTestButton();
    
    // Initialize active link on load
    updateActiveLinkOnScroll();
    
    console.log('Portfolio initialized successfully');
});
