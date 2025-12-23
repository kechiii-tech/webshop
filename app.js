// Skydaddy Technologies Portfolio - Beautiful Button Interactions
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Beautiful Portfolio Initialized');
    
    // Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.btn-nav');
    
    // Modals
    const servicesModal = document.getElementById('servicesModal');
    const projectsModal = document.getElementById('projectsModal');
    const contactModal = document.getElementById('contactModal');
    
    // Buttons to open modals
    const servicesBtns = [
        document.getElementById('servicesBtn'),
        document.getElementById('exploreServices'),
        document.getElementById('footerServices')
    ];
    
    const projectsBtns = [
        document.getElementById('projectsBtn'),
        document.getElementById('viewProjects'),
        document.getElementById('footerProjects')
    ];
    
    const contactBtns = [
        document.getElementById('contactBtn'),
        document.getElementById('contactHero'),
        document.getElementById('footerContact')
    ];
    
    // Close buttons
    const servicesClose = document.getElementById('servicesClose');
    const projectsClose = document.getElementById('projectsClose');
    const contactClose = document.getElementById('contactClose');
    
    // Form
    const whatsappForm = document.getElementById('whatsappForm');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    // WhatsApp Configuration
    const WHATSAPP_NUMBER = '254117702463';
    const BUSINESS_NAME = 'Skydaddy Technologies';
    
    // Initialize
    initNavigation();
    initModalControls();
    initWhatsAppForm();
    initMessageCounter();
    initButtonAnimations();
    
    // ===== NAVIGATION =====
    function initNavigation() {
        if (!navToggle) return;
        
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===== MODAL CONTROLS =====
    function initModalControls() {
        // Open Services Modal
        servicesBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => openModal('services'));
            }
        });
        
        // Open Projects Modal
        projectsBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => openModal('projects'));
            }
        });
        
        // Open Contact Modal
        contactBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => openModal('contact'));
            }
        });
        
        // Close buttons
        servicesClose?.addEventListener('click', () => closeModal('services'));
        projectsClose?.addEventListener('click', () => closeModal('projects'));
        contactClose?.addEventListener('click', () => closeModal('contact'));
        
        // Close modal on overlay click
        [servicesModal, projectsModal, contactModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        const modalType = modal.id.replace('Modal', '');
                        closeModal(modalType);
                    }
                });
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (servicesModal.classList.contains('active')) closeModal('services');
                if (projectsModal.classList.contains('active')) closeModal('projects');
                if (contactModal.classList.contains('active')) closeModal('contact');
            }
        });
    }
    
    function openModal(type) {
        const modal = document.getElementById(`${type}Modal`);
        if (!modal) return;
        
        // Add ripple effect to the clicked button
        const event = window.event;
        if (event) {
            createRipple(event.target);
        }
        
        // Close any open modals first
        closeAllModals();
        
        // Open requested modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        console.log(`📂 ${type} modal opened`);
    }
    
    function closeModal(type) {
        const modal = document.getElementById(`${type}Modal`);
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // If no modals are open, re-enable body scroll
        if (!servicesModal.classList.contains('active') &&
            !projectsModal.classList.contains('active') &&
            !contactModal.classList.contains('active')) {
            document.body.style.overflow = '';
        }
        
        console.log(`📂 ${type} modal closed`);
    }
    
    function closeAllModals() {
        [servicesModal, projectsModal, contactModal].forEach(modal => {
            if (modal) modal.classList.remove('active');
        });
    }
    
    // ===== WHATSAPP FORM =====
    function initWhatsAppForm() {
        if (!whatsappForm) return;
        
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                projectType: document.getElementById('projectType').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate
            if (!validateForm(formData)) return;
            
            // Create beautiful message
            const whatsappMessage = createWhatsAppMessage(formData);
            
            // Send to WhatsApp
            sendToWhatsApp(whatsappMessage);
            
            // Show success animation
            showFormSuccess();
        });
    }
    
    function validateForm(data) {
        // Clear previous errors
        clearFormErrors();
        
        let isValid = true;
        
        if (!data.name) {
            showFieldError('name', 'Please enter your name');
            isValid = false;
        }
        
        if (!data.email) {
            showFieldError('email', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(data.email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!data.projectType) {
            showFieldError('projectType', 'Please select a project type');
            isValid = false;
        }
        
        if (!data.message) {
            showFieldError('message', 'Please enter your message');
            isValid = false;
        } else if (data.message.length < 10) {
            showFieldError('message', 'Please provide more details (at least 10 characters)');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Add error class
        formGroup.classList.add('error');
        
        // Create error message
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    function clearFormErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function createWhatsAppMessage(data) {
        const now = new Date();
        const date = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const time = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `🌟 *NEW PROJECT INQUIRY* 🌟

📅 *Date:* ${date}
⏰ *Time:* ${time}
━━━━━━━━━━━━━━━━━━━━

👤 *Client Information*
• Name: ${data.name}
• Email: ${data.email}
• Project Type: ${data.projectType}

💡 *Project Details*
${data.message}

━━━━━━━━━━━━━━━━━━━━
📱 *Submitted via:* ${BUSINESS_NAME} Portfolio
🔗 *Website:* skydaddy.tech
━━━━━━━━━━━━━━━━━━━━

_This inquiry requires your attention. Please respond within 24 hours._

Thank you! 🙏`;
    }
    
    function sendToWhatsApp(message) {
        // Encode message
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        // Update button state
        const submitBtn = whatsappForm.querySelector('.btn-whatsapp-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
        submitBtn.disabled = true;
        
        // Add ripple effect
        createRipple(submitBtn);
        
        // Open WhatsApp after short delay
        setTimeout(() => {
            try {
                // Try to open in new tab
                const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                
                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    // Fallback
                    window.location.href = whatsappUrl;
                }
                
                // Reset form after successful send
                setTimeout(() => {
                    whatsappForm.reset();
                    charCount.textContent = '0';
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    clearFormErrors();
                }, 2000);
                
            } catch (error) {
                console.error('WhatsApp error:', error);
                showToast('Could not open WhatsApp. Please try again or contact us directly.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }, 1000);
    }
    
    function showFormSuccess() {
        const formContainer = whatsappForm.closest('.contact-form-modal');
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>Message Ready!</h4>
                <p>WhatsApp is opening with your pre-filled message.</p>
                <p class="success-note">Just click "Send" to complete.</p>
            </div>
        `;
        
        formContainer.appendChild(successMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
    
    // ===== CHARACTER COUNTER =====
    function initMessageCounter() {
        if (!messageInput || !charCount) return;
        
        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            // Update color based on length
            if (length > 450) {
                charCount.style.color = '#ef4444';
            } else if (length > 350) {
                charCount.style.color = '#f97316';
            } else if (length > 100) {
                charCount.style.color = '#22c55e';
            } else {
                charCount.style.color = '#6b7280';
            }
            
            // Limit to 500 characters
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
                showToast('Message limited to 500 characters');
            }
        });
    }
    
    // ===== BUTTON ANIMATIONS =====
    function initButtonAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            /* Ripple effect */
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Form error states */
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #ef4444 !important;
                background: rgba(239, 68, 68, 0.05);
            }
            
            .error-message {
                color: #ef4444;
                font-size: 0.85rem;
                margin-top: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .error-message::before {
                content: '⚠';
                font-size: 0.9rem;
            }
            
            /* Success message */
            .success-message {
                background: linear-gradient(135deg, #22c55e, #16a34a);
                color: white;
                padding: 1.5rem;
                border-radius: var(--radius-lg);
                margin-top: 1.5rem;
                animation: slideUp 0.3s ease-out;
                box-shadow: var(--shadow-md);
            }
            
            .success-content {
                text-align: center;
            }
            
            .success-content i {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                display: block;
            }
            
            .success-content h4 {
                font-size: 1.3rem;
                margin-bottom: 0.5rem;
            }
            
            .success-note {
                opacity: 0.9;
                font-size: 0.9rem;
                margin-top: 0.5rem;
            }
            
            /* Toast message */
            .toast-message {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: #1a1a2e;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                gap: 1rem;
                box-shadow: var(--shadow-lg);
                z-index: 3000;
                animation: slideIn 0.3s ease-out;
                max-width: 400px;
            }
            
            .toast-message i {
                color: #4cc9f0;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0 0.5rem;
                margin-left: auto;
            }
            
            /* Button loading spinner */
            .fa-spin {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0; 
                    transform: translateY(20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            @keyframes slideIn {
                from { 
                    opacity: 0; 
                    transform: translateX(100px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateX(0); 
                }
            }
            
            /* Service card button hover effect */
            .btn-service-action:hover i {
                transform: translateX(5px);
                transition: transform 0.3s ease;
            }
            
            /* Project view button hover effect */
            .btn-project-view:hover i {
                transform: rotate(45deg);
                transition: transform 0.3s ease;
            }
            
            /* Modal close button animation */
            .btn-close:hover {
                animation: rotateClose 0.3s ease;
            }
            
            @keyframes rotateClose {
                from { transform: rotate(0deg); }
                to { transform: rotate(90deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    function createRipple(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple effect to all buttons
    document.querySelectorAll('button, .btn-nav, .btn-service-action, .btn-project-view, .btn-project-details, .btn-whatsapp-submit, .btn-footer-primary, .btn-footer-secondary, .btn-footer-contact').forEach(btn => {
        btn.addEventListener('click', function(e) {
            createRipple(this);
        });
    });
    
    console.log('✨ Portfolio with beautiful buttons initialized');
});
