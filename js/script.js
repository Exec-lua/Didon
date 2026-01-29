/* =========================
   HARD RESET (REFRESH SAFE)
========================= */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

gsap.killTweensOf("*");
ScrollTrigger.getAll().forEach(t => t.kill());
Observer.getAll().forEach(o => o.kill());

gsap.registerPlugin(ScrollTrigger, Observer);

/* =========================
   HEADER / BURGER MENU
========================= */
const headerMenu = document.querySelector(".header");
const burgerMenu = headerMenu?.querySelector(".burger");
const headerBackdrop = headerMenu?.querySelector(".header-backdrop");
const closeMenu = headerMenu?.querySelector(".close-menu");

if (headerMenu && burgerMenu) {
  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("is-active");
    headerMenu.classList.toggle("menu-is-active");
    document.body.classList.toggle("overflow-hidden");
    document.body.setAttribute("data-lenis-prevent", "");
  });

  [headerBackdrop, closeMenu].forEach(el => {
    el?.addEventListener("click", () => {
      burgerMenu.classList.remove("is-active");
      headerMenu.classList.remove("menu-is-active");
      document.body.classList.remove("overflow-hidden");
      document.body.removeAttribute("data-lenis-prevent");
    });
  });
}

window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;
  headerMenu.classList.toggle(
    "on-scroll",
    window.scrollY >= hero.offsetHeight / 2
  );
});

/* =========================
   LENIS
========================= */
const lenis = new Lenis({ smooth: true });
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add(time => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* =========================
   HERO
========================= */
gsap.fromTo(
  [".hero-subtitle", ".hero-title span", ".hero-action", ".slider-list-item"],
  { autoAlpha: 0, y: 80 },
  { autoAlpha: 1, y: 0, stagger: 0.15 }
);

gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "bottom top",
    scrub: 0.5
  }
})
.to(".mountains", { y: -300 }, 0)
.to(".man-standing", { y: -120 }, 0)
.to(".hero-content", { y: 400, autoAlpha: 0 }, 0);

/* =========================
   GSAP SECTIONS (SLIDER)
========================= */
const gsapSections = document.querySelectorAll("#gsap-sections .gsap-panel");
const gsapImages = document.querySelectorAll("#gsap-sections .bg");
const headings = gsap.utils.toArray("#gsap-sections .section-heading");
const outerWrappers = gsap.utils.toArray("#gsap-sections .outer");
const innerWrappers = gsap.utils.toArray("#gsap-sections .inner");

let currentIndex = 0;
let animating = false;
let sectionObserver;

/* INITIAL STATE */
gsap.set(gsapSections, { autoAlpha: 0, zIndex: 0 });
gsap.set(gsapSections[0], { autoAlpha: 1, zIndex: 1 });
gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

function gotoSection(index, direction) {
  if (animating) return;
  if (index < 0 || index >= gsapSections.length) return;

  animating = true;

  const prev = currentIndex;
  currentIndex = index;
  const d = direction === -1 ? -1 : 1;

  const tl = gsap.timeline({
    defaults: { duration: 1, ease: "power2.inOut" },
    onComplete: () => (animating = false)
  });

  if (prev !== index) {
    tl.to(gsapImages[prev], { yPercent: -15 * d })
      .set(gsapSections[prev], { autoAlpha: 0, zIndex: 0 });
  }

  gsap.set(gsapSections[index], { autoAlpha: 1, zIndex: 1 });

  tl.fromTo(
    [outerWrappers[index], innerWrappers[index]],
    { yPercent: i => (i ? -100 * d : 100 * d) },
    { yPercent: 0 },
    0
  )
  .fromTo(gsapImages[index], { yPercent: 15 * d }, { yPercent: 0 }, 0)
  .fromTo(
    headings[index],
    { autoAlpha: 0, yPercent: 80 * d },
    { autoAlpha: 1, yPercent: 0 },
    0.2
  );
}

/* =========================
   OBSERVER (SLIDES CONTROL)
========================= */
function createObserver() {
  sectionObserver = Observer.create({
    target: "#section-01",
    type: "wheel,touch",
    wheelSpeed: -1,
    tolerance: 15,
    dragMinimum: 30,
    preventDefault: true,
    enabled: false,

    onUp: () => {
      if (animating) return;
      gotoSection(currentIndex + 1, 1);
    },

    onDown: () => {
      if (animating) return;
      gotoSection(currentIndex - 1, -1);
    }
  });
}

createObserver();

/* =========================
   PIN + SCROLL CONTROL
========================= */
ScrollTrigger.create({
  trigger: "#section-01",
  start: "top top",
  end: () => "+=" + window.innerHeight * (gsapSections.length - 1),
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,

});

/* =========================
   FINAL BOOT (NO RACE)
========================= */
window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      gotoSection(0, 1);
      ScrollTrigger.refresh(true);
    });
  });
});

gsap.to(".hero-section", {
  opacity: 0.6,
  scrollTrigger: {
    trigger: "#gsap-sections",
    start: "top bottom",
    end: "top top",
    scrub: true
  }
});