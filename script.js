
// Simple contact form handler (no EmailJS required)
document.getElementById('contactForm').addEventListener('submit', function (e) {
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
  const subject = encodeURIComponent(`New Contact Form Message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoLink = `mailto:eduorgx@gmail.com?subject=${subject}&body=${body}`;
  
  // Simulate processing time
  setTimeout(() => {
    // Open default email client with pre-filled message
    window.location.href = mailtoLink;
    
    // Show success message
    formMessage.textContent = `Thanks, ${name}! Your email client should open with a pre-filled message. Please send it to complete your inquiry.`;
    formMessage.style.color = 'green';
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Reset button state
    submitButton.textContent = 'Send Message';
    submitButton.disabled = false;
  }, 1000);
});
