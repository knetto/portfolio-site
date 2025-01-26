// // Ensure GSAP and ScrollToPlugin are loaded
// if (!window.gsap) {
//   console.error('GSAP is not loaded!');
// }

// const sections = document.querySelectorAll('section');
// let lastSnappedIndex = null; // Keep track of the last snapped section
// let isSnapping = false; // Prevent multiple snaps during animation
// let isScrolling = false; // Prevent multiple triggers during scrolling

// // Function to get the closest section based on scroll position
// function getClosestSection(scrollPosition) {
//   let closestIndex = 0;
//   let smallestDiff = Math.abs(scrollPosition - sections[0].offsetTop);

//   sections.forEach((section, index) => {
//     const diff = Math.abs(scrollPosition - section.offsetTop);
//     if (diff < smallestDiff) {
//       smallestDiff = diff;
//       closestIndex = index;
//     }
//   });

//   return closestIndex;
// }

// // Function to smoothly scroll to a specific section using GSAP
// function scrollToSection(index) {
//   if (isSnapping) return; // If currently snapping, don't trigger another scroll

//   isSnapping = true; // Set snapping flag to true
//   gsap.to(window, {
//     duration: 0.6,
//     scrollTo: sections[index].offsetTop, // Scroll to the exact section top
//     ease: 'power2.out',
//     onComplete: () => {
//       isSnapping = false; // Reset snapping flag when animation completes
//     },
//   });
// }

// // Throttle function to limit the number of times scroll event logic runs
// function throttle(func, delay) {
//   if (!isScrolling) {
//     func();
//     isScrolling = true;
//     setTimeout(() => {
//       isScrolling = false;
//     }, delay);
//   }
// }

// // Scroll event listener with throttling
// window.addEventListener('scroll', function () {
//   throttle(() => {
//     const scrollPosition = window.scrollY;

//     // Find the closest section to the current scroll position
//     const targetIndex = getClosestSection(scrollPosition);
//     const section = sections[targetIndex];
//     const sectionTop = section.offsetTop;
//     const sectionBottom = sectionTop + section.offsetHeight;

//     // Set dynamic snapping threshold based on section's height (50% of section height)
//     const threshold = 0.5 * section.offsetHeight;

//     // Check if the scroll position is within the snapping range of a section
//     if (scrollPosition >= sectionTop - threshold && scrollPosition <= sectionBottom - threshold) {
//       if (lastSnappedIndex !== targetIndex) {
//         scrollToSection(targetIndex); // Snap to this section
//         lastSnappedIndex = targetIndex; // Update the last snapped index
//       }
//     } else {
//       // Reset the snapping state when moving away from the section
//       if (lastSnappedIndex === targetIndex) {
//         lastSnappedIndex = null;
//       }
//     }
//   }, 50); // Limit scroll checks to every 50ms
// });
