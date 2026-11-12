(() => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('nav-links');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Header border once scrolled
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile menu
    toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.classList.toggle('open', !open);
    });
    links.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            toggle.setAttribute('aria-expanded', 'false');
            links.classList.remove('open');
        }
    });

    // Footer year
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    if (!('IntersectionObserver' in window)) return;

    // Reveal-on-scroll
    if (!reduceMotion) {
        const revealables = document.querySelectorAll('.section-head, .card, .tl-item, .about-text, .pbu-text, .pbu-panel, .jerry-frame, .jerry-text, .contact-inner');
        revealables.forEach((el) => el.classList.add('reveal'));
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealables.forEach((el) => io.observe(el));
    }

    // Active nav link
    const sections = [...document.querySelectorAll('main section[id]')];
    const navMap = new Map([...links.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute('href').slice(1), a]));
    const navIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const a = navMap.get(entry.target.id);
            if (!a) return;
            if (entry.isIntersecting) {
                navMap.forEach((x) => x.classList.remove('active'));
                a.classList.add('active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIO.observe(s));

    // Play the RoboPianist preview only while visible
    const video = document.querySelector('.card-media video');
    if (video && !reduceMotion) {
        const vIO = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }, { threshold: 0.35 });
        vIO.observe(video);
    }
})();
