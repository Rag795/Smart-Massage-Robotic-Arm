document.addEventListener('DOMContentLoaded', function() {
    // Find all TOC toggle buttons on the page
    const tocButtons = document.querySelectorAll('.toc-button');
    
    // Add event listeners to all TOC buttons
    tocButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent table-content div
            const parentToc = button.closest('.table-content');
            // Find the list element (either direct ul or with specific ID)
            const tocList = parentToc.querySelector('ul');
            
            // Toggle the visibility class
            tocList.classList.toggle('hidden');
            
            // Update button text
            if (tocList.classList.contains('hidden')) {
                button.textContent = 'Show';
            } else {
                button.textContent = 'Hide';
            }
        });
    });

    // Add smooth scrolling to all in-page links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the target's position
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                
                // Animation duration in milliseconds
                const duration = 800;
                let start = null;
                
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function for smoother animation
                    const easeInOutCubic = percentage < 0.5
                        ? 4 * percentage * percentage * percentage
                        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * easeInOutCubic);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        // Update URL hash after scrolling completes
                        history.pushState(null, null, targetId);
                    }
                }
                
                window.requestAnimationFrame(step);
            }
        });
    });

    // Video handling - check if videos exist and can play
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(videoElement => {
        // Try to load video and handle errors
        videoElement.addEventListener('error', () => handleVideoError(videoElement));
        
        // Also check if video source doesn't exist
        const videoSource = videoElement.querySelector('source');
        if (videoSource) {
            videoSource.addEventListener('error', () => handleVideoError(videoElement));
        } else {
            // No source element found
            handleVideoError(videoElement);
        }
        
        // Handle cases where the video file exists but can't be played
        videoElement.addEventListener('canplay', function() {
            // Video can play, ensure placeholder is hidden
            videoElement.parentElement.classList.remove('video-error');
        });
        
        // If video doesn't start loading within 3 seconds, show placeholder
        const videoLoadTimeout = setTimeout(function() {
            if (videoElement.readyState === 0) { // HAVE_NOTHING state
                handleVideoError(videoElement);
            }
        }, 3000);
        
        // Clear timeout if video starts loading
        videoElement.addEventListener('loadeddata', function() {
            clearTimeout(videoLoadTimeout);
        });
    });
    
    // Function to handle video loading errors
    function handleVideoError(videoElement) {
        const videoContainer = videoElement.closest('.video-container');
        if (videoContainer) {
            videoContainer.classList.add('video-error');
            console.log('Video could not be loaded. Showing placeholder.');
        }
    }

    // Add fade-in class to all major content elements
    const contentSections = document.querySelectorAll('.content > div > div, .content > div > h1.title, .table-content');
    contentSections.forEach((section, index) => {
        // Skip TOC as it's already visible
        if (!section.classList.contains('table-content') || section.querySelector('h1')) {
            section.classList.add('fade-in');
            
            // Add delay classes for staggered animation
            if (index % 3 === 1) section.classList.add('fade-delay-1');
            if (index % 3 === 2) section.classList.add('fade-delay-2');
        }
    });

    // Check elements on page load
    checkFadeElements();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkFadeElements);
    
    // Function to check which elements should be faded in
    function checkFadeElements() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport (with offset for earlier trigger)
            if (elementTop < windowHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    }
});