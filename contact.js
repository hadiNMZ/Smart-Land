// Dedicated Contact sub-page: reads ?type=individual|organization,
// manages dual-tier switching, form validation/feedback, and curtain transitions.
(function () {
    const pageCurtain = document.getElementById('pageCurtain');
    const resetCurtain = (instant = true) => {
        if (!pageCurtain) return;
        if (instant) {
            pageCurtain.style.transition = 'none';
            pageCurtain.classList.remove('active');
            void pageCurtain.offsetHeight;
            pageCurtain.style.transition = '';
        } else {
            pageCurtain.classList.remove('active');
        }
    };
    resetCurtain(true);

    // Mobile Navigation Drawer Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Navbar scroll styling
    const navbarEl = document.getElementById('navbar');
    if (navbarEl) {
        const updateNavbar = () => {
            navbarEl.classList.toggle('scrolled', window.scrollY > 20);
        };
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    }

    // Contact Tier Activation
    const tabIndivBtn = document.getElementById('tabIndivBtn');
    const tabOrgBtn = document.getElementById('tabOrgBtn');
    const formIndividual = document.getElementById('individualForm');
    const formOrganization = document.getElementById('organizationForm');
    const navIndivLink = document.getElementById('navIndivLink');
    const navOrgLink = document.getElementById('navOrgLink');
    const ctBadge = document.getElementById('ctBadge');
    const ctTitle = document.getElementById('ctTitle');
    const ctSubtitle = document.getElementById('ctSubtitle');
    const ctFeedback = document.getElementById('ctFeedback');

    function showFeedback(message, isError = false) {
        if (!ctFeedback) return;
        ctFeedback.textContent = message;
        ctFeedback.className = 'ct-feedback show ' + (isError ? 'is-error' : 'is-success');
        ctFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearFeedback() {
        if (ctFeedback) {
            ctFeedback.className = 'ct-feedback';
            ctFeedback.textContent = '';
        }
    }

    function activateContactTab(type, updateUrl = false) {
        const isOrg = type === 'organization';
        clearFeedback();

        if (tabOrgBtn && tabIndivBtn) {
            tabOrgBtn.classList.toggle('active', isOrg);
            tabIndivBtn.classList.toggle('active', !isOrg);
        }
        if (formOrganization && formIndividual) {
            formOrganization.classList.toggle('active', isOrg);
            formIndividual.classList.toggle('active', !isOrg);
        }
        if (navOrgLink && navIndivLink) {
            navOrgLink.classList.toggle('active', isOrg);
            navIndivLink.classList.toggle('active', !isOrg);
        }

        if (isOrg) {
            document.title = 'تواصل كمؤسسة | Smart Land';
            if (ctBadge) ctBadge.textContent = 'للمؤسسات والشركات — For Organizations';
            if (ctTitle) ctTitle.textContent = 'تواصل كمؤسسة أو شركة';
            if (ctSubtitle) ctSubtitle.textContent = 'حلول برمجية متكاملة وتحول رقمي مصمم وفق احتياجات مؤسستك.';
        } else {
            document.title = 'تواصل كفرد | Smart Land';
            if (ctBadge) ctBadge.textContent = 'للأفراد والخبراء — For Individuals';
            if (ctTitle) ctTitle.textContent = 'تواصل كفرد أو مطوّر';
            if (ctSubtitle) ctSubtitle.textContent = 'استشارات واستفسارات تطويرية وتقنية مخصصة لمشاريعك وأفكارك.';
        }

        if (updateUrl && window.history && window.history.replaceState) {
            const nextUrl = `contact.html?type=${isOrg ? 'organization' : 'individual'}`;
            window.history.replaceState(null, '', nextUrl);
        }
    }

    const params = new URLSearchParams(window.location.search);
    const initialType = params.get('type') === 'organization' ? 'organization' : 'individual';
    activateContactTab(initialType, false);

    if (tabIndivBtn) tabIndivBtn.addEventListener('click', () => activateContactTab('individual', true));
    if (tabOrgBtn) tabOrgBtn.addEventListener('click', () => activateContactTab('organization', true));
    if (navIndivLink) {
        navIndivLink.addEventListener('click', (e) => {
            e.preventDefault();
            activateContactTab('individual', true);
        });
    }
    if (navOrgLink) {
        navOrgLink.addEventListener('click', (e) => {
            e.preventDefault();
            activateContactTab('organization', true);
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formIndividual) {
        formIndividual.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('indivName').value.trim();
            const email = document.getElementById('indivEmail').value.trim();
            const message = document.getElementById('indivMessage').value.trim();

            if (!name || !email || !message) {
                showFeedback('يرجى ملء جميع الحقول المطلوبة قبل الإرسال.', true);
                return;
            }
            if (!emailRegex.test(email)) {
                showFeedback('يرجى إدخال عنوان بريد إلكتروني صحيح.', true);
                return;
            }
            showFeedback(`شكراً لتواصلك الفردي يا ${name}! تم استلام استفسارك وسيتواصل معك فريق Smart Land قريباً.`, false);
            formIndividual.reset();
        });
    }

    if (formOrganization) {
        formOrganization.addEventListener('submit', (e) => {
            e.preventDefault();
            const orgName = document.getElementById('orgName').value.trim();
            const workEmail = document.getElementById('orgWorkEmail').value.trim();
            const contactPerson = document.getElementById('orgContactPerson').value.trim();
            const orgMessage = document.getElementById('orgMessage').value.trim();

            if (!orgName || !workEmail || !contactPerson || !orgMessage) {
                showFeedback('يرجى ملء جميع بيانات المؤسسة المطلوبة قبل الإرسال.', true);
                return;
            }
            if (!emailRegex.test(workEmail)) {
                showFeedback('يرجى إدخال عنوان بريد إلكتروني رسمي صحيح.', true);
                return;
            }
            showFeedback(`تم استلام طلب مشروع مؤسسة "${orgName}" بنجاح! سيتواصل مسؤول العلاقات التقنية في Smart Land مع ${contactPerson} قريباً.`, false);
            formOrganization.reset();
        });
    }

    // Same-tab transition links
    document.querySelectorAll('.transition-link').forEach(link => {
        link.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            const targetUrl = this.getAttribute('href');
            if (pageCurtain) {
                pageCurtain.classList.add('active');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            } else {
                window.location.href = targetUrl;
            }
        });
    });

    window.addEventListener('pageshow', () => resetCurtain(true));
    window.addEventListener('pagehide', () => resetCurtain(true));

    // Custom Circular Scroll Progress Cursor (Fine pointer desktop only)
    const isTouchPrimary = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouchPrimary) {
        const oldC = document.getElementById('customCursor');
        if (oldC) oldC.remove();
    } else {
        const circumference = 2 * Math.PI * 14;
        let mouseX = -100, mouseY = -100;
        let cursorX = -100, cursorY = -100;
        let isVisible = false;

        function getCursor() {
            let c = document.getElementById('customCursor');
            if (!c || !document.contains(c)) {
                c = document.createElement('div');
                c.className = 'custom-cursor' + (isVisible ? ' is-active' : '');
                c.id = 'customCursor';
                c.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34">
                    <circle class="cursor-track" cx="17" cy="17" r="14" />
                    <circle class="cursor-progress" id="cursorProgress" cx="17" cy="17" r="14" />
                    <circle class="cursor-dot" cx="17" cy="17" r="2.5" />
                </svg>`;
                document.body.appendChild(c);
                const p = c.querySelector('#cursorProgress');
                if (p) {
                    p.style.strokeDasharray = `${circumference}`;
                    p.style.strokeDashoffset = `${circumference}`;
                }
            }
            return c;
        }

        getCursor();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            const c = getCursor();
            if (!isVisible && c) {
                c.classList.add('is-active');
                cursorX = mouseX;
                cursorY = mouseY;
                isVisible = true;
            }
        });

        window.addEventListener('mouseleave', () => {
            const c = getCursor();
            if (c) c.classList.remove('is-active');
            isVisible = false;
        });

        function updateCursorPosition() {
            const c = getCursor();
            if (c && isVisible) {
                cursorX += (mouseX - cursorX) * 0.28;
                cursorY += (mouseY - cursorY) * 0.28;
                c.style.left = `${cursorX}px`;
                c.style.top = `${cursorY}px`;
            }
            requestAnimationFrame(updateCursorPosition);
        }
        updateCursorPosition();

        function updateScrollProgress() {
            const c = getCursor();
            const progressCircle = c ? c.querySelector('#cursorProgress') : null;
            if (!progressCircle) return;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            progressCircle.style.strokeDashoffset = circumference - (progress * circumference);
        }

        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();

        const isInteractive = (target) => target && target.closest('a, button, input, textarea, select, label, .contact-tab-btn');
        document.addEventListener('mouseover', (e) => {
            const c = getCursor();
            if (c && isInteractive(e.target)) c.classList.add('cursor-hover');
        });
        document.addEventListener('mouseout', (e) => {
            const c = getCursor();
            if (c && isInteractive(e.target)) c.classList.remove('cursor-hover');
        });
    }
})();

