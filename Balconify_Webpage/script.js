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
       Waitlist Modal & Form Logic
       ============================================== */
    const waitlistModal = document.getElementById('waitlist-modal');
    const openModalBtn = document.getElementById('configurator-submit-btn');
    const heroSubmitBtn = document.getElementById('hero-submit-btn');
    const closeModalBtn = document.getElementById('modal-close');
    const waitlistForm = document.getElementById('waitlist-form');
    const waitlistSuccess = document.getElementById('modal-success');
    const waitlistEmail = document.getElementById('waitlist-email');
    const modalBodyForm = document.getElementById('modal-body-form');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxMzuQIk_NPRH-On8BDQv6qW_ZIyB67xVH-HvOey6ErRK1YZqModx5ngyCjNQ7yX2Qm/exec';

    // Open Modal Function
    const openModal = (source) => {
        console.log(`Analytics Event: [Intent] Waitlist Triggered from ${source}`);
        waitlistModal.classList.add('active');
    };

    if (openModalBtn && waitlistModal) {
        openModalBtn.addEventListener('click', () => openModal('Configurator'));
    }

    if (heroSubmitBtn && waitlistModal) {
        heroSubmitBtn.addEventListener('click', () => openModal('Hero Section'));
    }

    // Close Modal
    const closeModal = () => {
        waitlistModal.classList.remove('active');
        // Reset state after transition finishes to allow multiple uses without reloading
        setTimeout(() => {
            modalBodyForm.style.display = 'block';
            waitlistSuccess.style.display = 'none';
            waitlistForm.reset();
        }, 300);
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close Modal on outside click
    if (waitlistModal) {
        waitlistModal.addEventListener('click', (e) => {
            if (e.target === waitlistModal) {
                closeModal();
            }
        });
    }

    // Form Submission
    if (waitlistForm && waitlistSuccess && waitlistEmail && modalBodyForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation
            if (!waitlistEmail.value) return;

            const submitBtn = waitlistForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Wird gesendet...';
            submitBtn.disabled = true;

            const data = new FormData(waitlistForm);

            fetch(scriptURL, { method: 'POST', body: data })
                .then(response => {
                    console.log('Success!', response);
                    console.log("Analytics Event: [Conversion] Waitlist Email Submitted");
                    // Hide form area, show success area
                    modalBodyForm.style.display = 'none';
                    waitlistSuccess.style.display = 'block';

                    // Reset button state silently in background for next potential open
                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }, 500);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    alert("Es gab einen Fehler bei der Anmeldung. Bitte versuche es später noch einmal.");
                });
        });
    }

});
