let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Initialize presentation
function initPresentation() {
    // Create slide indicators
    const indicatorsContainer = document.getElementById('slideIndicators');
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.onclick = () => goToSlide(i);
        indicatorsContainer.appendChild(indicator);
    }
    
    updateSlideDisplay();
}

// Update slide display
function updateSlideDisplay() {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show current slide
    slides[currentSlide].classList.add('active');
    
    // Update counter
    document.getElementById('slideCounter').textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentSlide === 0;
    document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
}

// Go to specific slide
function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateSlideDisplay();
    }
}

// Next slide
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlideDisplay();
    }
}

// Previous slide
function previousSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlideDisplay();
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    const container = document.getElementById('presentation');
    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            container.classList.add('fullscreen');
        }).catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen().then(() => {
            container.classList.remove('fullscreen');
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowRight':
        case ' ':
            event.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            previousSlide();
            break;
        case 'Home':
            event.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            event.preventDefault();
            goToSlide(totalSlides - 1);
            break;
        case 'Escape':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            previousSlide();
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initPresentation);

// Auto-hide controls after inactivity
let hideTimeout;
function resetHideTimeout() {
    clearTimeout(hideTimeout);
    document.querySelector('.navigation').style.opacity = '1';
    document.querySelector('.keyboard-hint').style.opacity = '1';
    
    hideTimeout = setTimeout(() => {
        document.querySelector('.navigation').style.opacity = '0.3';
        document.querySelector('.keyboard-hint').style.opacity = '0.3';
    }, 3000);
}

// Reset timeout on mouse movement
document.addEventListener('mousemove', resetHideTimeout);
document.addEventListener('keydown', resetHideTimeout);

// Initialize hide timeout
resetHideTimeout();
