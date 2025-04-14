// Import main stylesheet
import './styles.css';
import $ from 'jquery';
import Swiper from 'swiper/bundle'; // Import Swiper bundle
import 'swiper/css/bundle'; // Import Swiper styles bundle
import lottie from 'lottie-web'; // Import Lottie library

// Import template generators
import { createNavbar } from './templates/navbar.js';
import { createFooter } from './templates/footer.js';
import { createMobileNavButton } from './templates/mobileNavButton.js';
import { createLogoScroller } from './templates/logoScroller.js';

/**
 * Main JavaScript file for the Wise Ox website
 */

'use strict';

let lottieInstances = {}; // Define outside to persist across calls

/**
 * Determines the current page based on the URL pathname.
 * Used for setting the active state in the navigation.
 * @returns {string}
 */
export function getCurrentPage() {
  const path = window.location.pathname;
  if (path.endsWith('/') || path.endsWith('index.html')) {
    return 'home';
  }
  if (path.endsWith('case-studies.html')) {
    return 'case-studies';
  }
  if (path.endsWith('contact.html')) {
    return 'contact';
  }
  return ''; // Default or unknown page
}

// Inject templates and then run initializations
function initializePage() {
  try { // Add top-level try
    const currentPage = getCurrentPage();

    // Inject templates
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const mobileNavButtonPlaceholder = document.getElementById('mobile-nav-button-placeholder');
    const logoScrollerPlaceholder = document.querySelector('.logo-scroller-placeholder');

    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = createNavbar(currentPage);
    }
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = createFooter();
    }
    if (mobileNavButtonPlaceholder) {
      mobileNavButtonPlaceholder.innerHTML = createMobileNavButton();
    }
    if (logoScrollerPlaceholder) {
      logoScrollerPlaceholder.innerHTML = createLogoScroller();
    }

    // --- All other initializations go AFTER templates are injected ---

    // Ensure jQuery is ready before using $
    $(document).ready(function () {
      /**
       * Sets up the mobile navigation toggle functionality.
       * Handles opening/closing the menu, focus trapping, and event listeners
       * for the hamburger button and menu interactions.
       */
      function setupMobileNavToggle() {
        const $navMenu = $('.nav-menu');
        const $mobileBtn = $('.mobile-menu-btn'); // Standard hamburger
        const $stickyBtn = $('.sticky-plus-btn'); // Mobile sticky button
        const focusableSelector = 'a[href]'; // Selector for focusable elements within menu
        let triggerElement = null; // To store the element that opened the menu

        /**
         * Opens the mobile navigation menu.
         * Adds active classes, updates button state, and traps focus.
         * @param {HTMLElement} [buttonClicked] - The button element that triggered the open action.
         */
        function openMenu(buttonClicked) {
          triggerElement = buttonClicked || document.activeElement;
          $navMenu.addClass('active');
          $mobileBtn.addClass('active'); // Keep hamburger visually active (if visible)
          $stickyBtn.addClass('active').html('<i class="fas fa-times"></i>'); // Set sticky to active/close icon

          // Wait for animation, then focus first item
          setTimeout(() => {
            const firstFocusable = $navMenu.find(focusableSelector).first();
            if (firstFocusable.length) {
              firstFocusable.focus();
            }
            // Add keydown listener for focus trapping
            $(document).on('keydown.navMenuFocusTrap', handleFocusTrap);
          }, 100); // Adjust timeout if needed based on CSS transition
        }

        /**
         * Closes the mobile navigation menu.
         * Removes active classes, updates button state, removes focus trap,
         * and restores focus to the element that opened the menu.
         */
        function closeMenu() {
          // Remove keydown listener first
          $(document).off('keydown.navMenuFocusTrap');

          $navMenu.removeClass('active');
          $mobileBtn.removeClass('active');
          $stickyBtn.removeClass('active').html('<i class="fas fa-plus"></i>'); // Reset sticky to inactive/plus icon

          // Restore focus to the element that opened the menu
          if (triggerElement && typeof triggerElement.focus === 'function') {
            triggerElement.focus();
          }
          triggerElement = null; // Clear the stored element
        }

        /**
         * Handles focus trapping within the open mobile navigation menu.
         * Prevents Tab key from moving focus outside the menu.
         * @param {jQuery.Event} e - The keydown event object.
         */
        function handleFocusTrap(e) {
          if (e.key !== 'Tab') return; // Only handle Tab key

          const focusableElements = $navMenu.find(focusableSelector).filter(':visible');
          if (focusableElements.length === 0) return; // No focusable elements

          const firstFocusable = focusableElements.first();
          const lastFocusable = focusableElements.last();
          const currentFocus = document.activeElement;

          if (e.shiftKey) { // Shift + Tab
            if (currentFocus === firstFocusable[0]) {
              e.preventDefault();
              lastFocusable.focus(); // Wrap to last element
            }
          } else { // Tab
            if (currentFocus === lastFocusable[0]) {
              e.preventDefault();
              firstFocusable.focus(); // Wrap to first element
            }
          }
        }

        // Use event delegation for dynamically added elements
        // Handle clicks on the standard hamburger button
        $(document).on('click', '.mobile-menu-btn', function () {
          if ($navMenu.hasClass('active')) {
            closeMenu();
          } else {
            openMenu(this);
          }
        });

        // Handle clicks/touches on the sticky plus button
        $(document).on('click', '.sticky-plus-btn', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if ($navMenu.hasClass('active')) {
            closeMenu();
          } else {
            openMenu(this);
          }
          return false;
        });

        // Close menu when clicking outside
        $(document).on('click', function (event) {
          const $target = $(event.target);
          if (!$target.closest('.mobile-menu-btn, .sticky-plus-btn, .nav-menu').length && $navMenu.hasClass('active')) { // Check both buttons
            closeMenu();
          }
        });

        // Close menu when clicking a menu item
        // Use delegation as nav-menu is dynamically added
        $(document).on('click', '.nav-menu a', function () {
          if ($navMenu.hasClass('active')) {
            closeMenu();
            // Note: Focus will be restored to the trigger button.
            // If you want focus to move to the content linked by the anchor,
            // that would require additional logic after navigation.
          }
        });
      }
      setupMobileNavToggle(); // Call the setup function

      // --- Existing initializations ---
      // Initialize Swiper for logo scroll
      if (typeof Swiper !== 'undefined' && $('.logo-swiper').length) {
        try {
          new Swiper('.logo-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            loop: true,
            speed: 3000,
            autoplay: {
              delay: 1,
              disableOnInteraction: false,
            },
            pauseOnMouseEnter: true,
            grabCursor: true,
          });
        } catch (error) {
          console.error('Failed to initialize Swiper for logo scroll:', error);
          // Optionally, hide or provide feedback in the UI if initialization fails
          $('.logo-swiper').hide(); // Example: hide the element if Swiper fails
        }
      } else if ($('.logo-swiper').length) {
        console.warn('Swiper library not loaded or .logo-swiper element not found.');
      }

      // --- Typewriter Effect (from case-studies.html) ---
      // Function to simulate typing
      function typeWriter(element, text, speed = 50) {
        return new Promise(resolve => {
          element.style.visibility = 'visible';
          element.innerHTML = ''; // Clear existing content
          let i = 0;
          function type() {
            if (i < text.length) {
              element.textContent += text.charAt(i);
              i += 1;
              setTimeout(type, speed);
            } else {
              resolve(); // Resolve the promise when typing is done
            }
          }
          type();
        });
      }

      // Function to apply typewriter effect to relevant elements
      async function runTypewriterEffect() {
        try {
          const elements = document.querySelectorAll('.case-study-description, .case-study-result');
          if (elements.length > 0) { // Only run if elements exist
            // Store original texts before clearing
            const originalTexts = Array.from(elements).map(el => el.textContent);

            // Use Promise.all to wait for all typewriters to finish
            const promises = Array.from(elements).map((element, index) => {
              return typeWriter(element, originalTexts[index]); // Pass original text
            });

            await Promise.all(promises);
            console.info('Typewriter effect completed.');
          }
        } catch (error) {
          console.warn('Error running typewriter effect:', error);
          // Optional: Fallback or UI feedback if typewriter fails
        }
      }

      // Run the typewriter effect if on the case studies page
      if (currentPage === 'case-studies') {
        runTypewriterEffect();
      }
      // --- End Typewriter Effect ---

      /**
       * Adjusts the minimum height of the scroll section container
       * to ensure the sticky sidebar has enough scrollable space.
       */
      function setupStickySidebar() {
        const sidebar = document.querySelector('.text-sidebar-wrapper');
        const scrollSection = document.querySelector('.scroll-section');

        if (!sidebar || !scrollSection) return;

        // Ensure the scroll section has enough height for scrolling
        const gifsArea = document.querySelector('.gifs-area');
        if (gifsArea) {
          const gifsHeight = gifsArea.offsetHeight;
          scrollSection.style.minHeight = `${gifsHeight}px`;
        }
      }

      // Initialize sticky sidebar
      setupStickySidebar();

      /**
       * Initializes Lottie animations for the scroll-based interaction section.
       * Uses IntersectionObserver on desktop to play/pause animations and update text steps.
       * Plays all animations continuously on mobile.
       * Handles cleanup of existing observers and Lottie instances before re-initializing.
       */
      function setupScrollAnimations() {
        // Check if Lottie library is loaded
        if (typeof lottie === 'undefined') {
          console.error('Lottie library not loaded.');
          return;
        }

        const animationContainers = document.querySelectorAll('.lottie-animation');
        const stepItems = document.querySelectorAll('.step-item');
        const isMobile = window.innerWidth <= 768;

        // --- Improved Cleanup ---
        // Disconnect existing observer
        if (window.scrollObserver) {
          window.scrollObserver.disconnect();
          window.scrollObserver = null; // Clear the reference
        }
        // Destroy existing Lottie instances
        Object.values(lottieInstances).forEach(instance => {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        });
        lottieInstances = {}; // Reset the instances object
        // --- End Improved Cleanup ---

        // Initialize Lottie animations
        animationContainers.forEach((container, index) => {
          const path = container.dataset.jsonPath;
          if (path) {
            try {
              const instance = lottie.loadAnimation({
                container,
                renderer: 'svg', // or 'canvas'
                loop: true,
                autoplay: false, // Important: Start paused
                path,
              });
              lottieInstances[index] = instance;

              // Ensure container is ready for observation
              container.style.minHeight = '200px'; // Adjust if needed
              container.style.width = '100%';
              container.style.opacity = '0.3'; // Start dimmed
              container.style.transition = 'opacity 0.3s ease';

              // Ensure container is visible for observer
              container.style.display = 'block';
            } catch (error) {
              console.error(`Error loading Lottie animation ${path}:`, error);
              container.innerHTML = `Error loading animation: ${path}`; // Show error in container
            }
          }
        });

        const observerOptions = {
          root: null,
          rootMargin: '-20% 0px -20% 0px',
          threshold: 0.5, // Trigger when 50% visible
        };

        stepItems.forEach(item => item.style.display = 'flex');
        // animationContainers display is set during init loop

        if (isMobile) {
          document.querySelectorAll('.mobile-caption').forEach(caption => caption.style.display = 'block');
          // On mobile, play all and make visible
          animationContainers.forEach((container, index) => {
            container.style.opacity = '1';
            if (lottieInstances[index]) {
              lottieInstances[index].play();
            }
          });
        } else {
          // --- Desktop Observer Logic ---
          let firstAnimationActivated = false; // Track initial activation

          window.scrollObserver = new IntersectionObserver((entries) => {
            try {
              let activeEntryFoundThisCycle = false;

              entries.forEach(entry => {
                const container = entry.target;
                const index = Array.from(animationContainers).indexOf(container);
                const isActive = entry.isIntersecting && entry.intersectionRatio >= 0.5;

                if (isActive && !activeEntryFoundThisCycle) {
                  // --- Activate this one ---
                  // Deactivate others first
                  stepItems.forEach(step => step.classList.remove('active'));
                  animationContainers.forEach((cont, i) => {
                    if (i !== index) { // Don't pause the one we are activating
                      cont.style.opacity = '0.3';
                      if (lottieInstances[i]) lottieInstances[i].pause();
                    }
                  });

                  // Activate current
                  if (stepItems[index]) stepItems[index].classList.add('active');
                  container.style.opacity = '1';
                  if (lottieInstances[index]) lottieInstances[index].goToAndPlay(0, true);

                  activeEntryFoundThisCycle = true;
                  firstAnimationActivated = true; // Mark that at least one has been activated
                } else if (!isActive && container.style.opacity === '1') {
                  // --- Potentially deactivate if scrolling away ---
                  // Optional: You might want to pause but keep opacity=1 until another activates
                  // Or dim it immediately:
                  // container.style.opacity = '0.3';
                  // if (lottieInstances[index]) lottieInstances[index].pause();
                }
              });

              if (!activeEntryFoundThisCycle && firstAnimationActivated) { /* eslint-disable-line max-len */
                // Don't change anything, let the last active one remain visible/playing
              } else if (!activeEntryFoundThisCycle && !firstAnimationActivated) {
                // Initial load state - activate the first one
                if (stepItems[0]) stepItems[0].classList.add('active');
                if (animationContainers[0]) animationContainers[0].style.opacity = '1';
                if (lottieInstances[0]) lottieInstances[0].goToAndPlay(0, true);
                firstAnimationActivated = true;
              }
            } catch (error) {
              console.error('Error in IntersectionObserver callback:', error);
              // Optionally, disconnect the observer if errors are persistent
              // if (window.scrollObserver) window.scrollObserver.disconnect();
            }
          }, observerOptions);

          animationContainers.forEach(container => {
            const containerIndex = Array.from(animationContainers).indexOf(container);
            const lottieInstance = lottieInstances[containerIndex];
            if (lottieInstance) { // Only observe if Lottie loaded
              window.scrollObserver.observe(container);
            }
          });
        }

        stepItems.forEach((item, index) => {
          item.addEventListener('click', () => {
            const targetContainer = animationContainers[index];
            if (targetContainer) {
              targetContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Optional: Force activation on click (observer should handle)
              // e.g., stepItems.forEach(step => step.classList.remove('active'));
              // e.g., animationContainers.forEach(cont => cont.style.opacity = '0.3');
              // e.g., if (lottieInstances[index]) {
              //   lottieInstances[index].play(); targetContainer.style.opacity = '1';
              // }
              // e.g., if (stepItems[index]) { stepItems[index].classList.add('active'); }
            }
          });
        });

        // Initial trigger after setup
        setTimeout(() => {
          window.dispatchEvent(new Event('scroll')); // Trigger observer check
        }, 200);
      }

      // Initialize scroll animations
      setupScrollAnimations();

      /**
       * Sets up the contact form validation and submission logic.
       * Includes basic validation for required fields and email format.
       * Handles asynchronous form submission to the /api/contact endpoint,
       * including CSRF token handling and displaying success/error messages.
       */
      function setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return; // Only run if form exists

        // Add a placeholder for status messages if it doesn't exist
        let statusDiv = form.querySelector('.form-status');
        if (!statusDiv) {
          statusDiv = document.createElement('div');
          statusDiv.className = 'form-status';
          form.appendChild(statusDiv); // Append it to the form
        }

        $(form).on('submit', function (e) {
          e.preventDefault();

          // Clear previous status
          $(statusDiv).hide().html('');
          $('.form-group input, .form-group textarea').removeClass('error'); // Use more specific selector

          let isValid = true;
          const nameField = $('#name');
          const emailField = $('#email');
          const subjectField = $('#subject'); // Keep subject validation
          const messageField = $('#message');
          const phoneField = $('#phone'); // Get phone field

          // Validate name
          if (nameField.val().trim() === '') {
            nameField.closest('.form-group').addClass('error'); // Add error class to parent
            isValid = false;
          }

          // Validate email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailField.val())) {
            emailField.closest('.form-group').addClass('error');
            isValid = false;
          }

          // Validate subject
          if (subjectField.val().trim() === '') {
            subjectField.closest('.form-group').addClass('error');
            isValid = false;
          }

          // Validate message
          if (messageField.val().trim() === '') {
            messageField.closest('.form-group').addClass('error');
            isValid = false;
          }

          // If valid, construct mailto link and open email client
          if (isValid) {
            const recipientEmail = 'info@wiseoxmedia.com'; // Define recipient email
            const subject = subjectField.val();
            const name = nameField.val();
            const email = emailField.val();
            const phone = phoneField.val(); // Get phone value
            const message = messageField.val();

            // Construct the email body
            const body = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
            `.trim(); // Use trim() to remove leading/trailing whitespace

            // Construct the mailto link - encode subject and body
            const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open the user's default email client
            window.location.href = mailtoLink;

            // Provide feedback and reset the form after a short delay
            $(statusDiv).html('<div class="success">Opening your email application...</div>').fadeIn();
            setTimeout(() => {
              this.reset();
              // Optionally clear the status message after a bit longer
              setTimeout(() => $(statusDiv).fadeOut(), 5000);
            }, 500);
          } else {
            // Show validation error message
            $(statusDiv).html('<div class="error">Please complete all required fields correctly.</div>').fadeIn();
          }
        });
      }
      setupContactForm();

      /**
       * Sets up the scroll-to-top button functionality.
       * Shows the button when the user scrolls down and hides it near the top.
       * Animates scrolling back to the top when the button is clicked.
       */
      function setupScrollToTop() {
        const scrollTopBtn = $('.scroll-top');
        if (!scrollTopBtn.length) return; // Check if element exists

        $(window).on('scroll', function () {
          if ($(this).scrollTop() > 300) { // Show after scrolling down 300px
            scrollTopBtn.fadeIn();
          } else {
            scrollTopBtn.fadeOut();
          }
        });

        scrollTopBtn.on('click', function () {
          $('html, body').animate({ scrollTop: 0 }, 500); // Smooth scroll to top
          return false;
        });
      }
      setupScrollToTop(); // Call the function

      /**
       * Sets up generic scroll-triggered animations for elements with specific classes
       * (e.g., .animate-slide-up, .animate-fade-in).
       * Uses a helper function to check if an element is in the viewport.
       */
      function setupGenericAnimations() {
        const animatedElements = $('.animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-fade-in');
        if (!animatedElements.length) return;

        /**
         * Checks if a given element is currently within the browser viewport.
         * @param {HTMLElement} element - The DOM element to check.
         * @returns {boolean}
         */
        function isInViewport(element) {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return (
            rect.top < (window.innerHeight || document.documentElement.clientHeight)
                        && rect.left < (window.innerWidth || document.documentElement.clientWidth)
                        && rect.bottom > 0
                        && rect.right > 0
          );
        }

        /**
         * Callback function executed on scroll and resize events.
         * Iterates through elements marked for generic animation and adds
         * the 'animated' and specific animation classes (e.g., 'slide-up-active')
         * when they enter the viewport.
         */
        function animateOnScroll() {
          animatedElements.each(function () {
            try { // Add try block inside loop
              const $this = $(this);
              if (!$this.hasClass('animated') && isInViewport(this)) {
                // Add a class to trigger the animation
                $this.addClass('animated');
                // Find delay class and apply style directly
                const delayClass = this.className.match(/delay-(\d+)/);
                if (delayClass && delayClass[1]) {
                  $this.css('animation-delay', `${delayClass[1]}ms`);
                }
                // Add the animation class itself
                if ($this.hasClass('animate-slide-up')) $this.addClass('slide-up-active');
                if ($this.hasClass('animate-slide-left')) $this.addClass('slide-left-active');
                if ($this.hasClass('animate-slide-right')) $this.addClass('slide-right-active');
                if ($this.hasClass('animate-fade-in')) $this.addClass('fade-in-active');
              }
            } catch (error) { // Add catch block inside loop
              console.warn('Error processing generic animation for element:', this, error);
              // Continue to next element even if one fails
            }
          });
        }

        // Run check on load and scroll
        animateOnScroll();
        $(window).on('scroll resize', animateOnScroll);
      }
      setupGenericAnimations();
    }); // End $(document).ready
  } catch (error) { // Add top-level catch
    console.error('Critical error during page initialization:', error);
    // Optionally display a user-facing message indicating a site error
    // document.body.innerHTML = 'An error occurred loading the page. Please try refreshing.';
  }
}

// --- Final Initializations ---
initializePage(); // Initialize everything when the script loads
