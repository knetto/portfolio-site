// GSAP Animation Logic
const open       = document.querySelector(".container");
const close      = document.querySelector(".close");
const menuLinks  = document.querySelectorAll(".hover-this a");
var   tl         = gsap.timeline({ defaults: { duration: 1, ease: "expo.inOut" } });

open.addEventListener("click", () => {
  if (tl.reversed()) {
    tl.play();
  } else {
    tl.to("nav",             { right: 0,             duration: 0 })
      .to("nav",             { height: "100vh" },    "-=.1")
      .to("nav ul li a",     { opacity: 1, pointerEvents: "all", stagger: .2 }, "-=.8")
      .to(".close",          { opacity: 1, pointerEvents: "all" },           "-=.8")
      .to("nav h2",          { opacity: 1 },                             "-=1");
  }
});

close.addEventListener("click", () => {
  tl.reverse();
});

// ← NEW: close the menu when any link is clicked
menuLinks.forEach(link =>
  link.addEventListener("click", () => {
    tl.reverse();
  })
);