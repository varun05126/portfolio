// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Form submission placeholder
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // TODO: wire this up to Formspree or EmailJS
    alert('Form submission not implemented yet. Please configure your form endpoint.');
    // Optionally you could reset the form here after successful submission
    // this.reset();
});