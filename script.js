document.addEventListener('DOMContentLoaded', () => {

    // 1. Smooth Scrolling with Offset for Internal Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navOffset = 70;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Navigation Active State on Scroll
    const trackedSections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 140;
        trackedSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // 3. Typewriter Animation Engine
    function typeText(element, text, speed = 25) {
        element.textContent = '';
        let charIndex = 0;

        function addChar() {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(addChar, speed);
            } else {
                element.classList.add('typing-done');
            }
        }
        addChar();
    }

    // 4. Scroll Reveal & Typewriter Trigger
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Trigger typewriter for Antigravity card
                const typewriterEl = entry.target.querySelector('.ag-typewriter');
                if (typewriterEl && !typewriterEl.dataset.hasTyped) {
                    typewriterEl.dataset.hasTyped = "true";
                    const fullText = typewriterEl.getAttribute('data-text') || '';
                    setTimeout(() => {
                        typeText(typewriterEl, fullText);
                    }, 280);
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // 5. Lagged "Watch Case" Badge with Hidden Native Cursor & Lerp Delay
    const watchCasePlayer = document.getElementById('watchCasePlayer');
    const watchCaseBadge = document.getElementById('watchCaseBadge');
    const promoVideo = document.getElementById('promoVideo');

    if (watchCasePlayer && watchCaseBadge && promoVideo) {
        let mouseX = 0, mouseY = 0;
        let badgeX = 0, badgeY = 0;
        let isHovered = false;

        watchCasePlayer.addEventListener('mouseenter', (e) => {
            isHovered = true;
            const rect = watchCasePlayer.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
            badgeX = mouseX;
            badgeY = mouseY;
        });

        watchCasePlayer.addEventListener('mousemove', (e) => {
            const rect = watchCasePlayer.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        watchCasePlayer.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // Linear interpolation loop to create subtle float/delay
        function animateBadge() {
            if (isHovered) {
                // 0.15 factor gives an elastic drag lag effect
                badgeX += (mouseX - badgeX) * 0.15;
                badgeY += (mouseY - badgeY) * 0.15;

                watchCaseBadge.style.left = `${badgeX}px`;
                watchCaseBadge.style.top = `${badgeY}px`;
            }
            requestAnimationFrame(animateBadge);
        }
        animateBadge();

        // Toggle playback on click
        watchCasePlayer.addEventListener('click', (e) => {
            if (e.target.closest('.case-link')) return;

            if (promoVideo.paused) {
                promoVideo.play();
                watchCaseBadge.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    <span>Pause case</span>
                `;
            } else {
                promoVideo.pause();
                watchCaseBadge.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    <span>Watch case</span>
                `;
            }
        });
    }

    // 6. Codrops Particle Effects for Buttons
    function createParticleBurst(button) {
        const canvas = document.createElement('canvas');
        canvas.classList.add('particle-canvas');

        const rect = button.getBoundingClientRect();
        const width = (canvas.width = rect.width * 2.5);
        const height = (canvas.height = rect.height * 3.5);

        button.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const particles = [];
        const particleCount = 36;
        const colors = ['#00d2ff', '#3a7bd5', '#ffffff', '#9d4edd'];

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            particles.push({
                x: width / 2,
                y: height / 2,
                radius: Math.random() * 3 + 1.5,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                alpha: 1,
                decay: Math.random() * 0.025 + 0.015
            });
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            let activeParticles = 0;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.alpha > 0) {
                    activeParticles++;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.08;
                    p.alpha -= p.decay;

                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.alpha);
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color;
                    ctx.fill();
                    ctx.restore();
                }
            }

            if (activeParticles > 0) {
                requestAnimationFrame(render);
            } else {
                canvas.remove();
            }
        }

        render();
    }

    document.querySelectorAll('.particle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            createParticleBurst(this);
        });
    });

    // 7. Codrops-Style Page Transition Overlay for External Tab Links
    const pageCurtain = document.getElementById('pageCurtain');
    document.querySelectorAll('.transition-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetUrl = this.getAttribute('href');

            if (pageCurtain) {
                pageCurtain.classList.add('active');

                // Open in new tab after the curtain animation completes
                setTimeout(() => {
                    window.open(targetUrl, '_blank', 'noopener,noreferrer');
                    // Reset curtain overlay
                    setTimeout(() => {
                        pageCurtain.classList.remove('active');
                    }, 400);
                }, 450);
            } else {
                window.open(targetUrl, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // 8. Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !message) {
                alert('يرجى ملء جميع الحقول المطلوبة قبل الإرسال.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('يرجى إدخال عنوان بريد إلكتروني صحيح.');
                return;
            }

            setTimeout(() => {
                alert(`شكراً لتواصلك معنا يا ${name}! تم استلام رسالتك وسيتواصل معك فريق Smart Land قريباً.`);
                contactForm.reset();
            }, 300);
        });
    }

    // 9. Google Antigravity Particle Engine (Hero Section Background)
    function initAntigravityHeroParticles() {
        const canvas = document.getElementById('bgParticles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const heroSection = canvas.parentElement;

        let width = (canvas.width = heroSection.offsetWidth);
        let height = (canvas.height = heroSection.offsetHeight);

        const particles = [];
        const spacing = 26; // Grid density
        const mouse = { x: -2000, y: -2000, radius: 150 };
        let time = 0;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroSection.addEventListener('mouseleave', () => {
            mouse.x = -2000;
            mouse.y = -2000;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
            createGrid();
        });

        class AntigravityParticle {
            constructor(originX, originY) {
                this.originX = originX;
                this.originY = originY;
                this.x = originX;
                this.y = originY;
                this.vx = 0;
                this.vy = 0;
                this.radius = Math.random() * 1.6 + 0.9;
                this.color = Math.random() > 0.35 ? '#00d2ff' : '#7189ff';
                this.baseAlpha = Math.random() * 0.4 + 0.25;

                this.phaseX = Math.random() * Math.PI * 2;
                this.phaseY = Math.random() * Math.PI * 2;
                this.waveSpeed = Math.random() * 0.015 + 0.008;
                this.waveAmp = Math.random() * 6 + 4;
            }

            update() {
                const idleOffsetX = Math.sin(time * this.waveSpeed + this.phaseX) * this.waveAmp;
                const idleOffsetY = Math.cos(time * this.waveSpeed + this.phaseY) * (this.waveAmp * 0.8);

                const currentTargetX = this.originX + idleOffsetX;
                const currentTargetY = this.originY + idleOffsetY;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const pushStrength = force * 7.5;

                    this.vx -= Math.cos(angle) * pushStrength;
                    this.vy -= Math.sin(angle) * pushStrength;
                }

                const returnDx = currentTargetX - this.x;
                const returnDy = currentTargetY - this.y;
                this.vx += returnDx * 0.045;
                this.vy += returnDy * 0.045;

                this.vx *= 0.88;
                this.vy *= 0.88;

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.baseAlpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function createGrid() {
            particles.length = 0;
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    particles.push(new AntigravityParticle(x, y));
                }
            }
        }

        createGrid();

        function animate() {
            time += 1;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }

        animate();
    }

    initAntigravityHeroParticles();

    // 10. Custom Circular Scroll Progress Cursor (Self-healing & Top-Layer resilient)
    const circumference = 2 * Math.PI * 14;
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;
    let isVisible = false;

    function getCursor() {
        let c = document.getElementById('customCursor');
        if (!c || !document.contains(c)) {
            let old = document.getElementById('customCursor');
            if (old) old.remove();

            c = document.createElement('div');
            c.className = 'custom-cursor' + (isVisible ? ' is-active' : '');
            c.id = 'customCursor';
            c.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34">
                <circle class="cursor-track" cx="17" cy="17" r="14" />
                <circle class="cursor-progress" id="cursorProgress" cx="17" cy="17" r="14" />
                <circle class="cursor-dot" cx="17" cy="17" r="2.5" />
            </svg>`;
            const openDialog = document.querySelector('dialog[open]');
            const parent = openDialog || document.body;
            parent.appendChild(c);

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

        const offset = circumference - (progress * circumference);
        progressCircle.style.strokeDashoffset = offset;
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    const isInteractive = (target) => target && target.closest('a, button, input, textarea, select, label, summary, [role="button"], .particle-btn, .ag-card, .btn-explore, .transition-link');

    document.addEventListener('mouseover', (e) => {
        const c = getCursor();
        if (c && isInteractive(e.target)) {
            c.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const c = getCursor();
        if (c && isInteractive(e.target)) {
            c.classList.remove('cursor-hover');
        }
    });

    const watchCase = document.getElementById('watchCasePlayer');
    if (watchCase) {
        watchCase.addEventListener('mouseenter', () => document.body.classList.add('inside-video'));
        watchCase.addEventListener('mouseleave', () => document.body.classList.remove('inside-video'));
    }

    // Top Layer Dialog Cursor Handler: Keeps custom cursor on top of native <dialog> modals
    if (typeof HTMLDialogElement !== 'undefined') {
        const origShowModal = HTMLDialogElement.prototype.showModal;
        if (origShowModal && !HTMLDialogElement.prototype._cursorPatched) {
            HTMLDialogElement.prototype._cursorPatched = true;
            HTMLDialogElement.prototype.showModal = function () {
                origShowModal.apply(this, arguments);
                const c = getCursor();
                if (c) this.appendChild(c);
            };
            const origClose = HTMLDialogElement.prototype.close;
            HTMLDialogElement.prototype.close = function () {
                origClose.apply(this, arguments);
                const c = getCursor();
                if (c && c.parentElement !== document.body) {
                    document.body.appendChild(c);
                }
            };
        }
        document.addEventListener('close', () => {
            const c = getCursor();
            if (c && c.parentElement !== document.body) {
                document.body.appendChild(c);
            }
        }, true);
    }
});

// ===================================================
// Particle Morph Section ("For developers" / "For organizations")
// 3D particles that morph into { } braces / orbs on hover.
// Markup: <section class="try-solutions-section"> placed right after the video section.
// ===================================================
function initParticleMorphSections() {
    const sections = document.querySelectorAll('.try-solutions-section .solution-section');
    if (!sections.length) return;

    const IDLE = [168, 171, 178], BLUE = [52, 107, 241], RED = [255, 70, 65];
    const RED_SHARE = 0.03;   // fraction of particles that are red
    const N_IDLE = 1900, N_SHAPE = 1150, N_SPAWN = 70, FOCAL = 900;
    const FLICKER = 0.35;     // 0 = smooth glow, 1 = strong flicker
    const FIT = 0.6;          // how much of the container the shape may fill (0-1)
    const GLOW = 0.16;        // overall glow strength
    const rand = (a, b) => a + Math.random() * (b - a);
    const lerp = (a, b, t) => a + (b - a) * t;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Soft radial sprites used as a faint halo around each particle.
    function makeGlow(rgb) {
        const c = document.createElement('canvas');
        c.width = c.height = 32;
        const g = c.getContext('2d');
        const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
        gr.addColorStop(0, `rgba(${rgb},1)`);
        gr.addColorStop(0.35, `rgba(${rgb},.35)`);
        gr.addColorStop(1, `rgba(${rgb},0)`);
        g.fillStyle = gr;
        g.fillRect(0, 0, 32, 32);
        return c;
    }
    const GLOW_GREY = makeGlow('200,205,215'), GLOW_BLUE = makeGlow('90,140,255'), GLOW_RED = makeGlow('255,90,80');

    // Targets are centered 3D points [x, y, z].
    function braceTargets(w, h, count, text = '{ }', sx = 1.9, weight = 300, fs = 1.05) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const g = c.getContext('2d'), s = Math.min(w, h) * 0.8;
        g.strokeStyle = '#fff'; g.lineWidth = 5; g.translate(w / 2, h / 2);
        g.font = `${weight} ${s * fs}px "Inter", Arial, sans-serif`;
        g.textAlign = 'center'; g.textBaseline = 'middle';
        g.save(); g.scale(sx, 1); g.strokeText(text, 0, s * 0.03); g.restore();
        const d = g.getImageData(0, 0, w, h).data, px = [], depth = s * 0.09;
        for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2)
            if (d[(y * w + x) * 4 + 3] > 128) px.push([x - w / 2, y - h / 2]);
        // Centre the glyph and scale it to fit the container with a margin.
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
        for (const p of px) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
        const k = Math.min(w * FIT / Math.max(1, x1 - x0), h * FIT / Math.max(1, y1 - y0)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        return Array.from({ length: count }, () => {
            const p = px[(Math.random() * px.length) | 0] || [0, 0];
            return [(p[0] - mx) * k, (p[1] - my) * k, rand(-depth, depth) * k];
        });
    }
    const hashTargets = (w, h, count) => braceTargets(w, h, count, '#', 1, 600, 1.1);

    function orbTargets(w, h, count) {   // kept for reference; the 'orbs' shape currently uses hashTargets
        const s = Math.min(w, h) * 0.8, R = s * 0.34, r = s * 0.19, per = Math.floor(count / 6), out = [];
        for (let i = 0; i < 6; i++) {
            const a = i / 6 * Math.PI * 2 - Math.PI / 2, cx = Math.cos(a) * R, cy = Math.sin(a) * R;
            for (let j = 0; j < per; j++) {
                const u = rand(-1, 1), t = rand(0, 6.283), q = Math.sqrt(1 - u * u);
                out.push([cx + r * q * Math.cos(t), cy + r * q * Math.sin(t), r * u]);
            }
        }
        return out;
    }

    class Field {
        constructor(el) {
            this.el = el;
            this.kind = el.dataset.shape;
            this.cv = el.querySelector('canvas');
            this.ctx = this.cv.getContext('2d');
            this.hover = false; this.visible = false;
            this.mix = 0; this.mx = 0; this.my = 0; this.tx = 0; this.ty = 0;
            el.addEventListener('pointerenter', () => { this.hover = true; });
            el.addEventListener('pointerleave', () => { this.hover = false; this.tx = this.ty = 0; });
            el.addEventListener('pointermove', e => {
                const r = el.getBoundingClientRect();
                this.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
                this.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
            });
            // Ignore sub-pixel changes so the canvas can never feed back into layout.
            new ResizeObserver(() => {
                const r = el.getBoundingClientRect();
                if (Math.abs(r.width - this.w) < 2 && Math.abs(r.height - this.h) < 2) return;
                this.resize();
            }).observe(el);
            // Only animate while the section is on screen.
            new IntersectionObserver(entries => {
                this.visible = entries[0].isIntersecting;
            }, { threshold: 0 }).observe(el);
            this.resize();
        }
        resize() {
            const r = this.el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
            if (r.width < 2 || r.height < 2) return;
            this.w = r.width; this.h = r.height;
            this.cv.width = this.w * dpr; this.cv.height = this.h * dpr;
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const W = Math.round(this.w), H = Math.round(this.h);
            this.targets = (this.kind === 'braces' ? braceTargets : hashTargets)(W, H, N_SHAPE);
            this.p = Array.from({ length: N_IDLE }, (_, i) => {
                const hx = rand(-this.w / 2, this.w / 2), hy = rand(-this.h / 2, this.h / 2), hz = rand(-300, 300);
                return {
                    hx, hy, hz, x: hx, y: hy, z: hz, ph: rand(0, 6.28), amp: rand(3, 9), sp: rand(0.2, 0.5),
                    sz: rand(0.7, 1.5), ease: rand(0.025, 0.07), t: i < N_SHAPE ? this.targets[i] : null, k: 0,
                    red: Math.random() < RED_SHARE
                };
            });
            this.spawn = Array.from({ length: N_SPAWN }, () => this.newSpawn(true));
        }
        newSpawn(initial) {
            const t = this.targets[(Math.random() * this.targets.length) | 0] || [0, 0, 0], d = rand(40, 110);
            const a = rand(0, 6.28), b = rand(-1, 1);
            return { t, o: [Math.cos(a) * d, Math.sin(a) * d, b * d], life: initial ? rand(0, 1) : 0, dur: rand(1.4, 2.6), ph: rand(0, 6.28), sp: rand(0.2, 0.5) };
        }
        // Slow pulse x fast irregular flicker.
        flicker(time, p) {
            const slow = 0.55 + 0.45 * Math.sin(time * p.sp * 3 + p.ph * 2);
            const fast = 0.5 + 0.5 * Math.sin(time * (9 + p.sp * 14) + p.ph * 5) * Math.sin(time * (5 + p.sp * 9) + p.ph * 1.7);
            return slow * (1 - FLICKER + FLICKER * fast * 1.6);
        }
        // Rotate around Y then X.
        rot(v, cy, sy, cx, sx) {
            const x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy;
            return [x, v[1] * cx - z * sx, v[1] * sx + z * cx];
        }
        draw(ctx, x, y, z, size, k, alpha, tw, red) {
            const sc = FOCAL / (FOCAL + z);
            if (sc <= 0) return;
            const depth = Math.min(1, Math.max(0, sc * 1.1 - 0.35));   // far = dim, near = bright
            ctx.globalAlpha = alpha * lerp(0.25, 1, depth) * Math.min(1, 0.72 + 0.45 * tw);
            if (red) {   // red particles keep their colour in both idle and shape states
                const s2 = size * sc * (1.2 + 0.5 * k), px2 = this.w / 2 + x * sc, py2 = this.h / 2 + y * sc, g2 = s2 * 7;
                ctx.fillStyle = `rgb(${RED})`;
                ctx.fillRect(px2 - s2 / 2, py2 - s2 / 2, s2, s2);
                ctx.globalAlpha = alpha * lerp(0.25, 1, depth) * GLOW * tw * 1.8;
                ctx.drawImage(GLOW_RED, px2 - g2 / 2, py2 - g2 / 2, g2, g2);
                return;
            }
            ctx.fillStyle = `rgb(${lerp(IDLE[0], BLUE[0] + 40 * depth * k, k) | 0},${lerp(IDLE[1], BLUE[1] + 40 * depth * k, k) | 0},${lerp(IDLE[2], BLUE[2], k) | 0})`;
            const s = size * sc * (1 + 0.6 * k);
            const px = this.w / 2 + x * sc, py = this.h / 2 + y * sc;
            ctx.fillRect(px - s / 2, py - s / 2, s, s);
            // Dim, twinkling halo
            const gs = s * 7, ga = alpha * lerp(0.25, 1, depth) * GLOW * tw;
            if (k < 0.98) { ctx.globalAlpha = ga * (1 - k); ctx.drawImage(GLOW_GREY, px - gs / 2, py - gs / 2, gs, gs); }
            if (k > 0.02) { ctx.globalAlpha = ga * k * 1.6; ctx.drawImage(GLOW_BLUE, px - gs / 2, py - gs / 2, gs, gs); }
        }
        frame(time, dt) {
            if (!this.p) return;
            const { ctx, w, h } = this;
            this.mix += ((this.hover ? 1 : 0) - this.mix) * Math.min(1, dt * 3);
            this.mx += (this.tx - this.mx) * 0.06; this.my += (this.ty - this.my) * 0.06;
            // Shape orientation: slow sway plus cursor tilt.
            const ay = Math.sin(time * 0.6) * 0.55 + this.mx * 0.5, ax = -0.12 + this.my * 0.35;
            const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';   // additive: overlapping light brightens
            const items = [];
            for (const p of this.p) {
                const tt = time * p.sp + p.ph;
                let gx = p.hx + Math.sin(tt) * p.amp, gy = p.hy + Math.cos(tt * 1.3) * p.amp, gz = p.hz + Math.sin(tt * 0.7) * p.amp, want = 0;
                if (p.t && this.hover) {
                    const r = this.rot(p.t, cy, sy, cx, sx);
                    gx = r[0] + Math.sin(tt * 3) * 0.8; gy = r[1] + Math.cos(tt * 3) * 0.8; gz = r[2]; want = 1;
                }
                const e = reduced ? 1 : p.ease;
                p.x += (gx - p.x) * e; p.y += (gy - p.y) * e; p.z += (gz - p.z) * e; p.k += (want - p.k) * 0.06;
                items.push([p.z, p.x, p.y, p.sz, p.k, lerp(0.6, 0.95, p.k), this.flicker(time, p), p.red]);
            }
            // Fade-in particles land on the surface only, so volume stays the same.
            if (this.mix > 0.05 && !reduced) {
                for (let i = 0; i < this.spawn.length; i++) {
                    const s = this.spawn[i]; s.life += dt / s.dur;
                    if (s.life >= 1) { this.spawn[i] = this.newSpawn(false); continue; }
                    const m = 1 - Math.pow(1 - Math.min(s.life * 1.6, 1), 3), r = this.rot(s.t, cy, sy, cx, sx);
                    items.push([r[2], lerp(r[0] + s.o[0], r[0], m), lerp(r[1] + s.o[1], r[1], m), 1.7, 1, Math.sin(s.life * Math.PI) * this.mix, this.flicker(time, s), false]);
                }
            }
            items.sort((a, b) => b[0] - a[0]);   // painter's order: far first
            for (const it of items) this.draw(ctx, it[1], it[2], it[0], it[3], it[4], it[5], it[6], it[7]);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }
    }

    const fields = [...sections].map(el => new Field(el));
    let last = performance.now();
    (function loop(now) {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        fields.forEach(f => { if (f.visible) f.frame(now / 1000, dt); });
        requestAnimationFrame(loop);
    })(last);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleMorphSections);
} else {
    initParticleMorphSections();

}