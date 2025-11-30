// Access the sections you want to monitor
const sectionMain = document.getElementById('section-main');
const section1 = document.getElementById('new-section');
const section2 = document.getElementById('new-section-2');
const section3 = document.getElementById('new-section-3');
const section4 = document.getElementById('new-section-4');
const section5 = document.getElementById('new-section-5');
const section6 = document.getElementById('new-section-otherProjects');
const section7 = document.getElementById('contact-section');

// Mapping of sections to their style configurations
const sectionStyles = [
    { section: sectionMain, background: 'var(--white)', text: 'var(--black)', barText: 'var(--white)' },
    { section: section1, background: 'var(--black)', text: 'var(--white)', barText: 'var(--black)' },
    { section: section2, background: 'var(--white)', text: 'var(--black)', barText: 'var(--white)' },
    { section: section3, background: 'var(--black)', text: 'var(--white)', barText: 'var(--black)' },
    { section: section4, background: 'var(--white)', text: 'var(--black)', barText: 'var(--white)' },
    { section: section5, background: 'var(--black)', text: 'var(--white)', barText: 'var(--black)' },
    { section: section6, background: 'var(--white)', text: 'var(--black)', barText: 'var(--white)' },
    { section: section7, background: 'var(--black)', text: 'var(--white)', barText: 'var(--black)' }
];

const visibleNonMain = new Set();

// Create observer BEFORE using it:
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.target !== sectionMain) {
            if (entry.isIntersecting) {
                visibleNonMain.add(entry.target);
            } else {
                visibleNonMain.delete(entry.target);
            }
        }
    });

    applyStyle();
}, { threshold: 0.2 });

// Observe ONLY non-main sections
sectionStyles
    .filter(s => s.section !== sectionMain)
    .forEach(s => observer.observe(s.section));

function applyStyle() {
    const visibleSections = [...visibleNonMain];

    if (visibleSections.length > 0) {
        const center = window.innerHeight / 2;

        // Pick section closest to center
        const target = visibleSections.sort((a, b) => {
            const aCenter = a.getBoundingClientRect().top + a.getBoundingClientRect().height / 2;
            const bCenter = b.getBoundingClientRect().top + b.getBoundingClientRect().height / 2;
            return Math.abs(aCenter - center) - Math.abs(bCenter - center);
        })[0];

        updateNavStyle(target);
    } else {
        // Apply main if near top of page
        if (window.scrollY < window.innerHeight * 0.5) {
            updateNavStyle(sectionMain);
        }
    }
}

function updateNavStyle(section) {
    const data = sectionStyles.find(s => s.section === section);
    if (!data) return;

    document.documentElement.style.setProperty('--navBackground', data.background);
    document.documentElement.style.setProperty('--navText', data.text);
    document.documentElement.style.setProperty('--navBarText', data.barText);
}

// Ensure styling updates smoothly while scrolling
window.addEventListener('scroll', applyStyle);
window.addEventListener('click', applyStyle);