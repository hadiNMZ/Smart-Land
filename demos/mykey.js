// MyKey Platform: Pro Search, Smart Filters & Interactive Matching Engine
(function () {
    window.SL_DEMOS = window.SL_DEMOS || {};
    const ICONS = {
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/></svg>',
        car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 15l2-6a2 2 0 012-1.4h10A2 2 0 0119 9l2 6v4h-3v-2H6v2H3z"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/></svg>'
    };
    const DATA = [
        { id: 1, cat: 'home', deal: 'sale', title: 'شقة 3 غرف – المزة', city: 'دمشق', price: 85000, a: 'مساحة 140 م²', b: 'الطابق 4', c: 'جاهزة للسكن', hue: 262 },
        { id: 2, cat: 'home', deal: 'rent', title: 'شقة مفروشة – أبو رمانة', city: 'دمشق', price: 350, a: 'مساحة 90 م²', b: 'غرفتان', c: 'إيجار شهري', hue: 200 },
        { id: 3, cat: 'home', deal: 'sale', title: 'فيلا مع حديقة – يعفور', city: 'ريف دمشق', price: 210000, a: 'مساحة 420 م²', b: '5 غرف', c: 'حديقة ومسبح', hue: 150 },
        { id: 4, cat: 'home', deal: 'rent', title: 'محل تجاري – شارع بغداد', city: 'دمشق', price: 600, a: 'مساحة 60 م²', b: 'واجهة زجاجية', c: 'إيجار شهري', hue: 30 },
        { id: 5, cat: 'home', deal: 'sale', title: 'شقة بإطلالة بحرية', city: 'اللاذقية', price: 64000, a: 'مساحة 110 م²', b: 'الطابق 6', c: 'مصعد وموقف', hue: 190 },
        { id: 6, cat: 'home', deal: 'rent', title: 'مكتب إداري – الحمرا', city: 'حلب', price: 280, a: 'مساحة 75 م²', b: '3 غرف', c: 'تكييف مركزي', hue: 320 },
        { id: 7, cat: 'car', deal: 'sale', title: 'تويوتا كورولا 2019', city: 'دمشق', price: 14500, a: 'السنة 2019', b: '62,000 كم', c: 'أوتوماتيك', hue: 0 },
        { id: 8, cat: 'car', deal: 'sale', title: 'هيونداي إلنترا 2021', city: 'حمص', price: 17800, a: 'السنة 2021', b: '38,000 كم', c: 'بنزين', hue: 220 },
        { id: 9, cat: 'car', deal: 'rent', title: 'كيا سبورتاج – يومي', city: 'دمشق', price: 55, a: 'السنة 2022', b: 'دفع رباعي', c: 'إيجار يومي', hue: 100 },
        { id: 10, cat: 'car', deal: 'sale', title: 'مرسيدس C200 2017', city: 'اللاذقية', price: 26900, a: 'السنة 2017', b: '95,000 كم', c: 'فل أوبشن', hue: 280 },
        { id: 11, cat: 'car', deal: 'rent', title: 'سيارة عائلية 7 مقاعد', city: 'حلب', price: 70, a: 'السنة 2020', b: '7 مقاعد', c: 'إيجار يومي', hue: 50 },
        { id: 12, cat: 'car', deal: 'sale', title: 'نيسان قشقاي 2020', city: 'طرطوس', price: 19900, a: 'السنة 2020', b: '51,000 كم', c: 'بنزين', hue: 340 }
    ];
    const fmt = n => '$' + n.toLocaleString('en-US');
    const DEAL = { sale: 'للبيع', rent: 'للإيجار' };

    window.SL_DEMOS.mykey = function (mount) {
        let favs = [];
        try { favs = JSON.parse(localStorage.getItem('sl_mykey_favs') || '[]'); } catch (e) {}
        const st = { q: '', cat: '', city: '', deal: '', sort: 'new', max: 250000, onlyFav: false };
        const maxP = 250000;

        mount.innerHTML = `
          <div class="mk-app">
            <div class="mk-nav-tabs" id="mkNavTabs">
              <button class="mk-tab-btn active" data-cat="" type="button">الكل</button>
              <button class="mk-tab-btn" data-cat="home" type="button">🏡 العقارات</button>
              <button class="mk-tab-btn" data-cat="car" type="button">🚗 المركبات</button>
              <button class="mk-tab-btn" data-fav="true" type="button">⭐ المفضلة (<span id="mkFavN">0</span>)</button>
            </div>

            <div class="mk-bar">
              <div class="mk-search-wrapper">
                <span class="mk-search-icon">🔍</span>
                <input class="w-input" id="mkQ" type="search" placeholder="ابحث عن إعلان، عقار، سيارة أو مدينة…" aria-label="بحث">
              </div>
              <select class="w-select" id="mkDeal" aria-label="النوع">
                <option value="">جميع العروض (بيع وإيجار)</option>
                <option value="sale">للبيع</option>
                <option value="rent">للإيجار</option>
              </select>
              <select class="w-select" id="mkSort" aria-label="الترتيب">
                <option value="new">الأحدث إضافة</option>
                <option value="lo">السعر: من الأقل للأعلى</option>
                <option value="hi">السعر: من الأعلى للأقل</option>
              </select>
            </div>

            <div class="mk-row">
              <div class="mk-city-chips" id="mkCityChips">
                <span class="mk-chip-label">المدن:</span>
                <button class="mk-chip active" data-city="" type="button">الكل</button>
                <button class="mk-chip" data-city="دمشق" type="button">دمشق</button>
                <button class="mk-chip" data-city="حلب" type="button">حلب</button>
                <button class="mk-chip" data-city="اللاذقية" type="button">اللاذقية</button>
                <button class="mk-chip" data-city="حمص" type="button">حمص</button>
                <button class="mk-chip" data-city="طرطوس" type="button">طرطوس</button>
              </div>
              <div class="mk-price-filter">
                <span>السعر الأقصى: <b id="mkMaxV">$250,000</b></span>
                <input type="range" id="mkMax" min="50" max="${maxP}" step="1000" value="${maxP}">
              </div>
              <button class="w-btn" id="mkReset" type="button">🔄 إعادة ضبط الفلاتر</button>
            </div>

            <div class="mk-count-bar"><span id="mkCount">12 إعلان</span> متوفر حالياً بالمطابقة الحالية</div>

            <div class="mk-grid" id="mkGrid"></div>
            <dialog class="w-dlg" id="mkDlg"></dialog>
          </div>`;

        const $ = id => mount.querySelector('#' + id);

        function list() {
            const q = st.q.trim().toLowerCase();
            let r = DATA.filter(x =>
                (!st.cat || x.cat === st.cat) &&
                (!st.city || x.city === st.city) &&
                (!st.deal || x.deal === st.deal) &&
                x.price <= st.max &&
                (!st.onlyFav || favs.includes(x.id)) &&
                (!q || (x.title + ' ' + x.city + ' ' + x.a + ' ' + x.b).toLowerCase().includes(q))
            );
            if (st.sort === 'lo') r.sort((a, b) => a.price - b.price);
            else if (st.sort === 'hi') r.sort((a, b) => b.price - a.price);
            else r.sort((a, b) => b.id - a.id);
            return r;
        }

        function render() {
            const r = list();
            $('mkFavN').textContent = favs.length;
            $('mkMaxV').textContent = fmt(st.max);
            $('mkCount').textContent = r.length + ' إعلان';

            // Navigation tabs active state
            mount.querySelectorAll('.mk-tab-btn').forEach(btn => {
                if (btn.dataset.fav !== undefined) {
                    btn.classList.toggle('active', st.onlyFav);
                } else {
                    btn.classList.toggle('active', !st.onlyFav && btn.dataset.cat === st.cat);
                }
            });

            // City chips active state
            mount.querySelectorAll('.mk-chip').forEach(chip => {
                chip.classList.toggle('active', chip.dataset.city === st.city);
            });

            $('mkGrid').innerHTML = r.length ? r.map(x => `
              <article class="mk-card">
                <div class="mk-thumb" style="background:linear-gradient(135deg,hsl(${x.hue} 55% 22%),hsl(${(x.hue + 40) % 360} 60% 12%))">
                  ${ICONS[x.cat]}
                  <span class="mk-deal">${DEAL[x.deal]}</span>
                  <button class="mk-fav ${favs.includes(x.id) ? 'on' : ''}" data-fav="${x.id}" type="button" aria-label="مفضلة">${favs.includes(x.id) ? '♥' : '♡'}</button>
                </div>
                <div class="mk-body">
                  <h4>${x.title}</h4>
                  <div class="mk-meta">${x.city} · ${x.a}</div>
                  <div class="mk-foot"><span class="mk-price-tag">${fmt(x.price)}${x.deal === 'rent' ? (x.cat === 'car' ? ' / يوم' : ' / شهر') : ''}</span>
                    <button class="w-btn" data-open="${x.id}" type="button">تفاصيل الإعلان</button></div>
                </div>
              </article>`).join('') : '<div class="mk-empty">لا توجد إعلانات مطابقة. جرّب تغيير الفلاتر أو إعادة الضبط.</div>';
        }

        function openDlg(id) {
            const x = DATA.find(d => d.id === id), dlg = $('mkDlg');
            dlg.innerHTML = `<div class="w-dlg-in">
              <div class="w-dlg-head"><h4>${x.title}</h4><button class="w-x" data-close type="button" aria-label="إغلاق">×</button></div>
              <div class="mk-specs"><div><b>المدينة</b>${x.city}</div><div><b>النوع</b>${DEAL[x.deal]}</div><div><b>${x.cat === 'car' ? 'الموديل' : 'المساحة'}</b>${x.a}</div><div><b>تفاصيل</b>${x.b}</div><div><b>ملاحظات</b>${x.c}</div><div><b>السعر</b>${fmt(x.price)}</div></div>
              <form class="w-form" id="mkForm"><div><label class="w-label" for="mkMsg">رسالة للبائع</label>
              <textarea class="w-textarea" id="mkMsg" rows="3" required>مرحباً، ما زال الإعلان متاحاً؟ أود الاستفسار عن التفاصيل.</textarea></div>
              <div><label class="w-label" for="mkTel">رقم التواصل</label><input class="w-input" id="mkTel" required placeholder="09xx xxx xxx"></div>
              <button class="w-btn primary" type="submit">إرسال استفسار للبائع</button></form></div>`;

            dlg.setAttribute('open', '');
            let bd = mount.querySelector('.w-backdrop');
            if (!bd) {
                bd = document.createElement('div');
                bd.className = 'w-backdrop';
                mount.appendChild(bd);
            }
            bd.classList.add('active');

            const closeDlg = () => {
                dlg.removeAttribute('open');
                if (bd) bd.classList.remove('active');
            };

            dlg.querySelector('[data-close]').onclick = closeDlg;
            bd.onclick = closeDlg;

            dlg.querySelector('#mkForm').onsubmit = e => {
                e.preventDefault();
                dlg.querySelector('#mkForm').outerHTML = '<div class="w-msg ok">✓ تم إرسال استفسارك بنجاح إلى البائع (عرض تجريبي).</div>';
            };
        }

        mount.addEventListener('click', e => {
            const f = e.target.closest('[data-fav]'), o = e.target.closest('[data-open]');
            const tab = e.target.closest('.mk-tab-btn'), chip = e.target.closest('.mk-chip');

            if (f) {
                const id = +f.dataset.fav;
                favs = favs.includes(id) ? favs.filter(v => v !== id) : favs.concat(id);
                try { localStorage.setItem('sl_mykey_favs', JSON.stringify(favs)); } catch (er) {}
                render();
            } else if (tab) {
                if (tab.dataset.fav !== undefined) {
                    st.onlyFav = !st.onlyFav;
                } else {
                    st.onlyFav = false;
                    st.cat = tab.dataset.cat;
                }
                render();
            } else if (chip) {
                st.city = chip.dataset.city;
                render();
            } else if (o) {
                openDlg(+o.dataset.open);
            } else if (e.target.closest('[data-close]')) {
                $('mkDlg').removeAttribute('open');
                const bd = mount.querySelector('.w-backdrop');
                if (bd) bd.classList.remove('active');
            }
        });

        $('mkQ').oninput = e => { st.q = e.target.value; render(); };
        $('mkDeal').onchange = e => { st.deal = e.target.value; render(); };
        $('mkSort').onchange = e => { st.sort = e.target.value; render(); };
        $('mkMax').oninput = e => { st.max = +e.target.value; render(); };
        $('mkReset').onclick = () => {
            Object.assign(st, { q: '', cat: '', city: '', deal: '', sort: 'new', max: maxP, onlyFav: false });
            $('mkQ').value = ''; $('mkDeal').value = ''; $('mkSort').value = 'new'; $('mkMax').value = maxP;
            render();
        };

        render();
    };
})();