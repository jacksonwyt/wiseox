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

        // Initialize scroll animations
        function setupScrollAnimations() {
            const scrollGifs = document.querySelectorAll('.scroll-gif');
            const stepItems = document.querySelectorAll('.step-item');
            
            // Remove any existing observers
            if (window.scrollObserver) {
                window.scrollObserver.disconnect();
            }

            // Use same configuration regardless of device
            const observerThreshold = 0.6;
            const observerMargin = '-10% 0px -10% 0px';
            
            // Make sure all step items are visible initially
            stepItems.forEach((item, index) => {
                item.style.display = 'flex';
            });

            // Create new intersection observer
            window.scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const gif = entry.target;
                        const index = Array.from(scrollGifs).indexOf(gif);
                        
                        // Remove active class from all items
                        scrollGifs.forEach(g => g.classList.remove('active'));
                        stepItems.forEach(item => item.classList.remove('active'));
                        
                        // Add active class only to current item
                        gif.classList.add('active');
                        if (stepItems[index]) {
                            stepItems[index].classList.add('active');
                        }
                    }
                });
            }, {
                threshold: observerThreshold,
                rootMargin: observerMargin
            });
            
            // Observe all GIFs
            scrollGifs.forEach(gif => window.scrollObserver.observe(gif));
            
            // Add click/touch events to step items
            stepItems.forEach((item, index) => {
                // Remove any existing event listeners
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                
                newItem.addEventListener('click', () => {
                    if (scrollGifs[index]) {
                        // Smooth scroll to the corresponding GIF
                        scrollGifs[index].scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        
                        // Apply active states immediately for better UX
                        scrollGifs.forEach((gif, i) => {
                            gif.classList.toggle('active', i === index);
                        });
                        
                        stepItems.forEach((step, i) => {
                            step.classList.toggle('active', i === index);
                        });
                    }
                });
            });
            
            // Force reflow to ensure styles are applied
            setTimeout(() => {
                // Activate first item by default
                if (scrollGifs[0] && stepItems[0]) {
                    scrollGifs[0].classList.add('active');
                    stepItems[0].classList.add('active');
                }
            }, 500);
        }

        // Initialize scroll animations
        setupScrollAnimations();
        
        // Fix for the mobile navbar
        $('.mobile-menu-btn').on('click', function(e) {
            e.stopPropagation();
            $('.nav-menu').toggleClass('active');
            
            // Change icon between bars and X
            if ($('.nav-menu').hasClass('active')) {
                $(this).html('<i class="fas fa-times"></i>');
            } else {
                $(this).html('<i class="fas fa-bars"></i>');
            }
        });
        
        // Close mobile menu when clicking anywhere else on the page
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.nav-menu, .mobile-menu-btn').length) {
                $('.nav-menu').removeClass('active');
                $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
            }
        });
        
        // Prevent menu from closing when clicking inside it
        $('.nav-menu').on('click', function(e) {
            e.stopPropagation();
        });
        
        // Close menu when clicking on a nav link (for single page sites)
        $('.nav-menu a').on('click', function() {
            $('.nav-menu').removeClass('active');
            $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
        });
        
        // Reinitialize on resize with debounce
        let resizeTimer;
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                setupScrollAnimations();
                
                // Reset mobile menu state on resize
                if ($(window).width() > 768) {
                    $('.nav-menu').removeClass('active');
                    $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
                }
            }, 250);
        });
    });
    
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