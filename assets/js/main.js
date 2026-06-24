document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Sticky Header & Active Link Tracking
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Tracker
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // 2. Mobile Responsive Menu
    // ----------------------------------------------------
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // ----------------------------------------------------
    // 3. Stats Counter Animation (IntersectionObserver)
    // ----------------------------------------------------
    const statsSection = document.querySelector('.stats-strip');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let currentCount = 0;
            
            const timer = setInterval(() => {
                currentCount += Math.ceil(target / (duration / stepTime));
                if (currentCount >= target) {
                    stat.textContent = target + (stat.getAttribute('data-suffix') || '');
                    clearInterval(timer);
                } else {
                    stat.textContent = currentCount + (stat.getAttribute('data-suffix') || '');
                }
            }, stepTime);
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    startCounters();
                    countersStarted = true;
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ----------------------------------------------------
    // 4. Initiatives Detail Modals
    // ----------------------------------------------------
    const initiativeModal = document.getElementById('initiative-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const learnMoreLinks = document.querySelectorAll('.learn-more-link');

    // Initiatives Data mapping
    const initiativesData = {
        health: {
            title: "Health Camps & Diagnostics",
            content: `
                <p>Zuberi Welfare Society organizes regular, free medical health checkup camps in Aligarh's underprivileged neighborhoods, serving thousands who lack access to quality healthcare.</p>
                <p><strong>Our Services Include:</strong></p>
                <ul>
                    <li>General physician consultations and health checkups</li>
                    <li>Distribution of essential prescribed medicines at zero cost</li>
                    <li>Specialist diagnostics (eye examinations, dental clinics, sugar/blood pressure monitoring)</li>
                    <li>Free distribution of corrective spectacles after diagnostic screening</li>
                    <li>Hygiene, sanitation, and nutritional awareness programs for mothers and children</li>
                </ul>
                <p>We work in collaboration with doctors from Jawaharlal Nehru Medical College (JNMC), AMU, and other local hospitals to bring expert medical care directly to the slums.</p>
            `
        },
        education: {
            title: "Education Support Program",
            content: `
                <p>We believe that education is the ultimate tool to break the cycle of generational poverty. Our initiatives aim to increase school enrollment and provide academic support to students.</p>
                <p><strong>Key Activities:</strong></p>
                <ul>
                    <li><strong>Free Remedial Coaching Centers:</strong> Providing after-school tutoring in science, mathematics, and languages.</li>
                    <li><strong>Resource Distribution:</strong> Free schoolbags, notebooks, stationery, and uniforms for underprivileged children.</li>
                    <li><strong>Scholarships:</strong> Financial support to cover school and college admission fees for bright, needy students.</li>
                    <li><strong>Adult Literacy Drives:</strong> Basic reading and writing classes for adults, especially women.</li>
                </ul>
            `
        },
        empowerment: {
            title: "Women Empowerment Centers",
            content: `
                <p>Empowering a woman transforms an entire family. Our centers aim to equip women from low-income households in Aligarh with vocational skills and financial independence.</p>
                <p><strong>Our Programs:</strong></p>
                <ul>
                    <li><strong>Tailoring & Sewing Training:</strong> A 6-month certification course enabling women to start home-based tailoring businesses or gain employment.</li>
                    <li><strong>Computer Literacy Classes:</strong> Basic IT and data entry training for teenage girls.</li>
                    <li><strong>Self-Help Groups (SHGs):</strong> Supporting financial literacy, small savings, and mutual support groups.</li>
                    <li><strong>Rights & Safety Workshops:</strong> Spreading awareness about basic legal rights, maternal health, and domestic protection laws.</li>
                </ul>
            `
        },
        welfare: {
            title: "Community Welfare & Relief",
            content: `
                <p>Our community welfare efforts focus on improving daily living conditions, ensuring security, and bringing infrastructural support to local slums.</p>
                <p><strong>Ongoing Projects:</strong></p>
                <ul>
                    <li>Clean drinking water installation (handpumps and filters in public areas).</li>
                    <li>Sanitation campaigns, constructing community toilet facilities, and garbage disposal drives.</li>
                    <li>Street-lighting advocacy and organizing community welfare committees.</li>
                    <li>Advocacy support to help residents access government welfare cards, pension schemes, and identification papers.</li>
                </ul>
            `
        },
        relief: {
            title: "Relief & Aid Drives",
            content: `
                <p>In times of seasonal crisis or emergencies, Zuberi Welfare Society steps forward with active distributions to protect vulnerable families.</p>
                <p><strong>Key Relief Programs:</strong></p>
                <ul>
                    <li><strong>Winter Blanket Drives:</strong> Distributing hundreds of high-quality warm blankets to homeless and slum residents during Aligarh's severe winters.</li>
                    <li><strong>Dry Ration Kit Distributions:</strong> Providing monthly kits (wheat, rice, oil, pulses, sugar) to widows and elderly citizens.</li>
                    <li><strong>Emergency Support:</strong> Rebuilding support and food distribution during flooding or sudden local economic disruptions.</li>
                </ul>
            `
        },
        environment: {
            title: "Environmental Awareness",
            content: `
                <p>Creating a cleaner, greener community is essential for public health and children's futures. We engage the youth in taking responsibility for local environments.</p>
                <p><strong>Green Initiatives:</strong></p>
                <ul>
                    <li><strong>Tree Plantation Drives:</strong> Planting native shade-giving and fruit trees in community lanes and school compounds.</li>
                    <li><strong>Waste Management Workshops:</strong> Educating households on separating dry and wet waste.</li>
                    <li><strong>Anti-Plastic Campaigns:</strong> Distributing reusable cloth bags and discouraging single-use plastic in neighborhood shops.</li>
                    <li><strong>Water Conservation Projects:</strong> Raising awareness about harvesting rainwater and minimizing tap water waste.</li>
                </ul>
            `
        }
    };

    learnMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const key = link.getAttribute('data-initiative');
            if (initiativesData[key]) {
                modalTitle.textContent = initiativesData[key].title;
                modalBody.innerHTML = initiativesData[key].content;
                initiativeModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scrolling
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            initiativeModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close modal by clicking outside
    initiativeModal.addEventListener('click', (e) => {
        if (e.target === initiativeModal) {
            initiativeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ----------------------------------------------------
    // 5. Image Lightbox for Gallery
    // ----------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let activeGalleryIndex = 0;
    const galleryImages = [];

    // Extract gallery image details
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h4').textContent;
        const tag = item.querySelector('p').textContent;
        galleryImages.push({
            src: img.getAttribute('src'),
            caption: `${title} - ${tag}`
        });

        item.addEventListener('click', () => {
            activeGalleryIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        const item = galleryImages[activeGalleryIndex];
        lightboxImg.setAttribute('src', item.src);
        lightboxCaption.textContent = item.caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const nextImage = () => {
        activeGalleryIndex = (activeGalleryIndex + 1) % galleryImages.length;
        openLightbox();
    };

    const prevImage = () => {
        activeGalleryIndex = (activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox();
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
        if (initiativeModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                initiativeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ----------------------------------------------------
    // 6. Contact Form & Newsletter Handler with Toast Notifications
    // ----------------------------------------------------
    const contactForm = document.getElementById('ngo-contact-form');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    const showToast = (message) => {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) {
                showToast("Please fill in all required fields.");
                return;
            }

            // Simulate server request
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast(`Thank you, ${name}! Your message has been sent successfully. We will contact you soon.`);
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    // Newsletter Submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('.newsletter-input');
            const email = input.value.trim();

            if (!email) return;

            const btn = form.querySelector('button');
            btn.disabled = true;

            setTimeout(() => {
                showToast("Thank you for subscribing to our newsletter!");
                input.value = '';
                btn.disabled = false;
            }, 1000);
        });
    });

    // ----------------------------------------------------
    // 7. Event & Volunteer Modals Setup
    // ----------------------------------------------------
    const eventRegButtons = document.querySelectorAll('.event-register-btn');
    eventRegButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const eventName = btn.getAttribute('data-event');
            showToast(`Registration request for "${eventName}" received! We will send details to your email.`);
        });
    });

    const volunteerButtons = document.querySelectorAll('.volunteer-cta-btn');
    volunteerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Scroll to contact form and pre-fill interest select field
            const contactSection = document.getElementById('contact');
            const selectInterest = document.getElementById('contact-interest');
            
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                if (selectInterest) {
                    selectInterest.value = 'Volunteer';
                }
            }
        });
    });
});
