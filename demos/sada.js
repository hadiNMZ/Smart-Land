// Sada Learning IDE Pro: High-fidelity collaborative IDE & learning ecosystem
(function () {
    window.SL_DEMOS = window.SL_DEMOS || {};
    const LESSONS = [
        { id: 'sum', module: '1. Introduction', title: '1. Sum of Two Numbers', fn: 'sum', desc: 'Write function sum(a, b) returning the sum of a and b.',
          start: 'function sum(a, b) {\n  // Write solution here\n  return a + b;\n}\n',
          sample: 'function sum(a, b) {\n  return a + b;\n}\n',
          tests: [[[1, 2], 3], [[-5, 5], 0], [[10, 32], 42]] },
        { id: 'even', module: '2. Stateful Components', title: '2. Filter Even Numbers', fn: 'evens', desc: 'Write function evens(arr) returning only even numbers.',
          start: 'function evens(arr) {\n  // Write solution here\n  return arr.filter(n => n % 2 === 0);\n}\n',
          sample: 'function evens(arr) {\n  return arr.filter(n => n % 2 === 0);\n}\n',
          tests: [[[[1, 2, 3, 4]], [2, 4]], [[[7, 9]], []], [[[10, 12, 15]], [10, 12]]] },
        { id: 'rev', module: '2. Stateful Components', title: '3. Reverse String', fn: 'reverse', desc: 'Write function reverse(s) returning the reversed string.',
          start: 'function reverse(s) {\n  // Write solution here\n  return s.split("").reverse().join("");\n}\n',
          sample: 'function reverse(s) {\n  return s.split("").reverse().join("");\n}\n',
          tests: [[['abc'], 'cba'], [[''], ''], [['Sada'], 'adaS']] },
        { id: 'max', module: '3. Hooks Deep Dive', title: '1. Find Array Max', fn: 'findMax', desc: 'Write function findMax(arr) returning the maximum number.',
          start: 'function findMax(arr) {\n  // Write solution here\n  return Math.max(...arr);\n}\n',
          sample: 'function findMax(arr) {\n  return Math.max(...arr);\n}\n',
          tests: [[[[3, 7, 2, 9, 4]], 9], [[[-10, -2, -5]], -2], [[[100]], 100]] },
        { id: 'factorial', module: '3. Hooks Deep Dive', title: '2. Calculate Factorial', fn: 'factorial', desc: 'Write function factorial(n) returning factorial of n.',
          start: 'function factorial(n) {\n  // Write solution here\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n',
          sample: 'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n',
          tests: [[[5], 120], [[0], 1], [[3], 6]] }
    ];

    window.SL_DEMOS.sada = function (mount) {
        let done = {}, cur = 0;
        try { done = JSON.parse(localStorage.getItem('sl_sada_done') || '{}'); } catch (e) {}
        const codeCache = {};

        mount.innerHTML = `
          <div class="sd-app">
            <header class="sd-header">
              <div class="sd-brand">
                <svg class="sd-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                <span>Sada Learning IDE</span>
              </div>
              <nav class="sd-top-nav" id="sdTopNav">
                <button class="sd-nav-btn active" data-tab="dashboard" type="button">Dashboard</button>
                <button class="sd-nav-btn" data-tab="courses" type="button">My Courses</button>
                <button class="sd-nav-btn" data-tab="collaborate" type="button">Collaborate</button>
                <button class="sd-nav-btn" data-tab="practice" type="button">Practice</button>
                <button class="sd-nav-btn" data-tab="mentors" type="button">Mentors</button>
              </nav>
              <div class="sd-header-right">
                <div class="sd-search"><span class="sd-search-icon">🔍</span><input type="text" placeholder="Search..." aria-label="Search"></div>
                <button class="sd-badge-btn" type="button" aria-label="Notifications"><span class="sd-badge">1</span>🔔</button>
                <div class="sd-user-avatar">
                  <img src="assets/logo.svg" alt="User Avatar">
                  <span>Sarah J.</span>
                </div>
              </div>
            </header>

            <main id="sdMainContainer">
              <!-- View 1: Dashboard (IDE Workspace) -->
              <div class="sd-body-grid sd-view active" id="viewDashboard">
                <aside class="sd-rail">
                  <button class="sd-rail-btn active" type="button" title="Dashboard">🎛️</button>
                  <button class="sd-rail-btn" type="button" title="Files">📁</button>
                  <button class="sd-rail-btn" type="button" title="Collaborate">👥</button>
                  <button class="sd-rail-btn" type="button" title="Docs">📝</button>
                  <button class="sd-rail-btn" type="button" title="Settings">⚙️</button>
                  <div class="sd-rail-bottom">
                    <button class="sd-rail-btn" type="button" title="Notifications">🔔</button>
                    <button class="sd-rail-btn" type="button" title="Help">❓</button>
                  </div>
                </aside>

                <div class="sd-syllabus-panel">
                  <div class="sd-syll-header">
                    <div class="sd-syll-title-row"><span>Syllabus</span><span style="cursor:pointer">•••</span></div>
                    <h3 class="sd-course-title">Advanced Web Development with React</h3>
                    <div class="sd-progress-container">
                      <div class="sd-progress-bar"><div class="sd-progress-fill" id="sdProgFill" style="width: 20%;"></div></div>
                      <span class="sd-progress-text" id="sdProgText">20%</span>
                    </div>
                  </div>
                  <div id="sdLessonsList"></div>
                </div>

                <div class="sd-editor-container">
                  <div class="sd-editor-header">
                    <div class="sd-file-tabs">
                      <button class="sd-file-tab active" type="button"><span>index.js</span><span class="sd-tab-close">✕</span></button>
                      <button class="sd-file-tab" type="button"><span>style.css</span></button>
                      <button class="sd-file-tab" type="button"><span>app.js</span></button>
                    </div>
                    <button class="sd-run-btn" id="sdRun" type="button">▶ Run</button>
                  </div>

                  <div class="sd-editor-body">
                    <div class="sd-line-numbers" id="sdLineNums">1</div>
                    <div class="sd-editor-wrapper">
                      <textarea class="sd-editor-textarea" id="sdEd" spellcheck="false" aria-label="Code Editor"></textarea>
                    </div>
                  </div>
                </div>

                <div class="sd-right-panel">
                  <div class="sd-video-panel">
                    <div class="sd-panel-header">
                      <span>Video Chat</span>
                      <span class="sd-live-badge">Live</span>
                    </div>
                    <div class="sd-video-grid">
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-1">👨‍🏫</div>
                        <span class="sd-video-name">Instructor Chen</span>
                      </div>
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-2">👩‍💻</div>
                        <span class="sd-video-name">Sarah J.</span>
                      </div>
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-3">👨‍💻</div>
                        <span class="sd-video-name">Alex M.</span>
                      </div>
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-4">👩‍🔬</div>
                        <span class="sd-video-name">David K.</span>
                      </div>
                    </div>
                    <div class="sd-video-controls">
                      <button class="sd-v-btn" type="button" title="Mic">🎙️</button>
                      <button class="sd-v-btn end-call" type="button" title="End Call">📞</button>
                      <button class="sd-v-btn" type="button" title="Camera">📹</button>
                    </div>
                  </div>

                  <div class="sd-terminal-panel">
                    <div class="sd-terminal-header">
                      <div class="sd-term-tabs">
                        <button class="sd-term-tab active" type="button">Terminal</button>
                        <button class="sd-term-tab" type="button">Code</button>
                      </div>
                      <div class="sd-term-actions">
                        <button class="sd-term-btn" id="sdCheck" type="button">✓ Check</button>
                        <button class="sd-term-btn" id="sdSample" type="button">💡 Hint</button>
                      </div>
                    </div>
                    <div class="sd-terminal-body" id="sdOut">
                      <span class="sd-prompt">$</span> <span class="dim">Fetching user data...</span><br>
                      <span class="sd-prompt">$</span> <span class="ok">Sada IDE ready. Click Run or Check to execute.</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View 2: My Courses -->
              <div class="sd-view" id="viewCourses">
                <div class="sd-view-header">
                  <h3>My Enrolled Courses</h3>
                  <p>Select any course to load its active workspace into the IDE.</p>
                </div>
                <div class="sd-courses-grid">
                  <div class="sd-course-card">
                    <span class="sd-course-badge">Active</span>
                    <h4>Advanced Web Development with React</h4>
                    <div class="sd-course-meta">Instructor: Dr. Chen · 12 Modules</div>
                    <div class="sd-progress-bar"><div class="sd-progress-fill" style="width: 50%;"></div></div>
                    <button class="w-btn primary" type="button" data-course="0">Continue Learning</button>
                  </div>
                  <div class="sd-course-card">
                    <span class="sd-course-badge">Enrolled</span>
                    <h4>Data Structures & Algorithms in JS</h4>
                    <div class="sd-course-meta">Instructor: Sarah Jenkins · 18 Modules</div>
                    <div class="sd-progress-bar"><div class="sd-progress-fill" style="width: 75%;"></div></div>
                    <button class="w-btn" type="button" data-course="1">Resume Course</button>
                  </div>
                  <div class="sd-course-card">
                    <span class="sd-course-badge">Enrolled</span>
                    <h4>Full-Stack Node.js & Microservices</h4>
                    <div class="sd-course-meta">Instructor: Alex Mercer · 15 Modules</div>
                    <div class="sd-progress-bar"><div class="sd-progress-fill" style="width: 30%;"></div></div>
                    <button class="w-btn" type="button" data-course="3">Resume Course</button>
                  </div>
                  <div class="sd-course-card">
                    <span class="sd-course-badge">New</span>
                    <h4>Machine Learning Foundations with Python</h4>
                    <div class="sd-course-meta">Instructor: Dr. Elena Rostova · 20 Modules</div>
                    <div class="sd-progress-bar"><div class="sd-progress-fill" style="width: 10%;"></div></div>
                    <button class="w-btn" type="button" data-course="4">Start Module</button>
                  </div>
                </div>
              </div>

              <!-- View 3: Collaborate -->
              <div class="sd-view" id="viewCollaborate">
                <div class="sd-view-header">
                  <h3>Collaborative Workspaces & Live Pair Programming</h3>
                  <p>Join live team coding sessions or start a shared workspace.</p>
                </div>
                <div class="sd-collab-grid">
                  <div class="sd-collab-card">
                    <div class="sd-collab-status">● Live Session (3 Members)</div>
                    <h4>React State Management Refactor Room</h4>
                    <div class="sd-course-meta">Active: Sarah J. (Host), Alex M., You</div>
                    <button class="w-btn primary" type="button" data-room="React State Management Refactor Room">Join Workspace</button>
                  </div>
                  <div class="sd-collab-card">
                    <div class="sd-collab-status">● Live Session (2 Members)</div>
                    <h4>Python Data Pipeline Optimization</h4>
                    <div class="sd-course-meta">Active: David K. (Host), Elena R.</div>
                    <button class="w-btn" type="button" data-room="Python Data Pipeline Optimization">Join Workspace</button>
                  </div>
                  <div class="sd-collab-card">
                    <div class="sd-collab-status" style="color:#ffbd2e">● Waiting for Teammate</div>
                    <h4>Express.js REST API Design Review</h4>
                    <div class="sd-course-meta">Active: Michael T. (Host)</div>
                    <button class="w-btn" type="button" data-room="Express.js REST API Design Review">Join Workspace</button>
                  </div>
                </div>
              </div>

              <!-- View 4: Practice -->
              <div class="sd-view" id="viewPractice">
                <div class="sd-view-header">
                  <h3>Daily Coding Challenges & Problem Sets</h3>
                  <p>Select any problem to load its code, tests, and description directly into the editor.</p>
                </div>
                <table class="sd-practice-table">
                  <thead>
                    <tr><th>Challenge Title</th><th>Category</th><th>Difficulty</th><th>Acceptance</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Two Sum Optimization</td><td>Algorithms</td><td><span class="sd-tag-easy">Easy</span></td><td>88%</td><td><button class="w-btn primary" type="button" data-practice="0">Solve Challenge</button></td></tr>
                    <tr><td>Binary Tree Level Order Traversal</td><td>Data Structures</td><td><span class="sd-tag-medium">Medium</span></td><td>64%</td><td><button class="w-btn" type="button" data-practice="1">Solve Challenge</button></td></tr>
                    <tr><td>Custom React Hook (useLocalStorage)</td><td>React</td><td><span class="sd-tag-medium">Medium</span></td><td>72%</td><td><button class="w-btn" type="button" data-practice="2">Solve Challenge</button></td></tr>
                    <tr><td>SQL Complex Join & Group By</td><td>Database</td><td><span class="sd-tag-hard">Hard</span></td><td>48%</td><td><button class="w-btn" type="button" data-practice="3">Solve Challenge</button></td></tr>
                  </tbody>
                </table>
              </div>

              <!-- View 5: Mentors -->
              <div class="sd-view" id="viewMentors">
                <div class="sd-view-header">
                  <h3>Expert Technical Mentors & Office Hours</h3>
                  <p>Book 1-on-1 code reviews or request instant technical advice.</p>
                </div>
                <div class="sd-mentors-grid">
                  <div class="sd-mentor-card">
                    <div class="sd-mentor-avatar">👨‍🏫</div>
                    <h4>Instructor Chen</h4>
                    <div class="sd-course-meta">Senior Principal Architect</div>
                    <div class="sd-mentor-tags"><span class="sd-mentor-tag">React</span><span class="sd-mentor-tag">System Design</span><span class="sd-mentor-tag">TypeScript</span></div>
                    <div style="font-size:0.85rem;color:#ffbd2e;font-weight:700">⭐ 4.98 (142 Reviews)</div>
                    <button class="w-btn primary" type="button" data-mentor="Instructor Chen">Book 1-on-1 Session</button>
                  </div>
                  <div class="sd-mentor-card">
                    <div class="sd-mentor-avatar">👩‍💻</div>
                    <h4>Sarah Jenkins</h4>
                    <div class="sd-course-meta">Lead Frontend Engineer</div>
                    <div class="sd-mentor-tags"><span class="sd-mentor-tag">UI/UX</span><span class="sd-mentor-tag">React Query</span><span class="sd-mentor-tag">Next.js</span></div>
                    <div style="font-size:0.85rem;color:#ffbd2e;font-weight:700">⭐ 4.95 (98 Reviews)</div>
                    <button class="w-btn" type="button" data-mentor="Sarah Jenkins">Book 1-on-1 Session</button>
                  </div>
                  <div class="sd-mentor-card">
                    <div class="sd-mentor-avatar">👨‍💻</div>
                    <h4>Alex Mercer</h4>
                    <div class="sd-course-meta">Cloud & DevOps Architect</div>
                    <div class="sd-mentor-tags"><span class="sd-mentor-tag">Node.js</span><span class="sd-mentor-tag">Docker</span><span class="sd-mentor-tag">Kubernetes</span></div>
                    <div style="font-size:0.85rem;color:#ffbd2e;font-weight:700">⭐ 4.92 (84 Reviews)</div>
                    <button class="w-btn" type="button" data-mentor="Alex Mercer">Book 1-on-1 Session</button>
                  </div>
                </div>
              </div>
            </main>
            <dialog class="w-dlg" id="sdMentorDlg"></dialog>
          </div>`;

        const $ = id => mount.querySelector('#' + id);
        const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

        function save() { try { localStorage.setItem('sl_sada_done', JSON.stringify(done)); } catch (e) {} }

        // Top Navigation Tab Switcher
        const tabMap = {
            'dashboard': $('viewDashboard'),
            'courses': $('viewCourses'),
            'collaborate': $('viewCollaborate'),
            'practice': $('viewPractice'),
            'mentors': $('viewMentors')
        };

        function switchTab(tabKey) {
            mount.querySelectorAll('.sd-nav-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabKey);
            });
            Object.keys(tabMap).forEach(k => {
                if (tabMap[k]) tabMap[k].classList.toggle('active', k === tabKey);
            });
        }

        $('sdTopNav').onclick = e => {
            const btn = e.target.closest('[data-tab]');
            if (btn) switchTab(btn.dataset.tab);
        };

        function logTerminalMsg(msg) {
            const out = $('sdOut');
            if (out) {
                out.innerHTML = `<span class="sd-prompt">$</span> ${msg}<br>` + out.innerHTML;
            }
        }

        // Mentor Booking Modal Handler
        function openMentorModal(name) {
            const dlg = $('sdMentorDlg');
            dlg.innerHTML = `<div class="w-dlg-in">
              <div class="w-dlg-head"><h4>Book Session with ${esc(name)}</h4><button class="w-x" data-close type="button" aria-label="Close">×</button></div>
              <form class="w-form" id="sdMentorForm">
                <div>
                  <label class="w-label" for="sdSlot">Available Time Slot</label>
                  <select class="w-select" id="sdSlot">
                    <option>Today at 4:00 PM (30 mins)</option>
                    <option>Tomorrow at 10:00 AM (45 mins)</option>
                    <option>Tomorrow at 2:30 PM (60 mins)</option>
                  </select>
                </div>
                <div>
                  <label class="w-label" for="sdTopic">Topic / Review Focus</label>
                  <textarea class="w-textarea" id="sdTopic" rows="3" required placeholder="Describe the code review or topic..."></textarea>
                </div>
                <button class="w-btn primary" type="submit">Confirm 1-on-1 Booking</button>
              </form>
            </div>`;

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

            dlg.querySelector('#sdMentorForm').onsubmit = e => {
                e.preventDefault();
                dlg.querySelector('#sdMentorForm').outerHTML = `<div class="w-msg ok">✓ Booking confirmed with ${esc(name)}! Check your email for session details.</div>`;
            };
        }

        mount.addEventListener('click', e => {
            const courseBtn = e.target.closest('[data-course]');
            const roomBtn = e.target.closest('[data-room]');
            const practiceBtn = e.target.closest('[data-practice]');
            const mentorBtn = e.target.closest('[data-mentor]');

            if (courseBtn) {
                const idx = +courseBtn.dataset.course;
                load(idx);
                switchTab('dashboard');
                logTerminalMsg(`<span class="ok">Switched to course: ${LESSONS[idx].title}</span>`);
            } else if (roomBtn) {
                const room = roomBtn.dataset.room;
                switchTab('dashboard');
                logTerminalMsg(`<span class="ok">Joined live pair-programming session: ${esc(room)}</span>`);
            } else if (practiceBtn) {
                const idx = +practiceBtn.dataset.practice;
                load(idx);
                switchTab('dashboard');
                logTerminalMsg(`<span class="ok">Loaded practice challenge: ${LESSONS[idx].title}</span>`);
            } else if (mentorBtn) {
                openMentorModal(mentorBtn.dataset.mentor);
            } else if (e.target.closest('[data-close]')) {
                const dlg = $('sdMentorDlg');
                if (dlg) dlg.removeAttribute('open');
                const bd = mount.querySelector('.w-backdrop');
                if (bd) bd.classList.remove('active');
            }
        });

        function updateLines() {
            const ed = $('sdEd');
            if (!ed) return;
            const lines = (ed.value.match(/\n/g) || []).length + 1;
            let nums = '';
            for (let i = 1; i <= Math.max(lines, 12); i++) nums += i + '<br>';
            $('sdLineNums').innerHTML = nums;
        }

        function renderSide() {
            const completedCount = LESSONS.filter(l => done[l.id]).length;
            const pct = Math.round((completedCount / LESSONS.length) * 100);
            $('sdProgFill').style.width = pct + '%';
            $('sdProgText').textContent = pct + '%';

            let html = '';
            let currentModule = '';
            LESSONS.forEach((l, i) => {
                if (l.module !== currentModule) {
                    currentModule = l.module;
                    html += `<div class="sd-mod-group"><div class="sd-mod-header"><span>${currentModule}</span></div><ul class="sd-mod-items">`;
                }
                const isDone = done[l.id];
                const isActive = i === cur;
                html += `<li>
                  <button type="button" data-i="${i}" class="sd-item-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}">
                    <span class="sd-check-icon">${isDone ? '✓' : ''}</span>
                    <span>${l.title}</span>
                  </button>
                </li>`;
            });
            $('sdLessonsList').innerHTML = html;
        }

        function load(i) {
            const ed = $('sdEd');
            if (!ed) return;
            if (codeCache[cur] !== undefined || ed.value) codeCache[cur] = ed.value;
            cur = i;
            const l = LESSONS[i];
            ed.value = codeCache[i] !== undefined ? codeCache[i] : l.start;
            updateLines();
            renderSide();
        }

        function exec(payload) {
            return new Promise(resolve => {
                const { code, fn, tests, mode } = payload;
                const logs = [];
                const fmt = v => { try { return typeof v === 'string' ? v : JSON.stringify(v); } catch (x) { return String(v); } };
                const con = { log: (...a) => logs.push(a.map(fmt).join(' ')) };

                try {
                    if (mode === 'run') {
                        new Function('console', code)(con);
                        resolve({ logs });
                        return;
                    }
                    const f = new Function('console', code + '\n;return typeof ' + fn + '==="function"?' + fn + ':null;')(con);
                    if (!f) {
                        resolve({ logs, error: 'Function ' + fn + ' not found' });
                        return;
                    }
                    const res = tests.map(([args, exp]) => {
                        let got, err = null;
                        try { got = f(...args); } catch (x) { err = String(x); }
                        return { args, exp, got, ok: !err && JSON.stringify(got) === JSON.stringify(exp), err };
                    });
                    resolve({ logs, res });
                } catch (x) {
                    resolve({ logs, error: String(x) });
                }
            });
        }

        const show = JSON.stringify;
        $('sdLessonsList').onclick = e => {
            const b = e.target.closest('[data-i]');
            if (b) load(+b.dataset.i);
        };
        $('sdSample').onclick = () => {
            $('sdEd').value = LESSONS[cur].sample;
            updateLines();
        };
        $('sdEd').addEventListener('input', updateLines);
        $('sdEd').addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const t = e.target, s = t.selectionStart;
                t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
                t.selectionStart = t.selectionEnd = s + 2;
                updateLines();
            }
        });

        $('sdRun').onclick = async () => {
            $('sdOut').innerHTML = '<span class="sd-prompt">$</span> Running user code...<br>';
            const r = await exec({ mode: 'run', code: $('sdEd').value });
            let h = (r.logs || []).map(l => `<span class="sd-prompt">$</span> ${esc(l)}`).join('<br>');
            if (r.error) h += (h ? '<br>' : '') + `<span class="err">Error: ${esc(r.error)}</span>`;
            $('sdOut').innerHTML = h || '<span class="sd-prompt">$</span> Code executed successfully. Use console.log() to print outputs.';
        };

        $('sdCheck').onclick = async () => {
            const l = LESSONS[cur];
            $('sdOut').innerHTML = '<span class="sd-prompt">$</span> Evaluating unit test assertions...<br>';
            const r = await exec({ mode: 'test', code: $('sdEd').value, fn: l.fn, tests: l.tests });
            if (r.error) {
                $('sdOut').innerHTML = `<span class="sd-prompt">$</span> <span class="err">Error: ${esc(r.error)}</span>`;
                return;
            }
            const lines = r.res.map((t, i) => t.ok
                ? `<span class="ok">✓ Test ${i + 1}: ${esc(l.fn)}(${esc(t.args.map(show).join(', '))}) = ${esc(show(t.exp))}</span>`
                : `<span class="err">✗ Test ${i + 1}: Expected ${esc(show(t.exp))}, got ${esc(t.err || show(t.got))}</span>`);
            const pass = r.res.every(t => t.ok);
            if (pass) {
                done[l.id] = true;
                save();
                renderSide();
                lines.push('<span class="ok">🎉 All tests passed! Module saved.</span>');
            }
            $('sdOut').innerHTML = lines.join('<br>');
        };

        load(0);
    };
})();