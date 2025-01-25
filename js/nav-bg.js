// Access the sections you want to monitor
const sectionMain = document.getElementById('new-section-main');
const section = document.getElementById('new-section');
const section2 = document.getElementById('new-section-2');
const section3 = document.getElementById('new-section-3');
const section4 = document.getElementById('new-section-4');

// Track the active section in view
let activeSection = null;

// Set up the Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log(`Section: ${entry.target.id} - Is in view: ${entry.isIntersecting}`);

        if (entry.isIntersecting) {
            activeSection = entry.target;  // Update active section when it's in view

            // Update styles based on which section is in view
            if (entry.target === section) {
                console.log('Section 1 is in view');
                document.documentElement.style.setProperty('--navBackground', 'var(--black)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--white)', 'important');
                document.documentElement.style.setProperty('--navBarText', 'var(--black)', 'important');
            } else if (entry.target === section2) {
                console.log('Section 2 is in view');
                document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
                document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
            } else if (entry.target === section3) {
                console.log('Section 3 is in view');
                document.documentElement.style.setProperty('--navBackground', 'var(--black)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--white)', 'important');
                document.documentElement.style.setProperty('--navBarText', 'var(--black)', 'important');
            } else if (entry.target === section4) {
                console.log('Section 4 is in view');
                document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
                document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
                document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
            }
        } else {// Reset active section when it's out of view
            // Optionally, reset to default styles if no section is active
            document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
            document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
            document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
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

// Console command to check which section is currently in view
console.checkSectionsStatus = function() {
    console.log('Current status of sections:');
    console.log(`Section 1: ${section.getBoundingClientRect().top < window.innerHeight && section.getBoundingClientRect().bottom > 0 ? 'In view' : 'Out of view'}`);
    console.log(`Section 2: ${section2.getBoundingClientRect().top < window.innerHeight && section2.getBoundingClientRect().bottom > 0 ? 'In view' : 'Out of view'}`);
    console.log(`Section 3: ${section3.getBoundingClientRect().top < window.innerHeight && section3.getBoundingClientRect().bottom > 0 ? 'In view' : 'Out of view'}`);
    console.log(`Section 4: ${section4.getBoundingClientRect().top < window.innerHeight && section4.getBoundingClientRect().bottom > 0 ? 'In view' : 'Out of view'}`);
};

// Optionally, add a scroll event to manually check sections
window.addEventListener('scroll', () => {
    if (section.getBoundingClientRect().top < window.innerHeight && section.getBoundingClientRect().bottom > 0) {
        console.log('Section 1 is in view');
        document.documentElement.style.setProperty('--navBackground', 'var(--black)', 'important');
        document.documentElement.style.setProperty('--navText', 'var(--white)', 'important');
        document.documentElement.style.setProperty('--navBarText', 'var(--black)', 'important');
    } else if (section2.getBoundingClientRect().top < window.innerHeight && section2.getBoundingClientRect().bottom > 0) {
        console.log('Section 2 is in view');
        document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
        document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
        document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
    } else if (section3.getBoundingClientRect().top < window.innerHeight && section3.getBoundingClientRect().bottom > 0) {
        console.log('Section 3 is in view');
        document.documentElement.style.setProperty('--navBackground', 'var(--black)', 'important');
        document.documentElement.style.setProperty('--navText', 'var(--white)', 'important');
        document.documentElement.style.setProperty('--navBarText', 'var(--black)', 'important');
    } else if (section4.getBoundingClientRect().top < window.innerHeight && section4.getBoundingClientRect().bottom > 0) {
        console.log('Section 4 is in view');
        document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
        document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
        document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
    }else {// Reset active section when it's out of view
      // Optionally, reset to default styles if no section is active
      document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
      document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
      document.documentElement.style.setProperty('--navBarText', 'var(--white)', 'important');
  }
});
