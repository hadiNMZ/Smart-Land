// Welcome demo: multi-vendor shop, cart, coupon, mock checkout and order tracking.
(function () {
    window.SL_DEMOS = window.SL_DEMOS || {};
    const VENDORS = [
        { id: 'fresh', name: 'سوق الطازج', ship: 2, items: [['🍎', 'تفاح أحمر 1كغ', 3], ['🥖', 'خبز طازج', 1], ['🧀', 'جبنة بيضاء', 6], ['🍅', 'بندورة 1كغ', 2]] },
        { id: 'tech', name: 'تك زون', ship: 5, items: [['🎧', 'سماعات لاسلكية', 45], ['⌨️', 'لوحة مفاتيح', 30], ['🔌', 'شاحن سريع', 15], ['🖱️', 'فأرة', 12]] },
        { id: 'home', name: 'بيت وأناقة', ship: 4, items: [['🕯️', 'شمعة معطرة', 9], ['🛋️', 'وسادة ديكور', 14], ['☕', 'طقم فناجين', 22], ['🪴', 'نبتة زينة', 11]] }
    ];
    const PRODUCTS = [];
    VENDORS.forEach(v => v.items.forEach((it, i) => PRODUCTS.push({ id: v.id + i, v: v.id, e: it[0], n: it[1], p: it[2] })));
    const money = n => '$' + n.toFixed(2);
    const STEPS = ['تم الطلب', 'قيد التحضير', 'في الطريق', 'تم التسليم'];

    window.SL_DEMOS.welcome = function (mount) {
        const st = { vendor: '', cart: {}, coupon: false, orders: [] };
        mount.innerHTML = `
          <div class="wl">
            <div>
              <div class="wl-chips" id="wlChips"></div>
              <div id="wlShop"></div>
              <div class="wl-orders" id="wlOrders" hidden><h4>طلباتي</h4><div id="wlOrderList"></div></div>
            </div>
            <aside class="wl-cart">
              <h4>سلة التسوق <span id="wlN">0</span></h4>
              <div id="wlLines"></div>
              <div class="wl-coupon"><input class="w-input" id="wlCode" placeholder="كود الخصم"><button class="w-btn" id="wlApply" type="button">تطبيق</button></div>
              <div id="wlMsg"></div>
              <div class="wl-sum" id="wlSum"></div>
              <button class="w-btn primary" id="wlCheckout" type="button">إتمام الطلب</button>
            </aside>
          </div>
          <dialog class="w-dlg" id="wlDlg"></dialog>`;
        const $ = id => mount.querySelector('#' + id);
        const find = id => PRODUCTS.find(p => p.id === id);

        function totals() {
            let sub = 0; const used = new Set();
            Object.entries(st.cart).forEach(([id, q]) => { const p = find(id); sub += p.p * q; used.add(p.v); });
            const ship = [...used].reduce((s, v) => s + VENDORS.find(x => x.id === v).ship, 0);
            const disc = st.coupon ? sub * 0.1 : 0;
            return { sub, ship, disc, total: sub - disc + ship, vendors: used.size };
        }
        function renderShop() {
            $('wlChips').innerHTML = `<button class="w-btn ${!st.vendor ? 'active' : ''}" data-v="" type="button">كل المتاجر</button>` +
                VENDORS.map(v => `<button class="w-btn ${st.vendor === v.id ? 'active' : ''}" data-v="${v.id}" type="button">${v.name}</button>`).join('');
            $('wlShop').innerHTML = VENDORS.filter(v => !st.vendor || st.vendor === v.id).map(v => `
              <section class="wl-vendor"><h4>${v.name}<small>توصيل ${money(v.ship)}</small></h4>
              <div class="wl-grid">${PRODUCTS.filter(p => p.v === v.id).map(p => `
                <div class="wl-prod"><div class="wl-emoji">${p.e}</div><strong>${p.n}</strong><span class="wl-price">${money(p.p)}</span>
                <button class="w-btn" data-add="${p.id}" type="button">أضف للسلة</button></div>`).join('')}</div></section>`).join('');
        }
        function renderCart() {
            const ids = Object.keys(st.cart), t = totals();
            $('wlN').textContent = '(' + ids.reduce((s, i) => s + st.cart[i], 0) + ')';
            $('wlLines').innerHTML = ids.length ? ids.map(id => { const p = find(id), v = VENDORS.find(x => x.id === p.v); return `
              <div class="wl-line"><span>${p.e} ${p.n}</span><b>${money(p.p * st.cart[id])}</b>
              <span class="wl-qty"><button data-q="${id}" data-d="-1" type="button" aria-label="إنقاص">−</button>${st.cart[id]}<button data-q="${id}" data-d="1" type="button" aria-label="زيادة">+</button></span>
              <span class="wl-vtag">${v.name}</span></div>`; }).join('') : '<p class="w-note">السلة فارغة. أضف منتجات من أي متجر.</p>';
            $('wlSum').innerHTML = `<div><span>المجموع الفرعي</span><span>${money(t.sub)}</span></div>
              <div><span>التوصيل (${t.vendors} متجر)</span><span>${money(t.ship)}</span></div>
              ${st.coupon ? `<div><span>خصم WELCOME10</span><span>−${money(t.disc)}</span></div>` : ''}
              <div class="total"><span>الإجمالي</span><span>${money(t.total)}</span></div>`;
            $('wlCheckout').disabled = !ids.length;
        }
        function renderOrders() {
            $('wlOrders').hidden = !st.orders.length;
            $('wlOrderList').innerHTML = st.orders.map(o => `<div class="wl-order"><span>طلب #${o.id} · ${money(o.total)}</span><span>${STEPS[o.step]}</span><button class="w-btn" data-track="${o.id}" type="button">تتبع</button></div>`).join('');
        }
        function getBackdrop() {
            let bd = mount.querySelector('.w-backdrop');
            if (!bd) {
                bd = document.createElement('div');
                bd.className = 'w-backdrop';
                mount.appendChild(bd);
            }
            return bd;
        }

        function closeWlDlg() {
            const d = $('wlDlg');
            d.removeAttribute('open');
            const bd = getBackdrop();
            bd.classList.remove('active');
        }

        function checkout() {
            const t = totals(), d = $('wlDlg'), bd = getBackdrop();
            d.innerHTML = `<div class="w-dlg-in"><div class="w-dlg-head"><h4>إتمام الطلب</h4><button class="w-x" data-close type="button" aria-label="إغلاق">×</button></div>
              <form class="w-form" id="wlForm">
                <div><label class="w-label" for="wlAddr">عنوان التوصيل</label><input class="w-input" id="wlAddr" required placeholder="المدينة، الحي، الشارع"></div>
                <div class="wl-pay">
                  <label><input type="radio" name="pay" value="cod" checked> الدفع عند الاستلام</label>
                  <label><input type="radio" name="pay" value="card"> بطاقة (تجريبية)</label>
                  <label><input type="radio" name="pay" value="wallet"> محفظة إلكترونية (تجريبية)</label>
                </div>
                <div class="w-note">الإجمالي: <b>${money(t.total)}</b>. لا يتم أي خصم حقيقي.</div>
                <button class="w-btn primary" type="submit">تأكيد الطلب</button></form></div>`;
            d.setAttribute('open', '');
            bd.classList.add('active');

            d.querySelector('[data-close]').onclick = closeWlDlg;
            bd.onclick = closeWlDlg;

            d.querySelector('#wlForm').onsubmit = e => {
                e.preventDefault();
                const o = { id: 1000 + st.orders.length + 1, total: t.total, step: 0 };
                st.orders.unshift(o); st.cart = {}; st.coupon = false; $('wlMsg').innerHTML = '';
                [1, 2, 3].forEach(i => setTimeout(() => { o.step = i; renderOrders(); if (d.hasAttribute('open') && d.dataset.track == o.id) track(o.id); }, i * 4000));
                closeWlDlg(); renderCart(); renderOrders();
            };
        }

        function track(id) {
            const o = st.orders.find(x => x.id === id), d = $('wlDlg'), bd = getBackdrop();
            d.dataset.track = id;
            const x = 20 + (o.step / 3) * 260;
            d.innerHTML = `<div class="w-dlg-in"><div class="w-dlg-head"><h4>تتبع الطلب #${o.id}</h4><button class="w-x" data-close type="button" aria-label="إغلاق">×</button></div>
              <div class="wl-track"><ol class="wl-steps">${STEPS.map((s, i) => `<li class="${i <= o.step ? 'done' : ''}">${s}</li>`).join('')}</ol>
              <svg class="wl-map" viewBox="0 0 300 150"><path d="M20 120 Q90 20 150 80 T280 40" fill="none" stroke="#2a3350" stroke-width="3" stroke-dasharray="6 6"/>
              <circle cx="20" cy="120" r="6" fill="#ff9a3d"/><circle cx="280" cy="40" r="6" fill="#27c93f"/>
              <circle cx="${x}" cy="${o.step === 0 ? 120 : 120 - o.step * 27}" r="8" fill="#fff"/></svg>
              <p class="w-note">${o.step === 3 ? 'وصل طلبك. شكراً لتسوقك من Welcome!' : 'يتحدث الطلب تلقائياً كل بضع ثوانٍ (محاكاة).'}</p></div></div>`;
            d.setAttribute('open', '');
            bd.classList.add('active');

            d.querySelector('[data-close]').onclick = closeWlDlg;
            bd.onclick = closeWlDlg;
        }

        mount.addEventListener('click', e => {
            const c = e.target.closest.bind(e.target), a = c('[data-add]'), q = c('[data-q]'), v = c('[data-v]'), tr = c('[data-track]');
            if (a) { st.cart[a.dataset.add] = (st.cart[a.dataset.add] || 0) + 1; renderCart(); }
            else if (q) { const id = q.dataset.q; st.cart[id] += +q.dataset.d; if (st.cart[id] <= 0) delete st.cart[id]; renderCart(); }
            else if (v) { st.vendor = v.dataset.v; renderShop(); }
            else if (tr) track(+tr.dataset.track);
            else if (c('[data-close]')) closeWlDlg();
        });
        $('wlApply').onclick = () => {
            if ($('wlCode').value.trim().toUpperCase() === 'WELCOME10') { st.coupon = true; $('wlMsg').innerHTML = '<div class="w-msg ok">تم تطبيق خصم 10%.</div>'; }
            else { st.coupon = false; $('wlMsg').innerHTML = '<div class="w-msg err">كود غير صالح.</div>'; }
            renderCart();
        };
        $('wlCheckout').onclick = checkout;
        renderShop(); renderCart(); renderOrders();
    };
})();
