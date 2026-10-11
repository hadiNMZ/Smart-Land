// Product page: reads ?item=smart-signal|mykey|sada|welcome, fills the preview,
// then hands the demo container to the matching demo module (demos/*.js).
(function () {
    const PRODUCTS = {
        'smart-signal': {
            demo: 'signal', img: 'smart-signal', accent: '#00d2ff', rgb: '0,210,255',
            tag: 'Accessibility AI', name: 'Smart Signal 2.0',
            alt: 'واجهة تطبيق Smart Signal لترجمة لغة الإشارة',
            pitch: 'ترجمة لغة الإشارة إلى نص فوري عبر الكاميرا، لدمج الصم وضعاف السمع في الحياة اليومية.',
            features: ['التقاط حركة اليدين عبر الكاميرا', 'ترجمة فورية إلى نص', 'دمج الصم وضعاف السمع تقنياً ومجتمعياً'],
            demoTitle: 'جرّب تتبّع اليد الحي',
            demoNote: 'التتبع حقيقي: الكاميرا تعمل داخل متصفحك ولا يُرسل أي فيديو إلى أي خادم. العرض يتعرف على أشكال اليد الأساسية ويحوّلها إلى عبارات.',
            window: 'Smart Signal — Live Hand Tracking'
        },
        'mykey': {
            demo: 'mykey', img: 'mykey', accent: '#b36bf0', rgb: '179,107,240',
            tag: 'Smart Filters & Listings', name: 'MyKey Platform | منظومة الفلترة والمطابقة',
            alt: 'واجهة منصة MyKey لإعلانات العقارات والمركبات',
            pitch: 'اختبر سرعة التصفية الذكية للإعلانات المعتمدة وفصل المعروضات.',
            features: ['تصفية فورية حسب الفئة والسعر والنوع', 'إعلانات معتمدة للعقارات والمركبات', 'مطابقة ذكية وتواصل مباشر بين البائع والمشتري'],
            demoTitle: 'تصفّح وتصفية الإعلانات',
            demoNote: 'ابحث وصفِّ وافرز وأضف إلى المفضلة وتواصل مع البائع. اختبر سرعة التصفية الذكية مع البيانات التفاعلية.',
            window: 'MyKey Platform — Smart Filters & Matching'
        },
        'sada': {
            demo: 'sada', img: 'sada', accent: '#5b9cf0', rgb: '91,156,240',
            tag: 'EdTech Ecosystem', name: 'Sada Learning IDE',
            alt: 'واجهة منصة Sada للتعلم البرمجي والتدريب العملي',
            pitch: 'بيئة تعليمية تفاعلية حديثة لإدارة المساقات والتدريب العملي عن بُعد، تتيح التعاون المباشر ومشاركة المشاريع البرمجية في الزمن الفعلي.',
            features: ['محرر أكواد سحابي يعمل في الزمن الفعلي', 'تصحيح تلقائي واختبارات تفاعلية للمساقات', 'إدارة البيئة التعليمية والتدريب العملي'],
            demoTitle: 'اكتب الكود وشغّله تفاعلياً',
            demoNote: 'اكتب JavaScript حقيقياً، شغّله في بيئة معزولة، ثم افحص الحل ليُصحَّح تلقائياً. تقدمك يُحفظ في متصفحك.',
            window: 'Sada Learning IDE — Interactive Code Lab'
        },
        'welcome': {
            demo: 'welcome', img: 'welcome', accent: '#ff9a3d', rgb: '255,154,61',
            tag: 'Smart Commerce', name: 'Welcome E-Commerce',
            alt: 'واجهة تطبيق Welcome للتسوق متعدد المتاجر',
            pitch: 'منظومة تسوق ذكية متعددة المتاجر مدعومة بحلول دفع مرنة، وإدارة لوجستية متطورة ترفع كفاءة تتبع الطلبات وتجربة المستهلك.',
            features: ['عدة متاجر وتُجّار داخل تطبيق موحد', 'حلول دفع مرنة وآمنة مع أكواد خصم', 'إدارة لوجستية متطورة وتتبع مؤتمت للطلبات'],
            demoTitle: 'تسوّق تفاعلي من عدة متاجر',
            demoNote: 'أضف منتجات من متاجر مختلفة، جرّب كود الخصم WELCOME10، ثم أتمم الطلب وتابع تتبعه اللوجستي.',
            window: 'Welcome E-Commerce — Multi-Vendor Ecosystem'
        }
    };

    const params = new URLSearchParams(location.search);
    let key = params.get('item');
    if (!PRODUCTS[key]) key = 'smart-signal';
    const p = PRODUCTS[key];

    document.title = p.name + ' | Smart Land';
    const root = document.documentElement;
    root.style.setProperty('--accent', p.accent);
    root.style.setProperty('--accent-rgb', p.rgb);

    const $ = id => document.getElementById(id);
    $('pdTag').textContent = p.tag;
    $('pdName').textContent = p.name;
    $('pdPitch').textContent = p.pitch;
    $('pdFeatures').innerHTML = p.features.map(f => `<li><span class="pd-check">✓</span>${f}</li>`).join('');
    $('pdSrcAvif').srcset = `assets/${p.img}.avif`;
    $('pdSrcWebp').srcset = `assets/${p.img}.webp`;
    const img = $('pdImg');
    img.src = `assets/${p.img}.jpeg`;       // fallback until converted to webp/avif
    img.alt = p.alt;
    img.addEventListener('error', () => $('pdPreview').classList.add('no-img'));
    $('pdDemoTitle').textContent = p.demoTitle;
    $('pdDemoNote').textContent = p.demoNote;
    $('pdWindowTitle').textContent = p.window;

    $('pdMore').innerHTML = Object.entries(PRODUCTS)
        .filter(([k]) => k !== key)
        .map(([k, o]) => `<a class="pd-more-card" href="product.html?item=${k}" style="--accent:${o.accent};--accent-rgb:${o.rgb}">
            <span class="pd-more-tag">${o.tag}</span><strong>${o.name}</strong><span>${o.pitch}</span></a>`).join('');

    const mount = $('demoMount');
    const demo = window.SL_DEMOS && window.SL_DEMOS[p.demo];
    if (demo) demo(mount); else mount.textContent = 'تعذر تحميل العرض.';

    // Custom Circular Scroll Progress Cursor (Self-healing & Top-Layer resilient)
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

    const isInteractive = (target) => target && target.closest('a, button, input, textarea, select, label, summary, [role="button"], .pd-more-card, .w-btn, .mk-card, .mk-fav, .sd-lessons button, .wl-prod, .wl-order, [data-track], [data-add], [data-close]');

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
})();
