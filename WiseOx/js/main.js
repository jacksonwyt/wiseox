/**
 * Main JavaScript file for the Wise Ox website
 */

(function($) {
    'use strict';
    
    // Initialize when document is ready
    $(document).ready(function() {
        // Initialize Swiper for logo scroll
        if (typeof Swiper !== 'undefined') {
            new Swiper('.logo-swiper', {
                slidesPerView: 'auto',
                spaceBetween: 30,
                loop: true,
                speed: 3000,
                autoplay: {
                    delay: 1,
                    disableOnInteraction: false
                },
                pauseOnMouseEnter: true,
                grabCursor: true
            });
        }

        // Scroll Animation Steps
        function handleScrollAnimations() {
            const scrollContainer = $('.scroll-container');
            const steps = $('.step-item');
            const animations = $('.scroll-gif');
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();
            
            animations.each(function(index) {
                const animation = $(this);
                const animationTop = animation.offset().top;
                const animationHeight = animation.outerHeight();
                const animationCenter = animationTop + (animationHeight / 2);
                
                // Check if animation is in viewport (centered in the middle of the viewport)
                if (animationCenter > scrollTop && animationCenter < (scrollTop + windowHeight)) {
                    // Update active step and animation
                    steps.removeClass('active');
                    animations.removeClass('active');
                    
                    steps.eq(index).addClass('active');
                    animation.addClass('active');
                }
            });
        }
        
        // Run scroll animation on page load and on scroll
        $(window).on('load scroll', function() {
            handleScrollAnimations();
        });

        // Mobile menu functionality
        $('.mobile-menu-btn').on('click', function() {
            $(this).toggleClass('active');
            $('.nav-menu').toggleClass('active');
        });
        
        // Close mobile menu when clicking outside
        $(document).on('click', function(event) {
            if (!$(event.target).closest('.mobile-menu-btn, .nav-menu').length) {
                $('.nav-menu').removeClass('active');
                $('.mobile-menu-btn').removeClass('active');
            }
        });
        
        // Sticky header effect
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > 100) {
                $('.navbar').addClass('sticky');
            } else {
                $('.navbar').removeClass('sticky');
            }
        });
        
        // Form validation for contact form
        $('#contact-form').on('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const nameField = $('#name');
            const emailField = $('#email');
            const messageField = $('#message');
            
            // Reset errors
            $('.form-control').removeClass('error');
            
            // Validate name
            if (nameField.val().trim() === '') {
                nameField.addClass('error');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.val())) {
                emailField.addClass('error');
                isValid = false;
            }
            
            // Validate message
            if (messageField.val().trim() === '') {
                messageField.addClass('error');
                isValid = false;
            }
            
            // Submit if valid
            if (isValid) {
                // Here would be the AJAX call to submit the form
                $('.form-message').html('<div class="success-message">Thank you! Your message has been sent.</div>');
                this.reset();
            } else {
                $('.form-message').html('<div class="error-message">Please complete all required fields correctly.</div>');
            }
        });
    });
    
    // Preloader effect
    $(window).on('load', function() {
        $('.preloader').addClass('fade-out');
        setTimeout(function() {
            $('.preloader').hide();
        }, 500);
    });
    
    // Fallback for preloader
    setTimeout(function() {
        $('.preloader').addClass('fade-out');
        setTimeout(function() {
            $('.preloader').hide();
        }, 500);
    }, 1500);
    
    // Trigger animation when element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Check for elements in viewport on scroll
    $(window).on('scroll resize', function() {
        $('.animated').each(function() {
            if (isInViewport(this)) {
                $(this).addClass('animate');
            }
        });
    }).scroll();
    
})(jQuery); 