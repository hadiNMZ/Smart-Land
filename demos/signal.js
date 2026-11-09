// Smart Signal demo: real in-browser hand tracking (MediaPipe Hands, loaded on demand) -> basic gestures -> text.
(function () {
    window.SL_DEMOS = window.SL_DEMOS || {};
    const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/';
    // pattern = thumb,index,middle,ring,pinky (1 = extended)
    const MAP = {
        '11111': ['open', 'مرحباً'], '00000': ['fist', 'نعم'], '01000': ['point', 'انتظر'], '01100': ['peace', 'شكراً'],
        '10000': ['thumb', 'ممتاز'], '11001': ['love', 'أحبك'], '10001': ['call', 'اتصل بي'], '01110': ['three', 'ثلاثة'], '01111': ['four', 'توقف']
    };
    const CONN = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];

    const handSvg = (active = false) => `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="${active ? 'var(--accent)' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;${active ? 'filter:drop-shadow(0 0 8px rgba(var(--accent-rgb),.6));' : 'opacity:.5;'}"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v7"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-16 0v-2"></path></svg>`;

    function loadScript(src) {
        return new Promise((res, rej) => {
            if (window.Hands) return res();
            const s = document.createElement('script'); s.src = src; s.crossOrigin = 'anonymous';
            s.onload = res; s.onerror = () => rej(new Error('load'));
            document.head.appendChild(s);
        });
    }
    const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    function fingers(lm) {
        const wrist = lm[0], size = d(lm[0], lm[9]) || 1;
        const ext = (tip, pip) => d(lm[tip], wrist) > d(lm[pip], wrist) * 1.08;
        const thumb = d(lm[4], lm[17]) > d(lm[3], lm[17]) * 1.05 && d(lm[4], lm[5]) > size * 0.45;
        return [thumb, ext(8, 6), ext(12, 10), ext(16, 14), ext(20, 18)].map(v => v ? '1' : '0').join('');
    }

    window.SL_DEMOS.signal = function (mount) {
        mount.innerHTML = `
          <div class="sg">
            <div class="sg-stage mirror" id="sgStage">
              <video id="sgVideo" playsinline muted></video>
              <canvas id="sgCanvas"></canvas>
              <div class="sg-live" id="sgLive"><i></i>LIVE</div>
              <div class="sg-overlay" id="sgOverlay"><div class="big">${handSvg(true)}</div><div id="sgStatus">اضغط «تشغيل الكاميرا» وارفع يدك أمامها.<br><span class="w-note">يعمل كل شيء داخل متصفحك، ولا يُرسل أي فيديو.</span></div></div>
            </div>
            <div class="sg-side">
              <div class="sg-controls">
                <button class="w-btn primary" id="sgStart" type="button">تشغيل الكاميرا</button>
                <button class="w-btn" id="sgStop" type="button" disabled>إيقاف</button>
                <button class="w-btn active" id="sgMirror" type="button">مرآة</button>
              </div>
              <div class="sg-out"><div class="emoji" id="sgEmoji">${handSvg(false)}</div><div class="text" id="sgText">—</div>
                <div class="conf" id="sgConf">لا توجد يد</div><div class="sg-bar"><i id="sgBar"></i></div></div>
              <div><div class="w-note" style="margin-bottom:6px">السجل</div><ul class="sg-hist" id="sgHist"></ul></div>
              <div><div class="w-note" style="margin-bottom:6px">الإشارات المدعومة</div>
                <div class="sg-guide">${Object.values(MAP).map(g => `<span>${g[1]}</span>`).join('')}</div></div>
            </div>
          </div>`;
        const $ = id => mount.querySelector('#' + id);
        const video = $('sgVideo'), canvas = $('sgCanvas'), ctx = canvas.getContext('2d');
        let stream = null, hands = null, running = false, busy = false, last = '', streak = 0, committed = '';

        function status(msg) { $('sgOverlay').classList.remove('hide'); $('sgStatus').innerHTML = msg; }
        function show(pat, conf) {
            const g = MAP[pat];
            $('sgEmoji').innerHTML = handSvg(!!g);
            $('sgText').textContent = g ? g[1] : (pat ? 'إشارة غير معروفة' : '—');
            $('sgConf').textContent = pat ? 'الثقة ' + Math.round(conf * 100) + '%' : 'لا توجد يد';
            $('sgBar').style.width = Math.round(conf * 100) + '%';
        }
        function commit(pat) {
            if (!MAP[pat] || pat === committed) return;
            committed = pat;
            const li = document.createElement('li');
            li.innerHTML = `<span>${MAP[pat][1]}</span><span class="w-note">${new Date().toLocaleTimeString('ar-SY')}</span>`;
            $('sgHist').prepend(li);
            while ($('sgHist').children.length > 8) $('sgHist').lastChild.remove();
        }
        function onResults(r) {
            canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const lm = r.multiHandLandmarks && r.multiHandLandmarks[0];
            if (!lm) { last = ''; streak = 0; committed = ''; show('', 0); return; }
            ctx.strokeStyle = 'rgba(0,210,255,.9)'; ctx.lineWidth = 3;
            CONN.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(lm[a].x * canvas.width, lm[a].y * canvas.height); ctx.lineTo(lm[b].x * canvas.width, lm[b].y * canvas.height); ctx.stroke(); });
            ctx.fillStyle = '#fff';
            lm.forEach(p => { ctx.beginPath(); ctx.arc(p.x * canvas.width, p.y * canvas.height, 4, 0, 7); ctx.fill(); });
            const pat = fingers(lm);
            streak = pat === last ? streak + 1 : 1; last = pat;
            const conf = Math.min(1, streak / 8);
            show(pat, conf);
            if (streak >= 8) commit(pat);
        }
        async function loop() {
            if (!running) return;
            if (!busy && video.readyState >= 2) { busy = true; try { await hands.send({ image: video }); } catch (e) {} busy = false; }
            requestAnimationFrame(loop);
        }
        async function start() {
            $('sgStart').disabled = true;
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                status('الكاميرا غير متاحة. افتح الصفحة عبر https أو localhost.'); $('sgStart').disabled = false; return;
            }
            try {
                status('جارٍ تحميل نموذج التتبع…');
                await loadScript(CDN + 'hands.js');
                hands = new window.Hands({ locateFile: f => CDN + f });
                hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 });
                hands.onResults(onResults);
                status('بانتظار إذن الكاميرا…');
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
                video.srcObject = stream; await video.play();
                $('sgStage').classList.add('live'); $('sgOverlay').classList.add('hide'); $('sgLive').classList.add('on');
                $('sgStop').disabled = false; running = true; loop();
            } catch (e) {
                const denied = e && (e.name === 'NotAllowedError' || e.name === 'NotFoundError');
                status(denied ? 'تعذر الوصول إلى الكاميرا. اسمح بالإذن وتأكد من وجود كاميرا.' : 'تعذر تحميل نموذج التتبع. تحقق من اتصالك بالإنترنت ثم أعد المحاولة.');
                stop(true);
            }
        }
        function stop(keepMsg) {
            running = false;
            if (stream) stream.getTracks().forEach(t => t.stop());
            stream = null; video.srcObject = null;
            $('sgStage').classList.remove('live'); $('sgLive').classList.remove('on');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $('sgStart').disabled = false; $('sgStop').disabled = true; show('', 0);
            if (keepMsg !== true) status('تم إيقاف الكاميرا.');
        }
        $('sgStart').onclick = start;
        $('sgStop').onclick = () => stop();
        $('sgMirror').onclick = e => { e.currentTarget.classList.toggle('active'); $('sgStage').classList.toggle('mirror'); };
    };
})();
