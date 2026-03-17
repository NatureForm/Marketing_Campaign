document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       Before / After Slider Logic
       ============================================== */
    const sliderContainer = document.getElementById('ba-slider');
    const sliderBefore = document.getElementById('slider-before');
    const sliderHandle = document.getElementById('slider-handle');

    let isSliding = false;

    // Start sliding on mousedown / touchstart
    const startSlide = (e) => {
        isSliding = true;
    };

    // Stop sliding on mouseup / touchend
    const stopSlide = () => {
        isSliding = false;
    };

    // Handle sliding movement
    const moveSlide = (e) => {
        if (!isSliding) return;

        // Get x coordinate relative to container
        let moveX = e.clientX || (e.touches && e.touches[0].clientX);
        if (!moveX) return;

        let rect = sliderContainer.getBoundingClientRect();
        let x = moveX - rect.left;

        // Constrain x between 0 and width
        x = Math.max(0, Math.min(x, rect.width));

        // Calculate percentage
        let percentage = (x / rect.width) * 100;

        // Update elements
        sliderBefore.style.width = percentage + '%';
        sliderHandle.style.left = percentage + '%';
    };

    // Event listeners for slider handle and container
    sliderHandle.addEventListener('mousedown', startSlide);
    sliderHandle.addEventListener('touchstart', startSlide);

    window.addEventListener('mouseup', stopSlide);
    window.addEventListener('touchend', stopSlide);

    window.addEventListener('mousemove', moveSlide);
    window.addEventListener('touchmove', moveSlide);

    // Dynamic width for the before image to prevent skewing
    const beforeImg = document.querySelector('.slider-image-before img');
    const resizeImages = () => {
        if (!sliderContainer || !beforeImg) return;
        let rect = sliderContainer.getBoundingClientRect();
        beforeImg.style.width = rect.width + 'px';
    };
    window.addEventListener('resize', resizeImages);
    resizeImages(); // initial call

    /* ==============================================
       Configurator Mockup Logic
       ============================================== */
    const moduleCards = document.querySelectorAll('.module-card');
    const previewImg = document.querySelector('.preview-img');

    // These represent different states we could show depending on the module clicked
    // Reusing the provided Idea images for the mockup effect
    const imageMap = {
        'eck': 'assets/IMG-20260307-WA0002.jpg',
        'sitz': 'assets/IMG-20260307-WA0003.jpg',
        'liege': 'assets/IMG-20260308-WA0004.jpg',
        'pflanz': 'assets/IMG-20260308-WA0005.jpg'
    };

    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all
            moduleCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked
            card.classList.add('active');

            // Update preview image with a slight fade effect
            const moduleType = card.getAttribute('data-module');
            const newImageSrc = imageMap[moduleType] || imageMap['sitz'];

            if (previewImg.src !== newImageSrc) {
                previewImg.classList.add('fade');
                setTimeout(() => {
                    previewImg.src = newImageSrc;
                    previewImg.classList.remove('fade');
                }, 200);
            }
        });
    });

    /* ==============================================
       Newsletter Form Logic
       ============================================== */
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');
    const newsletterEmail = document.getElementById('newsletter-email');

    if (newsletterForm && newsletterSuccess && newsletterEmail) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            if (!newsletterEmail.value) return;

            // Simulate API request
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Wird gesendet...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Hide form, show success message
                newsletterForm.style.display = 'none';
                newsletterSuccess.style.display = 'block';
                newsletterEmail.value = '';
            }, 500);
        });
    }

});
