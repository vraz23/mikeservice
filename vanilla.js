// Mike's Eco Handyman Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation (if added later)
    function smoothScroll(target) {
        document.querySelector(target).scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Phone number click tracking
    const phoneNumber = document.querySelector('.phone-number');
    if (phoneNumber) {
        phoneNumber.addEventListener('click', function() {
            // Make phone number clickable
            window.location.href = 'tel:+15551234567';
        });
        
        // Add hover effect
        phoneNumber.style.cursor = 'pointer';
        phoneNumber.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        phoneNumber.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Website link functionality
    const websiteLink = document.querySelector('.website');
    if (websiteLink) {
        websiteLink.style.cursor = 'pointer';
        websiteLink.addEventListener('click', function() {
            // For demo purposes, show alert since domain might not exist
            alert('Visit www.mikesecohandyman.com for more information!');
        });
    }

    // Service items hover effects
    const serviceItems = document.querySelectorAll('.service-category');
    serviceItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 8px 16px rgba(76, 175, 80, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-category, .tagline, .warranty-title');
        
        elements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate-in');
            }
        });
    }

    // Add CSS animation class
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .service-category {
                opacity: 0;
                transform: translateY(30px);
            }
            
            .tagline {
                opacity: 0;
                transform: translateY(30px);
            }
            
            .warranty-title {
                opacity: 0;
                transform: translateY(30px);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize animations
    addAnimationStyles();
    animateOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);

    // Contact form functionality (if expanded later)
    function createContactForm() {
        const contactSection = document.querySelector('.contact-section .container');
        
        const formHTML = `
            <div class="contact-form" style="margin-top: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
                <h3 style="color: #4CAF50; text-align: center; margin-bottom: 1rem;">Get a Free Quote</h3>
                <form id="ecoContactForm">
                    <input type="text" placeholder="Your Name" required style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 2px solid #4CAF50; border-radius: 5px;">
                    <input type="email" placeholder="Your Email" required style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 2px solid #4CAF50; border-radius: 5px;">
                    <input type="tel" placeholder="Your Phone" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 2px solid #4CAF50; border-radius: 5px;">
                    <select required style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 2px solid #4CAF50; border-radius: 5px;">
                        <option value="">Select Service Needed</option>
                        <option value="yard-care">Yard & Lawn Care</option>
                        <option value="power-washing">Power Washing</option>
                        <option value="home-maintenance">Home Maintenance</option>
                        <option value="vacation-care">Vacation House Care</option>
                        <option value="termite-treatment">Termite & Trenching</option>
                        <option value="other">Other</option>
                    </select>
                    <textarea placeholder="Describe your project..." rows="4" style="width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 2px solid #4CAF50; border-radius: 5px; resize: vertical;"></textarea>
                    <button type="submit" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; transition: all 0.3s ease;">
                        Get Free Eco-Friendly Quote
                    </button>
                </form>
            </div>
        `;
        
        // Uncomment to add contact form
        // contactSection.innerHTML += formHTML;
    }

    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const formMessage = document.getElementById('formMessage');
            const submitButton = document.querySelector('#contactForm button[type="submit"]');

            // Validation
            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.style.color = 'red';
                return;
            }

            // Show loading state
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            formMessage.textContent = '';

            // Create mailto link with form data
            const subject = encodeURIComponent(`New Quote Request from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject Details:\n${message}\n\nPlease contact me for a quote on this project.`);
            const mailtoLink = `mailto:eduorgx@gmail.com?subject=${subject}&body=${body}`;
            
            // Simulate processing time
            setTimeout(() => {
                // Open default email client with pre-filled message
                window.location.href = mailtoLink;
                
                // Show success message
                formMessage.textContent = `Thanks, ${name}! Your email client should open with a pre-filled message. Please send it to complete your quote request.`;
                formMessage.style.color = '#4a7c59';
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitButton.textContent = 'Request Quote';
                submitButton.disabled = false;
            }, 1000);
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Eco-friendly tips feature
    const ecoTips = [
        "💡 Use native plants to reduce water usage",
        "🌱 Composting reduces waste and enriches soil naturally",
        "💧 Collect rainwater for eco-friendly watering",
        "🏠 Regular maintenance prevents bigger environmental impact",
        "🌿 Choose non-toxic cleaning products for your home"
    ];

    function showEcoTip() {
        const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)];
        
        // Create tip display
        const tipDiv = document.createElement('div');
        tipDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        tipDiv.innerHTML = `
            <strong>🌿 Eco Tip:</strong><br>
            ${randomTip}
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 10px;">×</button>
        `;
        
        document.body.appendChild(tipDiv);
        
        // Animate in
        setTimeout(() => {
            tipDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            if (tipDiv.parentElement) {
                tipDiv.style.transform = 'translateX(100%)';
                setTimeout(() => tipDiv.remove(), 300);
            }
        }, 8000);
    }

    // Show eco tip periodically (uncomment to enable)
    // setTimeout(showEcoTip, 3000);
    // setInterval(showEcoTip, 30000);

    console.log('🌿 Mike\'s Eco Handyman website loaded successfully!');
    console.log('💚 Committed to eco-friendly home and yard care!');
});
