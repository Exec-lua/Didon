const isTouch = ScrollTrigger.isTouch === 1;

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
const closeMenuBtn = headerMenu?.querySelector(".close-menu");
const sliderListItem = document.querySelectorAll(".slider-list-item");
const sliderProgress = document.querySelector(".slider-progress");

if (headerMenu && burgerMenu) {
  function closeMenuPanel() {
    burgerMenu.classList.remove("is-active");
    headerMenu.classList.remove("menu-is-active");
    const app = document.querySelector("#app");
    if (app) app.classList.remove("no-scroll");
    document.body.style.overflow = "";
    document.body.removeAttribute("data-lenis-prevent");
  }

  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("is-active");
    headerMenu.classList.toggle("menu-is-active");
    const app = document.querySelector("#app");
    if (app) app.classList.toggle("no-scroll");
    if (headerMenu.classList.contains("menu-is-active")) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-lenis-prevent", "");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    }
  });

  [headerBackdrop, closeMenuBtn].forEach(el => {
    el?.addEventListener("click", closeMenuPanel);
  });
}

window.addEventListener("scroll", () => {
  if (!headerMenu) return;
  const hero = document.querySelector(".hero-section") || document.querySelector(".catalog-hero");
  if (!hero) return;
  headerMenu.classList.toggle("on-scroll", window.scrollY >= hero.offsetHeight / 2);
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

/* Back to top (mobile): show after scroll, scroll to top on click */
const backToTopBtn = document.querySelector(".back-to-top");
if (backToTopBtn) {
  const scrollThreshold = 400;
  const updateBackToTop = () => {
    const isMobile = window.innerWidth <= 768;
    const scrolled = lenis.scroll;
    if (isMobile && scrolled > scrollThreshold) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };
  lenis.on("scroll", updateBackToTop);
  window.addEventListener("resize", updateBackToTop);
  updateBackToTop();
  backToTopBtn.addEventListener("click", () => {
    lenis.scrollTo(0, { duration: 1.2 });
  });
}

/* =========================
   HOME HERO (INDEX ONLY)
========================= */
const homeHero = document.querySelector(".hero-section");
if (homeHero) {
  gsap.fromTo(
    [".hero-subtitle", ".hero-title span", ".hero-action", ".slider-list-item"],
    { autoAlpha: 0, y: 80 },
    { autoAlpha: 1, y: 0, stagger: 0.15 }
  );

  if (sliderProgress) {
    gsap.fromTo(
      sliderProgress,
      { autoAlpha: 0, y: "100" },
      { autoAlpha: 1, y: "0", delay: 1 }
    );
  }

  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
    },
  })
    .to(".mountains", { y: -300 }, 0)
    .to(".man-standing", { y: -120 }, 0)
    .to(".hero-content", { y: 400, autoAlpha: 0 }, 0);

  gsap.to(".slider-progress-bar", {
    height: "100%",
    ease: "none",
    scrollTrigger: { scrub: 0.3 },
  });
}


//////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#section-01.carousel");
  if (!section) return;

  const nextBtn = section.querySelector(".next");
  const prevBtn = section.querySelector(".prev");
  const carousel = section; // #section-01 with class "carousel"
  const list = section.querySelector(".list");
  const items = Array.from(section.querySelectorAll(".item"));
  const runningTimeBar = section.querySelector(".timeRunning");

  if (!nextBtn || !prevBtn || !list || !items.length || !runningTimeBar) return;

  const TIME_RUNNING = 1500;
  const TIME_AUTO_NEXT = 3500;

  let transitionTimeout;
  let autoNextTimeout;

  const arrowsDiv = section.querySelector(".arrows");
  const progressBarContainer = document.createElement("div");
  progressBarContainer.className = "progress-bar-container";

  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";

  progressBarContainer.appendChild(progressBar);
  arrowsDiv.appendChild(progressBarContainer);

  nextBtn.addEventListener("click", () => handleSliderNavigation("next"));
  prevBtn.addEventListener("click", () => handleSliderNavigation("prev"));

  items.forEach((item, index) => {
    const titleEl = item.querySelector(".title");
    if (titleEl) titleEl.setAttribute("data-item", index + 1);
  });

  autoNextTimeout = setTimeout(() => {
    nextBtn.click();
  }, TIME_AUTO_NEXT);

  resetAnimation();
  afterSlideChange();

  function resetAnimation() {
    runningTimeBar.style.animation = "none";
    // force reflow
    void runningTimeBar.offsetHeight;
    runningTimeBar.style.animation = `runningTime ${
      TIME_AUTO_NEXT / 1000
    }s linear forwards`;
  }

  function handleSliderNavigation(direction) {
    const sliderItems = list.querySelectorAll(".item");

    if (!sliderItems.length) return;

    if (direction === "next") {
      list.appendChild(sliderItems[0]);
      carousel.classList.add("next");
    } else if (direction === "prev") {
      list.prepend(sliderItems[sliderItems.length - 1]);
      carousel.classList.add("prev");
    }

    afterSlideChange();
  }

  function afterSlideChange() {
    const oldSlideNumber = section.querySelector(".slide-number");
    if (oldSlideNumber) oldSlideNumber.remove();

    const sliderItems = Array.from(list.querySelectorAll(".item"));
    if (!sliderItems.length) return;

    const activeItem = parseInt(
      sliderItems[1].querySelector(".title").getAttribute("data-item"),
      10
    );

    const activeIndex = activeItem < 10 ? `0${activeItem}` : `${activeItem}`;

    const div = document.createElement("div");
    div.classList.add("slide-number");
    div.textContent = `${activeIndex}/${sliderItems.length}`;
    arrowsDiv.appendChild(div);

    updateProgressBar();
    resetCarouselState();
  }

  function updateProgressBar() {
    const totalSlides = items.length;
    const sliderItems = Array.from(list.querySelectorAll(".item"));
    if (!sliderItems.length) return;

    const activeItem =
      parseInt(
        sliderItems[0].querySelector(".title").getAttribute("data-item"),
        10
      ) + 1;

    const progressPercentage = (activeItem / totalSlides) * 100;
    progressBar.style.width = `${progressPercentage}%`;
  }

  function resetCarouselState() {
    clearTimeout(transitionTimeout);
    clearTimeout(autoNextTimeout);

    transitionTimeout = setTimeout(() => {
      carousel.classList.remove("next");
      carousel.classList.remove("prev");
    }, TIME_RUNNING);

    autoNextTimeout = setTimeout(() => {
      nextBtn.click();
    }, TIME_AUTO_NEXT);

    resetAnimation();
  }
});


const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));


gsap.to("#section-01", {
  opacity: 1,
  y: 0,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#section-01",
    start: "top 85%",   // when section-01 is just entering
    end: "top 50%",     // fully visible
    scrub: true
  }
});


