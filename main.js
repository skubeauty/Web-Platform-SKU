document.addEventListener("DOMContentLoaded", () => {
  
  // 1. INJECT CUSTOM CURSOR HTML (If missing from the page)
  if (!document.getElementById('cursor')) {
    const curEl = document.createElement('div');
    curEl.className = 'cursor';
    curEl.id = 'cursor';
    document.body.appendChild(curEl);
    
    const ringEl = document.createElement('div');
    ringEl.className = 'cursor-ring';
    ringEl.id = 'cursorRing';
    document.body.appendChild(ringEl);
  }

  // 2. CURSOR ANIMATION LOGIC
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX; 
    my = e.clientY;
    cur.style.left = mx + 'px'; 
    cur.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // 3. CURSOR HOVER EFFECTS
  document.querySelectorAll('a, button, input, textarea, .nav-logo').forEach(el => {
    el.addEventListener('mouseenter', () => { 
      cur.classList.add('hov'); 
      ring.classList.add('hov'); 
    });
    el.addEventListener('mouseleave', () => { 
      cur.classList.remove('hov'); 
      ring.classList.remove('hov'); 
    });
  });

  // 4. NAVIGATION SCROLL EFFECT
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // 5. SCROLL REVEAL ANIMATIONS
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  }

});