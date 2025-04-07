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

        // Ensure sticky sidebar works properly
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

        // Initialize scroll animations
        function setupScrollAnimations() {
            const scrollGifs = document.querySelectorAll('.scroll-gif');
            const stepItems = document.querySelectorAll('.step-item');
            const isMobile = window.innerWidth <= 768;
            
            // Remove any existing observers
            if (window.scrollObserver) {
                window.scrollObserver.disconnect();
            }

            // Improved threshold for better activation timing
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -20% 0px', // Adjusted margin for better trigger points
                threshold: [0, 0.25, 0.5, 0.75, 1] // More threshold points for smoother transitions
            };
            
            // Make sure all items are visible
            stepItems.forEach(item => item.style.display = 'flex');
            scrollGifs.forEach(gif => gif.style.display = 'block');

            // On mobile, ensure all mobile captions are visible
            if (isMobile) {
                document.querySelectorAll('.mobile-caption').forEach(caption => {
                    caption.style.display = 'block';
                });
                // Set all GIFs as active for mobile view
                scrollGifs.forEach(gif => gif.classList.add('active'));
            } else {
                // Only use the intersection observer for desktop
                // Create intersection observer
                window.scrollObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const gif = entry.target;
                        const index = Array.from(scrollGifs).indexOf(gif);
                        
                        // Calculate visibility ratio
                        const ratio = entry.intersectionRatio;
                        
                        // Only activate if the element is more than 50% visible
                        if (ratio > 0.5 && entry.isIntersecting) {
                            // Deactivate all items first
                            scrollGifs.forEach(g => g.classList.remove('active'));
                            stepItems.forEach(step => step.classList.remove('active'));
                            
                            // Activate current items
                            gif.classList.add('active');
                            if (stepItems[index]) {
                                stepItems[index].classList.add('active');
                            }
                        }
                    });
                }, observerOptions);

                // Observe all GIFs
                scrollGifs.forEach(gif => window.scrollObserver.observe(gif));
            }

            // Add click handlers for step items
            stepItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    const targetGif = scrollGifs[index];
                    if (targetGif) {
                        targetGif.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                });
            });
            
            // Activate first items by default after a short delay
            setTimeout(() => {
                if (!isMobile && scrollGifs[0] && stepItems[0]) {
                    scrollGifs[0].classList.add('active');
                    stepItems[0].classList.add('active');
                }
                
                // Force a scroll event to check initial positions
                window.dispatchEvent(new Event('scroll'));
            }, 100);
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
        
        // Sticky plus button for mobile navigation
        $('.sticky-plus-btn').on('click', function(e) {
            e.stopPropagation();
            $('.nav-menu').toggleClass('active');
            $(this).toggleClass('active');
            
            // Change icon between plus and times
            if ($('.nav-menu').hasClass('active')) {
                $(this).html('<i class="fas fa-times"></i>');
            } else {
                $(this).html('<i class="fas fa-plus"></i>');
            }
        });
        
        // Close mobile menu when clicking anywhere else on the page
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.nav-menu, .mobile-menu-btn, .sticky-plus-btn').length) {
                $('.nav-menu').removeClass('active');
                $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
                $('.sticky-plus-btn').removeClass('active').html('<i class="fas fa-plus"></i>');
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
            $('.sticky-plus-btn').removeClass('active').html('<i class="fas fa-plus"></i>');
        });
        
        // Reinitialize on resize with debounce
        let resizeTimer;
        let previousIsMobile = window.innerWidth <= 768;
        
        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const currentIsMobile = window.innerWidth <= 768;
                
                // Only reinitialize if we're crossing the mobile breakpoint
                if (previousIsMobile !== currentIsMobile) {
                    setupScrollAnimations();
                    setupStickySidebar(); // Re-setup sticky sidebar on resize
                    previousIsMobile = currentIsMobile;
                }
                
                // Reset mobile menu state on resize
                if (window.innerWidth > 768) {
                    $('.nav-menu').removeClass('active');
                    $('.mobile-menu-btn').html('<i class="fas fa-bars"></i>');
                    $('.sticky-plus-btn').removeClass('active').html('<i class="fas fa-plus"></i>');
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