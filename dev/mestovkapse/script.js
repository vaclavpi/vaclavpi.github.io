document.addEventListener('DOMContentLoaded', function() {
    
    // --- Preloader s animací logo -> název ---
    const preloader = document.querySelector('.preloader');
    const preloaderContent = document.querySelector('.preloader-content');

    if (preloader && preloaderContent) {
        setTimeout(() => {
            preloaderContent.classList.add('switched');
        }, 1500);

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        });
    }

    // --- Změna hlavičky při skrolování ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // --- Animace čísel ve statistikách ---
    const counters = document.querySelectorAll('.counter, .counter-decimal');
    const statsSection = document.querySelector('#stats');

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const isDecimal = counter.classList.contains('counter-decimal');
                    let current = 0;

                    const updateCount = () => {
                        const increment = target / 100; // Rozdělení animace na 100 kroků
                        
                        if (current < target) {
                            current += increment;
                            counter.innerText = isDecimal ? Math.min(current, target).toFixed(1) : Math.ceil(Math.min(current, target));
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = isDecimal ? target.toFixed(1) : target;
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target); // Spustit animaci jen jednou
            }
        });
    };

    if (statsSection) {
        const statsObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
        // ZDE BYLA CHYBA: 'stats-section' opraveno na 'statsSection'
        statsObserver.observe(statsSection); 
    }

    // --- Intersection Observer pro ostatní animace ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));
    
    // --- Aktivní odkaz v navigaci ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    if (sections.length > 0 && navLinks.length > 0 && header) {
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - header.offsetHeight - 50) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href').substring(1) === current) {
                    a.classList.add('active');
                }
            });
        });
    }
});

// --- NOVÉ: Přepínání cenových plánů ---
const planToggle = document.querySelector('.plan-toggle');

if (planToggle) {
    const planButtons = planToggle.querySelectorAll('.plan-btn');
    const pricingCards = document.querySelectorAll('.pricing-card');

    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Získání cílového plánu z data atributu
            const targetPlan = button.dataset.plan;

            // Změna aktivního tlačítka
            planButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Zobrazení správné karty s cenou
            pricingCards.forEach(card => {
                if (card.dataset.plan === targetPlan) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        });
    });
}