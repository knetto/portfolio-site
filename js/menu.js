// GSAP Animation Logic
const open       = document.querySelector(".container");
const close      = document.querySelector(".close");
const menuLinks  = document.querySelectorAll(".hover-this a");

let bubbleLoop;

var tl = gsap.timeline({
  defaults: { duration: 1, ease: "expo.inOut" }
});

open.addEventListener("click", () => {
  document.querySelector("nav").classList.add("open");
  if (tl.reversed()) {
    tl.play();
    scheduleFirstBubble();
  } else {
   tl.to("nav",             { right: 0, duration: 0 })
  .to("nav",             { height: "100vh" }, "-=.1")
  .to(".close",          { opacity: 1, pointerEvents: "all" }, 0.2)
  .to("nav h2",          { opacity: 1 }, 0.2)
  // Lowered the stagger from 0.2 to 0.1 for a tighter sequence
  .to("nav ul li a",     { opacity: 1, pointerEvents: "all", stagger: 0.1 }, "-=0.6")
  // The "<" symbol tells GSAP: "Start this at the exact same time as the previous animation"
  .to("#theme-toggle",   { opacity: 1, pointerEvents: "all" }, "<");

    scheduleFirstBubble(); // bubble schedule starts after opening
  }
});

close.addEventListener("click", () => {
  document.querySelector("nav").classList.remove("open");
  stopBubbleLoop();
  tl.reverse();
});

menuLinks.forEach(link =>
  link.addEventListener("click", () => {
    stopBubbleLoop();
    tl.reverse();
  })
);

function showBubble() {
  gsap.fromTo("#theme-bubble",
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }
  );
}

function hideBubble() {
  gsap.to("#theme-bubble", {
    scale: 0,
    opacity: 0,
    duration: 0.45,
    ease: "back.in(1.6)"
  });
}

function scheduleFirstBubble() {
  stopBubbleLoop();

  setTimeout(() => {
    showBubble();
    setTimeout(hideBubble, 2000); // stays visible 2s
    bubbleLoop = setInterval(loopBubble, 9000); // 2s show + 7s hide
  }, 3000); // first delay 3s
}

function loopBubble() {
  showBubble();
  setTimeout(hideBubble, 2000); // show 2s then hide 7s (setInterval covers the delay)
}

function stopBubbleLoop() {
  clearInterval(bubbleLoop);
  hideBubble();
}


