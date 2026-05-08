// ==========================================================================
// SKU BEAUTY - MAIN JAVASCRIPT
// ==========================================================================

// ── 1. FORM HANDLERS (Native Mailto) ──
function submitContact(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');

    const name = e.target.querySelector('[name="name"]').value;
    const email = e.target.querySelector('[name="email"]').value;
    const website = e.target.querySelector('[name="website"]') ? e.target.querySelector('[name="website"]').value : '';
    const message = e.target.querySelector('[name="message"]').value;
    
    const subject = encodeURIComponent('SKU Beauty Inquiry from ' + name);
    const body = encodeURIComponent(
        'Name & Company: ' + name + '\n' +
        'Email: ' + email + '\n' +
        (website ? 'Website: ' + website + '\n' : '') +
        '\nMessage:\n' + (message || '(No initial message provided)') + '\n\n' +
        '----------------------------------------\n' +
        'To help us best align with your needs, please tell us what services you are looking for:\n\n' +
        '- \n'
    );

    window.location.href = `mailto:contact@skubeauty.com?subject=${subject}&body=${body}`;
    
    document.getElementById('contact-success').style.display = 'block';
    e.target.reset();
}

function addToNewsletter(e) {
    e.preventDefault();
    console.log("running newsletter");
    const btn = e.target.querySelector('button[type="submit"]');

    const email = e.target.querySelector('[name="email"]').value;
    const subject = encodeURIComponent("Newsletter Signup - The SKU Brief");

    const body = encodeURIComponent(
        'Please add me to The SKU Brief newsletter.\n\n' +
        `Email: ${email}\n\n` +
        '----------------------------------------\n' +
        'To help us send you the most relevant insights, let us know what topics you are most interested in:\n\n' +
        '- \n'
    );

    window.location.href = `mailto:info@skubeauty.com?subject=${subject}&body=${body}`;

    e.target.reset();
    btn.innerHTML = 'Joined ✓';
}

window.submitContact = submitContact;
window.addToNewsletter = addToNewsletter;


// ── 2. CURSOR LOGIC ──
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

if (cur && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
    (function loop() { rx += (mx - rx) * .11; ry += (my - ry) * .11; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(loop); })();
    document.querySelectorAll('a,button,input,textarea').forEach(el => {
        el.addEventListener('mouseenter', () => { cur.classList.add('hov'); ring.classList.add('hov'); });
        el.addEventListener('mouseleave', () => { cur.classList.remove('hov'); ring.classList.remove('hov'); });
    });
}

// ── 3. NAV DROPDOWN CLICK TOGGLE ──
document.querySelectorAll('.nav-item > button[aria-haspopup]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        const item = btn.closest('.nav-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});
document.addEventListener('click', () => {
    document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
});
document.querySelectorAll('.nav-dd-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
    });
});

// ── 4. SMOOTH SCROLL FOR SAFARI ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

// ── 5. STICKY NAV ──
const nav = document.getElementById('nav') || document.getElementById('main-nav');
if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });
}

// ── 6. SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: .08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal').forEach(r => obs.observe(r));

// ── 7. CASE STUDY VISIBILITY TOGGLE ──
const SHOW_CASE_STUDIES = true;
(function () {
    const casesSection = document.getElementById('cases');
    const casesNavLinks = document.querySelectorAll('a[href="#cases"], a[href="index.html#cases"]');
    if (!SHOW_CASE_STUDIES) {
        if (casesSection) casesSection.style.display = 'none';
        casesNavLinks.forEach(function (link) { link.parentElement.style.display = 'none'; });
    }
})();

// ── 8. HERO DIAMOND PARALLAX ──
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const gem = document.getElementById('hero-gem');
    if (!gem) return;

    const facets = [
        { el: document.getElementById('gem-top'), nx: 0.25, ny: -1.0, base: .04, max: .22 },
        { el: document.getElementById('gem-right'), nx: 1.0, ny: 0.25, base: .07, max: .28 },
        { el: document.getElementById('gem-left'), nx: -1.0, ny: -0.25, base: .10, max: .32 },
        { el: document.getElementById('gem-bot'), nx: -0.25, ny: 1.0, base: .06, max: .24 },
    ];
    if (facets.some(f => !f.el)) return;

    let mx = 0.5, my = 0.5;
    let tx = 0, ty = 0;
    let idleT = 0;
    let ticking = false;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function norm(x, y) { const m = Math.sqrt(x * x + y * y); return m ? [x / m, y / m] : [0, 0]; }

    function applyLighting() {
        const dcx = 0.78, dcy = 0.52;
        const lx = mx - dcx, ly = my - dcy;
        const [nx, ny] = norm(lx, ly);
        facets.forEach(f => {
            const dot = clamp(nx * f.nx + ny * f.ny, 0, 1);
            const op = f.base + dot * (f.max - f.base);
            f.el.style.fill = `rgba(46,64,119,${op.toFixed(3)})`;
        });
    }

    function applyParallax() {
        const tgtX = (mx - 0.5) * -22;
        const tgtY = (my - 0.5) * -14;
        tx += (tgtX - tx) * 0.07;
        ty += (tgtY - ty) * 0.07;
        gem.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)`;
        return Math.abs(tgtX - tx) > 0.1 || Math.abs(tgtY - ty) > 0.1;
    }

    function tick() {
        applyLighting();
        const still = !applyParallax();
        ticking = !still;
        if (!still) requestAnimationFrame(tick);
    }

    function idleShimmer() {
        if (!ticking) {
            idleT += 0.004;
            facets.forEach((f, i) => {
                const pulse = f.base + (Math.sin(idleT + i * Math.PI * 0.5) * 0.5 + 0.5) * (f.max - f.base) * 0.18;
                f.el.style.fill = `rgba(46,64,119,${pulse.toFixed(3)})`;
            });
        }
        requestAnimationFrame(idleShimmer);
    }
    idleShimmer();

    hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width;
        my = (e.clientY - r.top) / r.height;
        if (!ticking) { ticking = true; requestAnimationFrame(tick); }
    });

    hero.addEventListener('mouseleave', () => {
        mx = 0.5; my = 0.5;
        if (!ticking) { ticking = true; requestAnimationFrame(tick); }
    });
})();