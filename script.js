// Simple contact form handler (no EmailJS required)
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const formMessage = document.getElementById('formMessage');

  // Validation
  if (!name || !email || !message) {
    formMessage.textContent = 'Please fill in all fields.';
    formMessage.style.color = 'red';
    return;
  }

  // Show process indicator
  showProcessIndicator('Preparing your message...');
  formMessage.textContent = '';

  // Create mailto link with form data
  const subject = encodeURIComponent(`New Contact Form Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoLink = `mailto:eduorgx@gmail.com?subject=${subject}&body=${body}`;
  
  // Simulate processing time
  setTimeout(() => {
    // Update process indicator message
    showProcessIndicator('Opening email client...');
    
    setTimeout(() => {
      // Open default email client with pre-filled message
      window.location.href = mailtoLink;
      
      // Hide process indicator
      hideProcessIndicator();
      
      // Show success message
      formMessage.textContent = `Thanks, ${name}! Your email client should open with a pre-filled message. Please send it to complete your inquiry.`;
      formMessage.style.color = 'green';
      
      // Reset form
      document.getElementById('contactForm').reset();
    }, 1000);
  }, 1000);
});

// Process Indicator Functions
function showProcessIndicator(message = 'Processing...') {
  const indicator = document.getElementById('processIndicator');
  const messageElement = document.getElementById('processMessage');
  messageElement.textContent = message;
  indicator.classList.add('show');
}

function hideProcessIndicator() {
  const indicator = document.getElementById('processIndicator');
  indicator.classList.remove('show');
}

// Show process indicator for external navigation links
document.addEventListener('DOMContentLoaded', function() {
  const externalLinks = document.querySelectorAll('a[href$=".html"]');
  
  externalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && (href.includes('Website.html') || href.includes('homeAI.html'))) {
        showProcessIndicator('Loading page...');
        
        // Allow normal navigation to proceed
        setTimeout(() => {
          hideProcessIndicator();
        }, 2000);
      }
    });
  });
});

// Hide process indicator if user navigates back
window.addEventListener('pageshow', function() {
  hideProcessIndicator();
});
