// This file contains JavaScript functionality for the birthday greeting web project.

document.addEventListener('DOMContentLoaded', function () {
    const imagePlaceholder = document.getElementById('image-placeholder');
    const changeImageButton = document.getElementById('change-image-button');

    if (changeImageButton) {
        changeImageButton.addEventListener('click', function () {
            const newImageUrl = prompt("Enter the URL of the new image:");
            if (newImageUrl) {
                imagePlaceholder.src = newImageUrl;
            }
        });
    }

    const button1 = document.getElementById('navigate-page1');
    const button2 = document.getElementById('navigate-page2');

    if (button1) {
        button1.addEventListener('click', function () {
            window.location.href = 'pages/page1.html';
        });
    }

    if (button2) {
        button2.addEventListener('click', function () {
            window.location.href = 'pages/page2.html';
        });
    }
});

// Smooth scroll function with custom easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smooth animation (ease-in-out)
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Smooth scroll to about section
function scrollToAbout() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const targetPosition = aboutSection.offsetTop;
        smoothScrollTo(targetPosition, 1200);
    }
}

// Smooth scroll to gallery section
function scrollToGallery() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const targetPosition = gallerySection.offsetTop;
        smoothScrollTo(targetPosition, 500);
    }
}

// Smooth scroll to top
function scrollToTop() {
    smoothScrollTo(0, 500);
}

// Hide/show scroll indicator and back to top based on scroll position
window.addEventListener('scroll', function () {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const backToTop = document.querySelector('.back-to-top');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Hide scroll indicator when scrolled down more than 50% of viewport
    if (scrollIndicator) {
        if (scrollPosition > windowHeight * 0.5) {
            scrollIndicator.style.display = 'none';
        } else {
            scrollIndicator.style.display = 'flex';
        }
    }

    // Show back to top button when scrolled down more than viewport height
    if (backToTop) {
        if (scrollPosition > windowHeight) {
            backToTop.style.display = 'flex';
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.display = 'none';
            backToTop.style.opacity = '0';
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    const backToTop = document.querySelector('.back-to-top');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Initially hide back to top button
    if (backToTop) {
        backToTop.style.display = 'none';
        backToTop.style.opacity = '0';
    }

    // Initially show scroll indicator
    if (scrollIndicator) {
        scrollIndicator.style.display = 'flex';
    }
});