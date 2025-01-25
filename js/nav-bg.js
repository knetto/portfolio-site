// Access the sections you want to monitor
const sectionMain = document.getElementById('new-section-main');
const section = document.getElementById('new-section');
const section2 = document.getElementById('new-section-2');
const section3 = document.getElementById('new-section-3');
const section4 = document.getElementById('new-section-4');

// Mapping of sections to their style configurations
const sectionStyles = [
    {
        section: section,
        background: 'var(--black)',
        text: 'var(--white)',
        barText: 'var(--black)',
        log: 'Section 1 is in view'
    },
    {
        section: section2,
        background: 'var(--white)',
        text: 'var(--black)',
        barText: 'var(--white)',
        log: 'Section 2 is in view'
    },
    {
        section: section3,
        background: 'var(--black)',
        text: 'var(--white)',
        barText: 'var(--black)',
        log: 'Section 3 is in view'
    },
    {
        section: section4,
        background: 'var(--white)',
        text: 'var(--black)',
        barText: 'var(--white)',
        log: 'Section 4 is in view'
    }
];

// Track the active section in view
let activeSection = null;

// Set up the Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const sectionData = sectionStyles.find(data => data.section === entry.target);
        if (entry.isIntersecting) {
            activeSection = entry.target;
            console.log(sectionData.log);
            document.documentElement.style.setProperty('--navBackground', sectionData.background, 'important');
            document.documentElement.style.setProperty('--navText', sectionData.text, 'important');
            document.documentElement.style.setProperty('--navBarText', sectionData.barText, 'important');
        } else {
            resetStyles();
        }
    });
}, {
    threshold: 0.5
});

// Function to reset styles
function resetStyles() {
    document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
    document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
    document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
}

// Start observing each section
sectionStyles.forEach(sectionData => observer.observe(sectionData.section));

// Console command to check which section is currently in view
console.checkSectionsStatus = function() {
    sectionStyles.forEach((sectionData, index) => {
        const status = (sectionData.section.getBoundingClientRect().top < window.innerHeight && sectionData.section.getBoundingClientRect().bottom > 0) ? 'In view' : 'Out of view';
        console.log(`Section ${index + 1}: ${status}`);
    });
};

// Optionally, add a scroll event to manually check sections
window.addEventListener('scroll', () => {
    const sectionInView = sectionStyles.find(sectionData => {
        const inView = sectionData.section.getBoundingClientRect().top < window.innerHeight && sectionData.section.getBoundingClientRect().bottom > 0;
        if (inView) {
            console.log(sectionData.log);
            document.documentElement.style.setProperty('--navBackground', sectionData.background, 'important');
            document.documentElement.style.setProperty('--navText', sectionData.text, 'important');
            document.documentElement.style.setProperty('--navBarText', sectionData.barText, 'important');
        }
        return inView;
    });
    if (!sectionInView) resetStyles();
});
