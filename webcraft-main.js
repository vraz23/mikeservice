// WebCraft Pro - Vanilla JavaScript Implementation
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    initNavigation();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Scroll animations
    initScrollAnimations();
    
    // Pricing toggle functionality
    initPricingToggle();
    
    // Template category filtering
    initTemplateFilter();
    
    // FAQ accordion
    initFAQAccordion();
    
    // Newsletter form
    initNewsletterForm();
    
    // Scroll to top button
    initScrollToTop();
    
    // Demo video modal
    initDemoModal();
    
    // Contact form handling
    initContactForms();
    
    // Testimonials slider
    initTestimonialsSlider();
    
    // Initialize AOS (Animate On Scroll) effect
    initAOSEffects();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .template-item, .pricing-card, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Pricing toggle functionality
function initPricingToggle() {
    const billingToggle = document.getElementById('billing-toggle');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (billingToggle) {
        billingToggle.addEventListener('change', function() {
            const isYearly = this.checked;
            
            pricingCards.forEach(card => {
                const priceElement = card.querySelector('.amount');
                const currentPrice = parseInt(priceElement.textContent.replace('$', ''));
                
                if (isYearly && currentPrice > 0) {
                    const yearlyPrice = Math.round(currentPrice * 12 * 0.8 / 12);
                    priceElement.textContent = `$${yearlyPrice}`;
                } else if (!isYearly && currentPrice > 0) {
                    // Reset to monthly prices
                    const monthlyPrices = { 0: 0, 8: 12, 20: 25 }; // yearlyPrice: monthlyPrice
                    priceElement.textContent = `$${monthlyPrices[currentPrice] || currentPrice}`;
                }
            });
        });
    }
}

// Template category filtering
function initTemplateFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const templateItems = document.querySelectorAll('.template-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            templateItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all other accordions
            accordionBtns.forEach(otherBtn => {
                if (otherBtn !== this) {
                    otherBtn.classList.remove('active');
                    otherBtn.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current accordion
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            } else {
                this.classList.remove('active');
                content.classList.remove('active');
            }
        });
    });
}

// Newsletter form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            // Simulate API call
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Subscribed!';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    this.reset();
                }, 2000);
            }, 1000);
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!', 'success');
        });
    }
}

// Scroll to top button
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Demo video modal
function initDemoModal() {
    const demoBtn = document.querySelector('a[href="#demo"]');
    
    if (demoBtn) {
        demoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createDemoModal();
        });
    }
}

function createDemoModal() {
    const modal = document.createElement('div');
    modal.className = 'demo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>WebCraft Pro Demo</h3>
            <div class="video-container">
                <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            </div>
            <p>See how easy it is to build professional websites with our drag-and-drop builder!</p>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .demo-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .demo-modal.show { opacity: 1; }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 800px;
            width: 90%;
            position: relative;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        }
        .demo-modal.show .modal-content { transform: scale(1); }
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
        }
        .video-container {
            margin: 1rem 0;
            aspect-ratio: 16/9;
        }
        .video-container iframe {
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Contact forms handling
function initContactForms() {
    const forms = document.querySelectorAll('form:not(.newsletter-form)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = 'Sending...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate for demo
        
        if (isSuccess) {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            showNotification('Oops! Something went wrong. Please try again.', 'error');
        }
        
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Testimonials slider
function initTestimonialsSlider() {
    const testimonials = [
        {
            text: "WebCraft Pro helped me launch my online store in just one weekend. The e-commerce features are incredibly easy to use.",
            author: "Sarah Johnson",
            title: "Owner, Boutique Decor",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%236366f1'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3ESJ%3C/text%3E%3C/svg%3E"
        },
        {
            text: "The drag-and-drop builder is so intuitive. I built my portfolio website in under 2 hours!",
            author: "Mike Chen",
            title: "Freelance Designer",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%238b5cf6'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3EMC%3C/text%3E%3C/svg%3E"
        },
        {
            text: "Customer support is outstanding. They helped me customize my template exactly how I wanted it.",
            author: "Emily Rodriguez",
            title: "Restaurant Owner",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%2310b981'/%3E%3Ctext x='25' y='30' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3EER%3C/text%3E%3C/svg%3E"
        }
    ];
    
    let currentTestimonial = 0;
    const testimonialContainer = document.querySelector('.testimonials-slider');
    
    if (testimonialContainer && testimonials.length > 1) {
        // Auto-rotate testimonials every 5 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            updateTestimonial();
        }, 5000);
        
        function updateTestimonial() {
            const testimonial = testimonials[currentTestimonial];
            const card = testimonialContainer.querySelector('.testimonial-card');
            
            if (card) {
                card.style.opacity = '0';
                
                setTimeout(() => {
                    card.querySelector('.testimonial-text').textContent = `"${testimonial.text}"`;
                    card.querySelector('.testimonial-author h4').textContent = testimonial.author;
                    card.querySelector('.testimonial-author p').textContent = testimonial.title;
                    card.querySelector('.testimonial-author img').src = testimonial.image;
                    card.style.opacity = '1';
                }, 300);
            }
        }
    }
}

// Animate on scroll effects
function initAOSEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add staggered animation delay for grid items
                if (element.classList.contains('feature-card') || 
                    element.classList.contains('template-item') || 
                    element.classList.contains('pricing-card')) {
                    const siblings = Array.from(element.parentNode.children);
                    const index = siblings.indexOf(element);
                    element.style.animationDelay = `${index * 0.1}s`;
                }
                
                element.classList.add('fade-in-up');
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const elements = document.querySelectorAll(`
        .feature-card, 
        .template-item, 
        .pricing-card, 
        .testimonial-card,
        .section-header,
        .hero-content,
        .hero-image
    `);
    
    elements.forEach(el => observer.observe(el));
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = `
            .notification {
                position: fixed;
                top: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification-success { background: #10b981; }
            .notification-error { background: #ef4444; }
            .notification-info { background: #6366f1; }
            .notification.show { transform: translateX(0); }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide and remove notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add some interactive template previews
function addTemplateInteractivity() {
    const templateItems = document.querySelectorAll('.template-item');
    
    templateItems.forEach(item => {
        const previewBtn = item.querySelector('.btn-outline');
        const useBtn = item.querySelector('.btn-primary');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Template preview would open in a new window', 'info');
            });
        }
        
        if (useBtn) {
            useBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Redirecting to template customization...', 'success');
            });
        }
    });
}

// Initialize template interactivity after DOM is loaded
document.addEventListener('DOMContentLoaded', addTemplateInteractivity);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.demo-modal');
        if (modal) {
            modal.click();
        }
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('accordion-btn')) {
        e.target.click();
    }
});

// Add loading animation for images
function initImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            });
        }
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', initImageLoading);

// Add performance optimization
function optimizePerformance() {
    // Lazy load images that are not in viewport
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);
