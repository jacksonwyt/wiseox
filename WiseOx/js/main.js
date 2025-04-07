/**
 * Main JavaScript file for the Wise Ox website
 */

(function($) {
    'use strict';
    
    // Initialize when document is ready
    $(document).ready(function() {
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
        
        // Animated counter for statistics (can be added later)
        function animateCounter() {
            $('.counter').each(function() {
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function(now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
        }
        
        // Testimonial slider (can be implemented with Swiper)
        if (typeof Swiper !== 'undefined') {
            const testimonialSwiper = new Swiper('.testimonial-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                }
            });
        }
        
        // Scroll Animation Steps
        function handleScrollAnimations() {
            const scrollContainer = $('.scroll-container');
            
            if (scrollContainer.length) {
                const steps = $('.scroll-step');
                const animations = $('.scroll-animation');
                const windowHeight = $(window).height();
                const scrollTop = $(window).scrollTop();
                
                steps.each(function(index) {
                    const step = $(this);
                    const stepTop = step.offset().top;
                    const stepHeight = step.outerHeight();
                    const stepCenter = stepTop + (stepHeight / 2);
                    
                    // Check if step is in viewport (centered in the middle of the viewport)
                    if (stepCenter > scrollTop && stepCenter < (scrollTop + windowHeight)) {
                        // Update active step
                        steps.removeClass('active');
                        step.addClass('active');
                        
                        // Update visible animation
                        animations.hide();
                        animations.eq(index).fadeIn(300);
                    }
                });
            }
        }
        
        // Run scroll animation on page load and on scroll
        $(window).on('load scroll', function() {
            handleScrollAnimations();
        });
        
        // Portfolio filter effect (for later implementation)
        $('.portfolio-filter li').on('click', function() {
            const filterValue = $(this).attr('data-filter');
            
            $('.portfolio-filter li').removeClass('active');
            $(this).addClass('active');
            
            if (filterValue === 'all') {
                $('.portfolio-item').show(300);
            } else {
                $('.portfolio-item').not('.' + filterValue).hide(300);
                $('.portfolio-item').filter('.' + filterValue).show(300);
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
    
    // Preloader effect - moved outside document.ready to ensure it works properly
    $(window).on('load', function() {
        $('.preloader').addClass('fade-out');
        setTimeout(function() {
            $('.preloader').hide();
        }, 500);
    });
    
    // Fallback for preloader in case window load event doesn't fire
    setTimeout(function() {
        $('.preloader').addClass('fade-out');
        setTimeout(function() {
            $('.preloader').hide();
        }, 500);
    }, 1500); // Reduced timeout from 3000ms to 1500ms
    
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