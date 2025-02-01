// Section 3 logic (existing)
gsap.registerPlugin(ScrollTrigger);

// Section 3
const section3Content = document.querySelector('.new-section-3-content');
const extraScrollWidth3 = window.innerWidth * 0.05;

gsap.to(section3Content, {
    x: () => -(section3Content.scrollWidth + extraScrollWidth3 - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
        trigger: '#new-section-3',
        start: 'top top',
        end: () => '+=' + (section3Content.scrollWidth + extraScrollWidth3),
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
            const percentage = self.progress * -100;
            gsap.to("#new-section-3 .image", {
                objectPosition: `${100 + percentage}% center`,
                duration: 0.1,
            });
        }
    }
});

// Section 4 - New code
const section4Content = document.querySelector('.new-section-4-content');
const extraScrollWidth4 = window.innerWidth * 0.05;

gsap.to(section4Content, {
    x: () => -(section4Content.scrollWidth + extraScrollWidth4 - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
        trigger: '#new-section-4',
        start: 'top top',
        end: () => '+=' + (section4Content.scrollWidth + extraScrollWidth4),
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
            const percentage = self.progress * -100;
            gsap.to("#new-section-4 .image", {
                objectPosition: `${100 + percentage}% center`,
                duration: 0.1,
            });
        }
    }
});

// Section 4 - New code
const section5Content = document.querySelector('.new-section-5-content');
const extraScrollWidth5 = window.innerWidth * 0.05;

gsap.to(section5Content, {
    x: () => -(section5Content.scrollWidth + extraScrollWidth4 - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
        trigger: '#new-section-5',
        start: 'top top',
        end: () => '+=' + (section5Content.scrollWidth + extraScrollWidth4),
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
            const percentage = self.progress * -100;
            gsap.to("#new-section-5 .image", {
                objectPosition: `${100 + percentage}% center`,
                duration: 0.1,
            });
        }
    }
});