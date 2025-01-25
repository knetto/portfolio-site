// Get references to your sections
const newSection2 = document.getElementById('new-section-2');

// Create an IntersectionObserver to track when the second section is in view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log('Section in view:', entry.isIntersecting); // Debugging log
    
    if (entry.isIntersecting && entry.intersectionRatio > 0.95) {
      // When #new-section-2 is in view
      document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
      document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
    } else {
      // When #new-section-2 is not in view or not more than 50% in view, reset to default
      document.documentElement.style.setProperty('--navBackground', 'var(--white)', 'important');
      document.documentElement.style.setProperty('--navText', 'var(--black)', 'important');
    }
  });
}, {
  threshold: 0.95  // Trigger when more than 95% of the section is visible
});

// Start observing the second section
observer.observe(newSection2);
