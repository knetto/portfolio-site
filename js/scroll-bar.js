let scrollBar = document.getElementById('scroll-bar');
let newSection = document.getElementById('new-section');
let menuSpans = document.querySelectorAll('.menu span');
let mainH2 = document.querySelector('.main-h2');
let textContent = document.querySelector('.text-content');
let imageContent = document.querySelector('.image-content');

// To track scroll direction and trigger point
let lastScrollPosition = 0;
let triggerPoint = window.innerHeight * 0.5;

window.addEventListener('resize', () => {
  triggerPoint = window.innerHeight * 0.5;
});

// Function to apply styles based on scroll position
function updateScrollStyles(scrollPosition) {
  const progress = Math.min(scrollPosition / triggerPoint, 1);

  if (scrollPosition >= triggerPoint) {
    document.documentElement.style.setProperty('--navBackground', 'var(--black)');
    document.documentElement.style.setProperty('--navText', 'var(--white)');

    menuSpans.forEach(span => span.style.backgroundColor = 'var(--black)');
    mainH2.style.color = 'var(--black)';
    scrollBar.style.height = "100vh";

    if (scrollPosition > lastScrollPosition) {
      newSection.style.bottom = "0";
      textContent.style.transform = 'translateY(0)';
      setTimeout(() => {
        imageContent.style.transform = 'translateY(0)';
      }, 200);
    } else {
      newSection.style.bottom = "-100%";
    }
  } else {
    document.documentElement.style.setProperty('--navBackground', 'var(--white)');
    document.documentElement.style.setProperty('--navText', 'var(--black)');

    menuSpans.forEach(span => span.style.backgroundColor = '');
    mainH2.style.color = '';

    scrollBar.style.height = `${progress * 100}vh`;
    newSection.style.bottom = "-100%";
    textContent.style.transform = 'translateY(50px)';
    imageContent.style.transform = 'translateY(400px)';
  }

  lastScrollPosition = scrollPosition;
}

// Scroll listener with debounce
window.addEventListener('scroll', debounce(() => {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  updateScrollStyles(scrollPosition);
}, 50));

// Ensure correct state on page load
window.addEventListener('load', () => {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  updateScrollStyles(scrollPosition);
});
