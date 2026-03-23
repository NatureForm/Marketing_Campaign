document.addEventListener('DOMContentLoaded', () => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyRGIjhD19pWfw40PHdWw8GHzgK8RCA8Ak5toNzuyZaOJuF1g-k5y-fhquszY3VT1EQ/exec';

    // User ID (persistent)
    let userId = localStorage.getItem('balconify_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('balconify_user_id', userId);
    }

    // Session ID management (session-based)
    let sessionId = sessionStorage.getItem('balconify_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('balconify_session_id', sessionId);
    }

    // System Detection Helpers
    const getOS = () => {
        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        if (/Android/i.test(ua)) return 'Android';
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Macintosh|Mac OS X/i.test(ua)) return 'MacOS';
        if (/Linux/i.test(ua)) return 'Linux';
        return 'Unknown';
    };

    const getBrowser = () => {
        const ua = navigator.userAgent;
        if (ua.indexOf("Edg") > -1) return "Edge";
        if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) return "Opera";
        if (ua.indexOf("Chrome") > -1) return "Chrome";
        if (ua.indexOf("Firefox") > -1) return "Firefox";
        if (ua.indexOf("Safari") > -1) return "Safari";
        return "Unknown";
    };

    // UTM persistence
    const urlParams = new URLSearchParams(window.location.search);
    const getUTM = (key) => {
        const fromUrl = urlParams.get(key);
        if (fromUrl) {
            sessionStorage.setItem('balconify_' + key, fromUrl);
            return fromUrl;
        }
        return sessionStorage.getItem('balconify_' + key) || (key === 'utm_source' ? 'direct' : '-');
    };

    const utms = {
        source: getUTM('utm_source'),
        medium: getUTM('utm_medium'),
        campaign: getUTM('utm_campaign')
    };

    // --- Analytics Tracking ---
    const trackMetric = (metric) => {
        const data = new FormData();
        data.append('action', 'track');
        data.append('user_id', userId);
        data.append('session_id', sessionId);
        data.append('metric', metric);

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        data.append('device_type', isMobile ? 'mobile' : 'desktop');
        data.append('os', getOS());
        data.append('browser', getBrowser());

        data.append('utm_source', utms.source);
        data.append('utm_medium', utms.medium);
        data.append('utm_campaign', utms.campaign);

        fetch(scriptURL, { method: 'POST', body: data, keepalive: true }).catch(e => console.error("Tracking error:", e));
    };

    if (!localStorage.getItem('balconify_visited')) {
        trackMetric('page_visit');
        localStorage.setItem('balconify_visited', 'true');
    }
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
        // Add class to body to prevent global text selection
        document.body.classList.add('sliding');
    };

    // Stop sliding on mouseup / touchend
    const stopSlide = () => {
        isSliding = false;
        document.body.classList.remove('sliding');
    };

    // Handle sliding movement
    let hasTrackedSlider = false;
    const moveSlide = (e) => {
        if (!isSliding) return;

        if (!hasTrackedSlider) {
            trackMetric('Used Slider');
            hasTrackedSlider = true;
        }

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

    // Prevent default drag and highlight behaviors on the container
    sliderContainer.addEventListener('mousedown', (e) => {
        // Only prevent default if it's the left mouse button, to avoid breaking context menus
        if (e.button === 0) e.preventDefault();
    });

    // Prevent image Ghost Dragging globally in the slider
    const sliderImages = sliderContainer.querySelectorAll('img');
    sliderImages.forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

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
        'eck': 'assets/eckmodul.png',
        'sitz': 'assets/IMG-20260308-WA0005.jpg',
        'liege': 'assets/After/back-rest-after2.png',
        'tisch': 'assets/After/balcony-integrated-table-after.png'
    };

    // Preload images to prevent loading delays when switching modules
    Object.values(imageMap).forEach(src => {
        const img = new Image();
        img.src = src;
    });

    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const moduleType = card.getAttribute('data-module');
            let metricName = 'Sitzmodul';
            if (moduleType === 'eck') metricName = 'Eckmodul';
            else if (moduleType === 'liege') metricName = 'Liegemodul';
            else if (moduleType === 'tisch') metricName = 'Tischmodul';
            trackMetric(metricName);

            // Remove active class from all
            moduleCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked
            card.classList.add('active');

            // Update preview image with a slight fade effect
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
    const configuratorCtaBtn = document.getElementById('configurator-cta-btn');
    const closeModalBtn = document.getElementById('modal-close');
    const waitlistForm = document.getElementById('waitlist-form');
    const waitlistSuccess = document.getElementById('modal-success');
    const waitlistEmail = document.getElementById('waitlist-email');
    const modalBodyForm = document.getElementById('modal-body-form');

    const navBtnAccount = document.getElementById('nav-btn-account');
    const navBtnGrid = document.getElementById('nav-btn-grid');
    const navBtnMenu = document.getElementById('nav-btn-menu');
    const footerLinkImpressum = document.getElementById('footer-link-impressum');
    const footerLinkDatenschutz = document.getElementById('footer-link-datenschutz');

    let currentWaitlistOrigin = 'unknown';

    // Open Modal Function
    const openModal = (source) => {
        currentWaitlistOrigin = source;
        console.log(`Analytics Event: [Intent] Waitlist Triggered from ${source}`);
        waitlistModal.classList.add('active');
    };

    if (navBtnAccount && waitlistModal) {
        navBtnAccount.addEventListener('click', () => { trackMetric('account'); openModal('account'); });
    }
    if (navBtnGrid && waitlistModal) {
        navBtnGrid.addEventListener('click', () => { trackMetric('checkout'); openModal('checkout'); });
    }
    if (navBtnMenu && waitlistModal) {
        navBtnMenu.addEventListener('click', () => { trackMetric('Sandwich'); openModal('Sandwich'); });
    }
    if (footerLinkImpressum) {
        footerLinkImpressum.addEventListener('click', () => { trackMetric('Impressum'); });
    }
    if (footerLinkDatenschutz) {
        footerLinkDatenschutz.addEventListener('click', () => { trackMetric('Datenschutz'); });
    }

    if (heroSubmitBtn && waitlistModal) {
        heroSubmitBtn.addEventListener('click', () => {
            trackMetric('button 1');
            openModal('button 1');
        });
    }

    if (openModalBtn && waitlistModal) {
        openModalBtn.addEventListener('click', () => {
            trackMetric('button 2');
            openModal('button 2');
        });
    }

    if (configuratorCtaBtn && waitlistModal) {
        configuratorCtaBtn.addEventListener('click', () => {
            trackMetric('button 3');
            openModal('button 3');
        });
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
            data.append('action', 'email');
            data.append('user_id', userId);
            data.append('session_id', sessionId);

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            data.append('device_type', isMobile ? 'mobile' : 'desktop');
            data.append('os', getOS());
            data.append('browser', getBrowser());
            data.append('origin', currentWaitlistOrigin);
            data.append('utm_source', utms.source);
            data.append('utm_medium', utms.medium);
            data.append('utm_campaign', utms.campaign);

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

    /* ==============================================
       Step Number Highlight on Scroll
       ============================================== */
    const steps = document.querySelectorAll('.config-step');

    if (steps.length > 0) {
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Highlight when the step is near the middle of the viewport
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else if (entry.boundingClientRect.top > window.innerHeight / 2) {
                    // Remove highlight only when scrolling back up
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' });

        steps.forEach(step => stepObserver.observe(step));
    }

});
