// Access the sections you want to monitor
const section = document.getElementById('new-section');
const section2 = document.getElementById('new-section-2');
const section3 = document.getElementById('new-section-3');
const section4 = document.getElementById('new-section-4');

// Set up the Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Check which section is in view and update styles accordingly
            if (entry.target === section) {
                document.documentElement.style.setProperty('--navBackground', 'var(--black)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--white)', 'important');
            } else if (entry.target === section2) {
                document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
            } else if (entry.target === section3) {
                document.documentElement.style.setProperty('--navBackground', 'var(--black)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--white)', 'important');
            } else if (entry.target === section4) {
                document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
            }
        }
    });
}, {
    threshold: 0.5  // Trigger when 50% of the section is visible
});

// Start observing each section
observer.observe(section);
observer.observe(section2);
observer.observe(section3);
observer.observe(section4);
