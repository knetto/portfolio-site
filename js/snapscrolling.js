const sections = document.querySelectorAll('section');
let lastSnappedIndex = null; // Keep track of the last snapped section
let isSnapping = false; // Prevent multiple snaps during animation

// Function to get the closest section based on scroll position
function getClosestSection(scrollPosition) {
  let closestIndex = 0;
  let smallestDiff = Math.abs(scrollPosition - sections[0].offsetTop);

  sections.forEach((section, index) => {
    const diff = Math.abs(scrollPosition - section.offsetTop);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex;
}

// Function to smoothly scroll to a specific section using GSAP
function scrollToSection(index) {
  isSnapping = true; // Set snapping flag to true
  gsap.to(window, {
    duration: 0.6,
    scrollTo: sections[index].offsetTop, // Scroll to the exact section top
    ease: 'power2.out',
    onComplete: () => {
      isSnapping = false; // Reset snapping flag when animation completes
    },
  });
}

// Scroll event listener
window.addEventListener('scroll', function () {
  if (isSnapping) return; // Prevent executing logic while snapping is in progress

  const scrollPosition = window.scrollY;

  // Find the closest section to the current scroll position
  const targetIndex = getClosestSection(scrollPosition);
  const section = sections[targetIndex];
  const sectionTop = section.offsetTop;
  const sectionBottom = sectionTop + section.offsetHeight;

  // Threshold for snapping (50% of the section height for symmetry)
  const threshold = 0.5 * section.offsetHeight;

  // Check if the scroll position is within the snapping range of a section
  if (scrollPosition >= sectionTop - threshold && scrollPosition <= sectionBottom - threshold) {
    if (lastSnappedIndex !== targetIndex) {
      scrollToSection(targetIndex); // Snap to this section
      lastSnappedIndex = targetIndex; // Update the last snapped index
    }
  } else {
    // Reset the snapping state when moving away from the section
    if (lastSnappedIndex === targetIndex) {
      lastSnappedIndex = null;
    }
  }
});
