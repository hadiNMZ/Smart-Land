// Sada Learning IDE: In-Browser Python Mini Compiler & Interactive Lab
(function () {
    window.SL_DEMOS = window.SL_DEMOS || {};

    // Standard Python Curriculum & Unit Test Challenges
    const LESSONS = [
        {
            id: 'sum', module: '1. Core Fundamentals', title: '1. sum_two(a, b)', fn: 'sum_two',
            desc: 'Write a Python function sum_two(a, b) returning the sum of numbers a and b.',
            start: 'def sum_two(a, b):\n    # Write Python solution here\n    return a + b\n',
            sample: 'def sum_two(a, b):\n    return a + b\n',
            tests: [[[1, 2], 3], [[-5, 5], 0], [[10, 32], 42]]
        },
        {
            id: 'even', module: '1. Core Fundamentals', title: '2. filter_evens(nums)', fn: 'filter_evens',
            desc: 'Write a Python function filter_evens(nums) returning a list with only the even numbers.',
            start: 'def filter_evens(nums):\n    # Write Python solution here\n    return [x for x in nums if x % 2 == 0]\n',
            sample: 'def filter_evens(nums):\n    return [x for x in nums if x % 2 == 0]\n',
            tests: [[[[1, 2, 3, 4]], [2, 4]], [[[7, 9]], []], [[[10, 12, 15]], [10, 12]]]
        },
        {
            id: 'rev', module: '2. Strings & Sequences', title: '3. reverse_string(s)', fn: 'reverse_string',
            desc: 'Write a Python function reverse_string(s) returning the reversed string using slicing.',
            start: 'def reverse_string(s):\n    # Write Python solution here\n    return s[::-1]\n',
            sample: 'def reverse_string(s):\n    return s[::-1]\n',
            tests: [[['abc'], 'cba'], [[''], ''], [['Sada'], 'adaS']]
        },
        {
            id: 'max', module: '2. Strings & Sequences', title: '4. find_max(nums)', fn: 'find_max',
            desc: 'Write a Python function find_max(nums) returning the maximum value in the list.',
            start: 'def find_max(nums):\n    # Write Python solution here\n    return max(nums)\n',
            sample: 'def find_max(nums):\n    return max(nums)\n',
            tests: [[[[3, 7, 2, 9, 4]], 9], [[[-10, -2, -5]], -2], [[[100]], 100]]
        },
        {
            id: 'factorial', module: '3. Algorithms & Logic', title: '5. factorial(n)', fn: 'factorial',
            desc: 'Write a Python function factorial(n) calculating the factorial of n recursively.',
            start: 'def factorial(n):\n    # Write Python solution here\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n',
            sample: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n',
            tests: [[[5], 120], [[0], 1], [[3], 6]]
        },
        {
            id: 'palindrome', module: '3. Algorithms & Logic', title: '6. is_palindrome(s)', fn: 'is_palindrome',
            desc: 'Write a Python function is_palindrome(s) returning True if string is palindrome, False otherwise.',
            start: 'def is_palindrome(s):\n    # Write Python solution here\n    return s == s[::-1]\n',
            sample: 'def is_palindrome(s):\n    return s == s[::-1]\n',
            tests: [[['radar'], true], [['hello'], false], [['level'], true]]
        }
    ];

    // Multi-File Virtual Python Workspace
    const FILES = {
        'main.py': `# Sada In-Browser Python Mini Compiler
# Write standard Python code and press Run!

def calculate_stats(numbers):
    total = sum(numbers)
    count = len(numbers)
    average = total / count
    return {
        "count": count,
        "total": total,
        "average": average,
        "max": max(numbers),
        "min": min(numbers)
    }

scores = [88, 92, 79, 95, 84, 91, 100]
print("Dataset:", scores)

stats = calculate_stats(scores)
print("Count:", stats["count"])
print("Total:", stats["total"])
print("Average:", stats["average"])
print("Max score:", stats["max"])
print("Min score:", stats["min"])

# Filter scores above 90 using list comprehension
top_scores = [s for s in scores if s >= 90]
print("Distinction (>= 90):", top_scores)
`,
        'algorithms.py': `# Python Sorting and Palindromes
def bubble_sort(arr):
    items = list(arr)
    n = len(items)
    for i in range(n):
        for j in range(0, n - i - 1):
            if items[j] > items[j + 1]:
                items[j], items[j + 1] = items[j + 1], items[j]
    return items

sample = [64, 34, 25, 12, 22, 11, 90]
print("Original:", sample)
print("Sorted:", bubble_sort(sample))

def is_palindrome(word):
    cleaned = str(word).lower()
    return cleaned == cleaned[::-1]

words = ["racecar", "python", "madam", "sada"]
for w in words:
    print(f"'{w}' is palindrome:", is_palindrome(w))
`,
        'math_utils.py': `# Python Recursion and Math Generators
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fibonacci(limit):
    seq = []
    a = 0
    b = 1
    for _ in range(limit):
        seq.append(a)
        temp = a + b
        a = b
        b = temp
    return seq

print("Factorials from 1 to 6:")
for i in range(1, 7):
    print(f"{i}! =", factorial(i))

print("Fibonacci first 8 terms:")
print(fibonacci(8))
`
    };

    // Clean SVGs for all UI buttons and badges (zero emojis)
    const SVG = {
        bell: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
        railDash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        railFiles: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
        railCollab: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
        railDocs: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
        railSettings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        railHelp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        fileIcon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.8;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
        play: '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-inline-end:4px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-inline-end:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        hint: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-inline-end:4px;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
        avatarUser: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
        avatarLead: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>',
        avatarDev: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path></svg>',
        avatarSci: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><circle cx="19" cy="11" r="2"></circle></svg>',
        mic: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
        endCall: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.11-8.69A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>',
        cam: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>'
    };

    // Client-side Python-to-JavaScript Transpiler
    function compilePython(pyCode) {
        const lines = pyCode.split('\n');
        const out = [];
        const indentStack = [0];

        const parseListComp = str => {
            return str.replace(/\[([^\[\]]+?)\s+for\s+([a-zA-Z0-9_]+)\s+in\s+([^\[\]]+?)(?:\s+if\s+([^\[\]]+?))?\]/g, (m, expr, v, iter, cond) => {
                if (cond) {
                    return '(' + iter + ').filter((' + v + ') => ' + cond + ').map((' + v + ') => ' + expr + ')';
                }
                return '(' + iter + ').map((' + v + ') => ' + expr + ')';
            });
        };

        const convertExpr = expr => {
            let s = expr;
            s = s.replace(/#.*$/, '');
            s = s.replace(/\bTrue\b/g, 'true')
                 .replace(/\bFalse\b/g, 'false')
                 .replace(/\bNone\b/g, 'null');
            s = s.replace(/\band\b/g, '&&')
                 .replace(/\bor\b/g, '||')
                 .replace(/\bnot\s+/g, '!');
            s = s.replace(/\bf\"([^\"]*)\"/g, (m, g1) => '`' + g1.replace(/\{([^}]+)\}/g, '${$1}') + '`');
            s = s.replace(/\bf\'([^\']*)\'/g, (m, g1) => '`' + g1.replace(/\{([^}]+)\}/g, '${$1}') + '`');
            // slicing [start:end:step] or [::-1]
            s = s.replace(/([a-zA-Z0-9_\)\]]+)\[\s*([^:\]]*)\s*:\s*([^:\]]*)(?:\s*:\s*([^\]]+))?\s*\]/g, (m, obj, a, b, c) => {
                return '__py_slice(' + obj + ', ' + (a || 'null') + ', ' + (b || 'null') + ', ' + (c || 'null') + ')';
            });
            s = parseListComp(s);
            s = s.replace(/\bprint\s*\(/g, '__py_print(');
            return s;
        };

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            const trimmed = rawLine.trim();
            if (!trimmed) {
                out.push('');
                continue;
            }
            if (trimmed.startsWith('#')) {
                out.push('// ' + trimmed.slice(1));
                continue;
            }

            const indent = rawLine.match(/^(\s*)/)[1].length;

            while (indent < indentStack[indentStack.length - 1]) {
                indentStack.pop();
                out.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
            }

            const currIndent = ' '.repeat(indent);

            // def func(args):
            let m = trimmed.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*:/);
            if (m) {
                indentStack.push(indent + 2);
                out.push(currIndent + 'function ' + m[1] + '(' + m[2] + ') {');
                continue;
            }

            // if cond:
            m = trimmed.match(/^if\s+(.*?)\s*:/);
            if (m) {
                indentStack.push(indent + 2);
                out.push(currIndent + 'if (' + convertExpr(m[1]) + ') {');
                continue;
            }

            // elif cond:
            m = trimmed.match(/^elif\s+(.*?)\s*:/);
            if (m) {
                out.push(currIndent + '} else if (' + convertExpr(m[1]) + ') {');
                continue;
            }

            // else:
            m = trimmed.match(/^else\s*:/);
            if (m) {
                out.push(currIndent + '} else {');
                continue;
            }

            // while cond:
            m = trimmed.match(/^while\s+(.*?)\s*:/);
            if (m) {
                indentStack.push(indent + 2);
                out.push(currIndent + 'while (' + convertExpr(m[1]) + ') {');
                continue;
            }

            // for var in range(...):
            m = trimmed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\)\s*:/);
            if (m) {
                indentStack.push(indent + 2);
                out.push(currIndent + 'for (let ' + m[1] + ' of __py_range(' + convertExpr(m[2]) + ')) {');
                continue;
            }

            // for var in iter:
            m = trimmed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?)\s*:/);
            if (m) {
                indentStack.push(indent + 2);
                out.push(currIndent + 'for (let ' + m[1] + ' of ' + convertExpr(m[2]) + ') {');
                continue;
            }

            // return expr
            m = trimmed.match(/^return(?:\s+(.*?))?$/);
            if (m) {
                out.push(currIndent + 'return ' + (m[1] ? convertExpr(m[1]) : '') + ';');
                continue;
            }

            // Assignment
            m = trimmed.match(/^([a-zA-Z0-9_]+)\s*=(?!=)(.*)$/);
            if (m) {
                out.push(currIndent + 'var ' + m[1] + ' = ' + convertExpr(m[2]) + ';');
                continue;
            }

            out.push(currIndent + convertExpr(trimmed) + ';');
        }

        while (indentStack.length > 1) {
            indentStack.pop();
            out.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
        }

        return out.join('\n');
    }

    // Main Sada IDE Mount
    window.SL_DEMOS.sada = function (mount) {
        let done = {}, cur = 0, activeFile = 'main.py';
        try { done = JSON.parse(localStorage.getItem('sl_sada_done') || '{}'); } catch (e) {}
        const codeCache = { ...FILES };

        mount.innerHTML = `
          <div class="sd-app">
            <header class="sd-header">
              <div class="sd-brand">
                <svg class="sd-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                <span>Sada Learning IDE · Python Edition</span>
              </div>
              <nav class="sd-top-nav" id="sdTopNav">
                <button class="sd-nav-btn active" data-tab="dashboard" type="button">Python Lab</button>
                <button class="sd-nav-btn" data-tab="courses" type="button">Curriculum</button>
                <button class="sd-nav-btn" data-tab="collaborate" type="button">Collaborate</button>
                <button class="sd-nav-btn" data-tab="practice" type="button">Practice</button>
                <button class="sd-nav-btn" data-tab="mentors" type="button">Mentors</button>
              </nav>
              <div class="sd-header-right">
                <div class="sd-search"><span class="sd-search-icon"></span><input type="text" placeholder="Search Python docs..." aria-label="Search"></div>
                <button class="sd-badge-btn" type="button" aria-label="Notifications"><span class="sd-badge">1</span>${SVG.bell}</button>
                <div class="sd-user-avatar">
                  <span class="sd-avatar-icon" style="display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:rgba(var(--accent-rgb),.15);color:var(--accent);">${SVG.avatarUser}</span>
                  <span>Sarah J.</span>
                </div>
              </div>
            </header>

            <main id="sdMainContainer">
              <!-- View 1: Dashboard (Python IDE Workspace) -->
              <div class="sd-body-grid sd-view active" id="viewDashboard">
                <aside class="sd-rail">
                  <button class="sd-rail-btn active" type="button" title="Python Lab">${SVG.railDash}</button>
                  <button class="sd-rail-btn" type="button" title="Files">${SVG.railFiles}</button>
                  <button class="sd-rail-btn" type="button" title="Collaborate">${SVG.railCollab}</button>
                  <button class="sd-rail-btn" type="button" title="Docs">${SVG.railDocs}</button>
                  <button class="sd-rail-btn" type="button" title="Settings">${SVG.railSettings}</button>
                  <div class="sd-rail-bottom">
                    <button class="sd-rail-btn" type="button" title="Notifications">${SVG.bell}</button>
                    <button class="sd-rail-btn" type="button" title="Help">${SVG.railHelp}</button>
                  </div>
                </aside>

                <div class="sd-syllabus-panel">
                  <div class="sd-syll-header">
                    <div class="sd-syll-title-row"><span>Python Syllabus</span><span style="cursor:pointer">•••</span></div>
                    <h3 class="sd-course-title">Python Core & Algorithmic Problem Solving</h3>
                    <div class="sd-progress-container">
                      <div class="sd-progress-bar"><div class="sd-progress-fill" id="sdProgFill" style="width: 20%;"></div></div>
                      <span class="sd-progress-text" id="sdProgText">20%</span>
                    </div>
                  </div>
                  <div id="sdLessonsList"></div>
                </div>

                <div class="sd-editor-container">
                  <div class="sd-editor-header">
                    <div class="sd-file-tabs" id="sdTabs">
                      <button class="sd-file-tab active" data-file="main.py" type="button">${SVG.fileIcon}<span>main.py</span></button>
                      <button class="sd-file-tab" data-file="algorithms.py" type="button">${SVG.fileIcon}<span>algorithms.py</span></button>
                      <button class="sd-file-tab" data-file="math_utils.py" type="button">${SVG.fileIcon}<span>math_utils.py</span></button>
                    </div>
                    <button class="sd-run-btn" id="sdRun" type="button">${SVG.play}Run</button>
                  </div>

                  <div class="sd-editor-body">
                    <div class="sd-line-numbers" id="sdLineNums">1</div>
                    <div class="sd-editor-wrapper">
                      <textarea class="sd-editor-textarea" id="sdEd" spellcheck="false" aria-label="Python Code Editor"></textarea>
                    </div>
                  </div>
                </div>

                <div class="sd-right-panel">
                  <div class="sd-video-panel">
                    <div class="sd-panel-header">
                      <span>Live Video Mentorship</span>
                      <span class="sd-live-badge">Live</span>
                    </div>
                    <div class="sd-video-grid">
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-1">${SVG.avatarLead}</div>
                        <span class="sd-video-name">Dr. Chen (Lead)</span>
                      </div>
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-2">${SVG.avatarUser}</div>
                        <span class="sd-video-name">Sarah J.</span>
                      </div>
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-3">${SVG.avatarDev}</div>
                        <span class="sd-video-name">Alex M.</span>
                      </div>
                      <div class="sd-video-card">
                        <div class="sd-avatar-placeholder bg-4">${SVG.avatarSci}</div>
                        <span class="sd-video-name">David K.</span>
                      </div>
                    </div>
                    <div class="sd-video-controls">
                      <button class="sd-v-btn" type="button" title="Mic">${SVG.mic}</button>
                      <button class="sd-v-btn end-call" type="button" title="End Call">${SVG.endCall}</button>
                      <button class="sd-v-btn" type="button" title="Camera">${SVG.cam}</button>
                    </div>
                  </div>

                  <div class="sd-terminal-panel">
                    <div class="sd-terminal-header">
                      <div class="sd-term-tabs">
                        <button class="sd-term-tab active" type="button">Python Terminal</button>
                        <button class="sd-term-tab" type="button">Compiler Output</button>
                      </div>
                      <div class="sd-term-actions">
                        <button class="sd-term-btn" id="sdCheck" type="button">${SVG.check}Check Tests</button>
                        <button class="sd-term-btn" id="sdSample" type="button">${SVG.hint}Hint</button>
                      </div>
                    </div>
                    <div class="sd-terminal-body" id="sdOut">
                      <span class="sd-prompt">$</span> <span class="ok">Sada Python 3 Mini Compiler initialized.</span><br>
                      <span class="sd-prompt">$</span> <span class="dim">Type standard Python in the editor and click Run (or Check Tests for lessons).</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- View 2: Curriculum -->
              <div class="sd-view" id="viewCourses">
                <div class="sd-view-header">
                  <h3>Python Curriculum & Degree Tracks</h3>
                  <p>Select any course to load its modules directly into the compiler workspace.</p>
                </div>
                <div class="sd-courses-grid">
                  <div class="sd-course-card">
                    <span class="sd-course-badge">Active</span>
                    <h4>Python Core & Algorithmic Problem Solving</h4>
                    <div class="sd-course-meta">Instructor: Dr. Chen · 12 Modules</div>
                    <div class="sd-progress-bar"><div class="sd-progress-fill" style="width: 50%;"></div></div>
                    <button class="w-btn primary" type="button" data-course="0">Continue Learning</button>
                  </div>
                  <div class="sd-course-card">
                    <span class="sd-course-badge">Enrolled</span>
                    <h4>Data Structures & Algorithms in Python</h4>
                    <div class="sd-course-meta">Instructor: Sarah Jenkins · 18 Modules</div>
                    <div class="sd-progress-bar"><div class="sd-progress-fill" style="width: 75%;"></div></div>
                    <button class="w-btn" type="button" data-course="1">Resume Course</button>
                  </div>
                  <div class="sd-course-card">
                    <span class="sd-course-badge">Enrolled</span>
                    <h4>Python Asynchronous Programming & APIs</h4>
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
                  <p>Join live team coding sessions or start a shared Python workspace.</p>
                </div>
                <div class="sd-collab-grid">
                  <div class="sd-collab-card">
                    <div class="sd-collab-status">● Live Session (3 Members)</div>
                    <h4>Python Data Pipeline Optimization</h4>
                    <div class="sd-course-meta">Active: Sarah J. (Host), Alex M., You</div>
                    <button class="w-btn primary" type="button" data-room="Python Data Pipeline Optimization">Join Workspace</button>
                  </div>
                  <div class="sd-collab-card">
                    <div class="sd-collab-status">● Live Session (2 Members)</div>
                    <h4>Algorithms & Tree Traversal Review</h4>
                    <div class="sd-course-meta">Active: David K. (Host), Elena R.</div>
                    <button class="w-btn" type="button" data-room="Algorithms & Tree Traversal Review">Join Workspace</button>
                  </div>
                  <div class="sd-collab-card">
                    <div class="sd-collab-status" style="color:#ffbd2e">● Waiting for Teammate</div>
                    <h4>REST API Architecture in Python</h4>
                    <div class="sd-course-meta">Active: Michael T. (Host)</div>
                    <button class="w-btn" type="button" data-room="REST API Architecture in Python">Join Workspace</button>
                  </div>
                </div>
              </div>

              <!-- View 4: Practice -->
              <div class="sd-view" id="viewPractice">
                <div class="sd-view-header">
                  <h3>Daily Python Coding Challenges & Problem Sets</h3>
                  <p>Select any problem to load its code, tests, and description directly into the editor.</p>
                </div>
                <table class="sd-practice-table">
                  <thead>
                    <tr><th>Challenge Title</th><th>Category</th><th>Difficulty</th><th>Acceptance</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Two Sum Optimization</td><td>Algorithms</td><td><span class="sd-tag-easy">Easy</span></td><td>88%</td><td><button class="w-btn primary" type="button" data-practice="0">Solve Challenge</button></td></tr>
                    <tr><td>Filter Even Numbers</td><td>List Comprehension</td><td><span class="sd-tag-easy">Easy</span></td><td>92%</td><td><button class="w-btn" type="button" data-practice="1">Solve Challenge</button></td></tr>
                    <tr><td>Reverse String with Slicing</td><td>Strings</td><td><span class="sd-tag-easy">Easy</span></td><td>95%</td><td><button class="w-btn" type="button" data-practice="2">Solve Challenge</button></td></tr>
                    <tr><td>Recursive Factorial</td><td>Recursion</td><td><span class="sd-tag-medium">Medium</span></td><td>74%</td><td><button class="w-btn" type="button" data-practice="4">Solve Challenge</button></td></tr>
                    <tr><td>Palindrome Verification</td><td>Strings</td><td><span class="sd-tag-medium">Medium</span></td><td>68%</td><td><button class="w-btn" type="button" data-practice="5">Solve Challenge</button></td></tr>
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
                    <div class="sd-mentor-avatar">${SVG.avatarLead}</div>
                    <h4>Dr. Chen</h4>
                    <div class="sd-course-meta">Senior Principal Architect</div>
                    <div class="sd-mentor-tags"><span class="sd-mentor-tag">Python</span><span class="sd-mentor-tag">System Design</span><span class="sd-mentor-tag">Algorithms</span></div>
                    <div style="font-size:0.85rem;color:#ffbd2e;font-weight:700">4.98 (142 Reviews)</div>
                    <button class="w-btn primary" type="button" data-mentor="Dr. Chen">Book 1-on-1 Session</button>
                  </div>
                  <div class="sd-mentor-card">
                    <div class="sd-mentor-avatar">${SVG.avatarUser}</div>
                    <h4>Sarah Jenkins</h4>
                    <div class="sd-course-meta">Senior Software Engineer</div>
                    <div class="sd-mentor-tags"><span class="sd-mentor-tag">Data Structures</span><span class="sd-mentor-tag">Python Core</span><span class="sd-mentor-tag">AsyncIO</span></div>
                    <div style="font-size:0.85rem;color:#ffbd2e;font-weight:700">4.95 (98 Reviews)</div>
                    <button class="w-btn" type="button" data-mentor="Sarah Jenkins">Book 1-on-1 Session</button>
                  </div>
                  <div class="sd-mentor-card">
                    <div class="sd-mentor-avatar">${SVG.avatarDev}</div>
                    <h4>Alex Mercer</h4>
                    <div class="sd-course-meta">Cloud & Machine Learning Engineer</div>
                    <div class="sd-mentor-tags"><span class="sd-mentor-tag">Scientific Python</span><span class="sd-mentor-tag">Pipelines</span><span class="sd-mentor-tag">DevOps</span></div>
                    <div style="font-size:0.85rem;color:#ffbd2e;font-weight:700">4.92 (84 Reviews)</div>
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
                const okIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-inline-end:6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                dlg.querySelector('#sdMentorForm').outerHTML = `<div class="w-msg ok">${okIcon}Booking confirmed with ${esc(name)}! Check your email for session details.</div>`;
            };
        }

        mount.addEventListener('click', e => {
            const courseBtn = e.target.closest('[data-course]');
            const roomBtn = e.target.closest('[data-room]');
            const practiceBtn = e.target.closest('[data-practice]');
            const mentorBtn = e.target.closest('[data-mentor]');

            if (courseBtn) {
                const idx = +courseBtn.dataset.course;
                loadLesson(idx);
                switchTab('dashboard');
                logTerminalMsg(`<span class="ok">Switched to course: ${LESSONS[idx].title}</span>`);
            } else if (roomBtn) {
                const room = roomBtn.dataset.room;
                switchTab('dashboard');
                logTerminalMsg(`<span class="ok">Joined live pair-programming session: ${esc(room)}</span>`);
            } else if (practiceBtn) {
                const idx = +practiceBtn.dataset.practice;
                loadLesson(idx);
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
            for (let i = 1; i <= Math.max(lines, 14); i++) nums += i + '<br>';
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
                const checkMark = isDone ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '';
                html += `<li>
                  <button type="button" data-i="${i}" class="sd-item-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}">
                    <span class="sd-check-icon">${checkMark}</span>
                    <span>${l.title}</span>
                  </button>
                </li>`;
            });
            $('sdLessonsList').innerHTML = html;
        }

        function loadLesson(i) {
            const ed = $('sdEd');
            if (!ed) return;
            cur = i;
            const l = LESSONS[i];
            ed.value = codeCache[l.id] || l.start;
            updateLines();
            renderSide();
            // Highlight tab or create virtual representation
            mount.querySelectorAll('.sd-file-tab').forEach(t => t.classList.remove('active'));
        }

        function switchFile(fname) {
            const ed = $('sdEd');
            if (!ed) return;
            // Save current editor content
            if (activeFile) codeCache[activeFile] = ed.value;
            activeFile = fname;
            ed.value = codeCache[fname] || FILES[fname] || '';
            mount.querySelectorAll('.sd-file-tab').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.file === fname);
            });
            updateLines();
            logTerminalMsg(`<span class="dim">Active buffer switched to ${fname}</span>`);
        }

        $('sdTabs').onclick = e => {
            const btn = e.target.closest('[data-file]');
            if (btn) switchFile(btn.dataset.file);
        };

        // Execution Engine: runs Python code using in-browser transpilation & sandbox runtime
        function runPythonCode(pyCode, targetFn = null, tests = null) {
            return new Promise(resolve => {
                const startTime = performance.now();
                const logs = [];

                const pyFmt = v => {
                    if (v === true) return 'True';
                    if (v === false) return 'False';
                    if (v === null || v === undefined) return 'None';
                    if (Array.isArray(v)) return '[' + v.map(pyFmt).join(', ') + ']';
                    if (typeof v === 'object') return JSON.stringify(v);
                    return String(v);
                };

                const env = {
                    __py_print: (...args) => logs.push(args.map(pyFmt).join(' ')),
                    __py_range: (a, b, step = 1) => {
                        const start = b === undefined ? 0 : a;
                        const stop = b === undefined ? a : b;
                        const res = [];
                        if (step > 0) {
                            for (let i = start; i < stop; i += step) res.push(i);
                        } else if (step < 0) {
                            for (let i = start; i > stop; i += step) res.push(i);
                        }
                        return res;
                    },
                    __py_slice: (val, start, end, step) => {
                        if (typeof val === 'string') {
                            const arr = val.split('');
                            const sliced = env.__py_slice(arr, start, end, step);
                            return sliced.join('');
                        }
                        if (!Array.isArray(val)) return val;
                        let s = start === null ? (step && step < 0 ? val.length - 1 : 0) : start;
                        let e = end === null ? (step && step < 0 ? -1 : val.length) : end;
                        let st = step === null ? 1 : step;
                        if (s < 0) s = Math.max(0, val.length + s);
                        if (e < 0 && end !== null) e = Math.max(0, val.length + e);
                        const res = [];
                        if (st > 0) {
                            for (let i = s; i < Math.min(val.length, e); i += st) res.push(val[i]);
                        } else if (st < 0) {
                            for (let i = s; i > (end === null ? -1 : e); i += st) res.push(val[i]);
                        }
                        return res;
                    },
                    len: v => v ? (v.length !== undefined ? v.length : Object.keys(v).length) : 0,
                    sum: v => Array.isArray(v) ? v.reduce((a, b) => a + b, 0) : 0,
                    max: (...v) => Array.isArray(v[0]) ? Math.max(...v[0]) : Math.max(...v),
                    min: (...v) => Array.isArray(v[0]) ? Math.min(...v[0]) : Math.min(...v),
                    abs: Math.abs,
                    str: String,
                    int: v => parseInt(v, 10),
                    float: v => parseFloat(v),
                    list: v => Array.from(v),
                    range: (a, b, s) => env.__py_range(a, b, s),
                    sorted: v => [...v].sort((a, b) => a - b)
                };

                let js;
                try {
                    js = compilePython(pyCode);
                } catch (ce) {
                    resolve({
                        logs,
                        error: `Traceback (most recent call last):\n  File "${activeFile}", SyntaxError: ${ce.message}`,
                        duration: (performance.now() - startTime).toFixed(1)
                    });
                    return;
                }

                try {
                    if (!targetFn) {
                        const runner = new Function(...Object.keys(env), js);
                        runner(...Object.values(env));
                        resolve({ logs, duration: (performance.now() - startTime).toFixed(1) });
                        return;
                    }

                    // Test runner mode
                    const testJs = js + `\nreturn (typeof ${targetFn} === 'function' ? ${targetFn} : null);`;
                    const runner = new Function(...Object.keys(env), testJs);
                    const fn = runner(...Object.values(env));

                    if (!fn) {
                        resolve({
                            logs,
                            error: `Traceback (most recent call last):\n  File "${activeFile}", NameError: name '${targetFn}' is not defined`,
                            duration: (performance.now() - startTime).toFixed(1)
                        });
                        return;
                    }

                    const testResults = tests.map(([args, exp]) => {
                        let got, err = null;
                        try {
                            got = fn(...args);
                        } catch (ex) {
                            err = String(ex);
                        }
                        const ok = !err && JSON.stringify(got) === JSON.stringify(exp);
                        return { args, exp, got, ok, err };
                    });

                    resolve({
                        logs,
                        testResults,
                        duration: (performance.now() - startTime).toFixed(1)
                    });
                } catch (re) {
                    resolve({
                        logs,
                        error: `Traceback (most recent call last):\n  File "${activeFile}", RuntimeError: ${re.message}`,
                        duration: (performance.now() - startTime).toFixed(1)
                    });
                }
            });
        }

        const show = JSON.stringify;

        $('sdLessonsList').onclick = e => {
            const b = e.target.closest('[data-i]');
            if (b) loadLesson(+b.dataset.i);
        };

        $('sdSample').onclick = () => {
            const l = LESSONS[cur];
            $('sdEd').value = l.sample;
            codeCache[l.id] = l.sample;
            updateLines();
            logTerminalMsg(`<span class="ok">Loaded working solution for '${l.title}'</span>`);
        };

        $('sdEd').addEventListener('input', () => {
            updateLines();
            const ed = $('sdEd');
            if (activeFile) codeCache[activeFile] = ed.value;
            if (LESSONS[cur]) codeCache[LESSONS[cur].id] = ed.value;
        });

        $('sdEd').addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const t = e.target, s = t.selectionStart;
                t.value = t.value.slice(0, s) + '    ' + t.value.slice(t.selectionEnd);
                t.selectionStart = t.selectionEnd = s + 4;
                updateLines();
            }
        });

        // Run Button Execution
        $('sdRun').onclick = async () => {
            const code = $('sdEd').value;
            $('sdOut').innerHTML = `<span class="sd-prompt">$</span> python3 ${activeFile}<br>`;
            const res = await runPythonCode(code);

            let outHtml = '';
            if (res.logs && res.logs.length) {
                outHtml += res.logs.map(line => `<span class="sd-prompt">&gt;&gt;&gt;</span> ${esc(line)}`).join('<br>');
            }
            if (res.error) {
                if (outHtml) outHtml += '<br>';
                outHtml += `<span class="err">${esc(res.error).replace(/\n/g, '<br>')}</span>`;
            } else if (!res.logs.length) {
                outHtml = `<span class="sd-prompt">$</span> Script executed successfully with no output. Use print() to display values.`;
            }

            outHtml += `<br><span class="dim">[Process completed in ${res.duration}ms with exit code ${res.error ? 1 : 0}]</span>`;
            $('sdOut').innerHTML = outHtml;
        };

        // Check Tests Button Execution
        $('sdCheck').onclick = async () => {
            const l = LESSONS[cur];
            const code = $('sdEd').value;
            $('sdOut').innerHTML = `<span class="sd-prompt">$</span> pytest -v test_${l.fn}.py<br>`;
            const res = await runPythonCode(code, l.fn, l.tests);

            if (res.error) {
                $('sdOut').innerHTML = `<span class="sd-prompt">$</span> <span class="err">${esc(res.error).replace(/\n/g, '<br>')}</span>`;
                return;
            }

            const lines = res.testResults.map((t, i) => t.ok
                ? `<span class="ok">[PASS] Test ${i + 1}: ${esc(l.fn)}(${esc(t.args.map(show).join(', '))}) == ${esc(show(t.exp))}</span>`
                : `<span class="err">[FAIL] Test ${i + 1}: Expected ${esc(show(t.exp))}, got ${esc(t.err || show(t.got))}</span>`);

            const allPassed = res.testResults.every(t => t.ok);
            if (allPassed) {
                done[l.id] = true;
                save();
                renderSide();
                lines.push('<span class="ok">All test assertions passed successfully. Module completed and saved!</span>');
            } else {
                lines.push('<span class="err">Some test assertions failed. Review logic or click Hint.</span>');
            }

            lines.push(`<span class="dim">[Test evaluation completed in ${res.duration}ms]</span>`);
            $('sdOut').innerHTML = lines.join('<br>');
        };

        // Initialize with default file
        switchFile('main.py');
        renderSide();
    };
})();
