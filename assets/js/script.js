// ============================================================
// Varun M Portfolio - Interactive Behaviors & Nodemailer Integration
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // 1. Mobile Navigation Drawer Toggle
    // ------------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close drawer when any navigation link is clicked
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ------------------------------------------------------------
    // 2. Navbar Scroll Effect & Back-to-Top Button
    // ------------------------------------------------------------
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar shadow and frosted blur
        if (navbar) {
            if (scrollPos > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back-to-top button visibility
        if (backToTopBtn) {
            if (scrollPos > 350) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ------------------------------------------------------------
    // 3. Scrollspy: Active Navigation Item on Scroll
    // ------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navItems.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ------------------------------------------------------------
    // 4. Contact Form Submission via NodeMailer
    // ------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formResponse = document.getElementById('formResponse');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous response
            formResponse.className = 'form-response';
            formResponse.style.display = 'none';
            formResponse.innerHTML = '';

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic client validation
            if (!fullName || !email || !subject || !message) {
                displayFormResponse('error', 'Please fill in all required fields.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                displayFormResponse('error', 'Please enter a valid email address.');
                return;
            }

            // Button loading state
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            const btnIcon = submitBtn.querySelector('.btn-icon');

            submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending message...';
            if (btnSpinner) btnSpinner.style.display = 'inline-block';
            if (btnIcon) btnIcon.style.display = 'none';

            // Endpoint resolver: works if served by node server or static local file
            const endpoint = window.location.protocol.startsWith('http')
                ? '/api/contact'
                : 'http://localhost:3000/api/contact';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        subject,
                        message
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    let successHtml = `<span>${data.message || 'Your message has been sent successfully!'}</span>`;
                    
                    // If running with Ethereal development fallback, show instant email preview link
                    if (data.previewUrl) {
                        successHtml += `<div style="margin-top: 8px; font-size: 0.88rem;">
                            <strong>Preview delivered email:</strong> 
                            <a href="${data.previewUrl}" target="_blank" rel="noopener noreferrer">View Ethereal Preview &rarr;</a>
                        </div>`;
                    }

                    displayFormResponse('success', successHtml);
                    contactForm.reset();
                } else {
                    const errorMsg = data.message || 'Failed to send message. Please try again.';
                    displayFormResponse('error', errorMsg);
                }
            } catch (err) {
                console.error('Contact form submission error:', err);
                displayFormResponse(
                    'error',
                    'Unable to reach email server. Please ensure the Node server is running with <code>npm start</code> on port 3000.'
                );
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                if (btnSpinner) btnSpinner.style.display = 'none';
                if (btnIcon) btnIcon.style.display = 'inline-block';
            }
        });
    }

    function displayFormResponse(type, messageHtml) {
        formResponse.className = `form-response ${type}`;
        formResponse.innerHTML = messageHtml;
        formResponse.style.display = 'block';

        // Auto-scroll to response if needed
        formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});