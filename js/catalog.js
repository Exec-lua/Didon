// Catalog Page JavaScript (filters + luxury GSAP motion)

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector(".catalog-hero");
  const marquee = document.querySelector(".marquee-section");
  const filters = document.querySelector(".catalog-filters");
  const grid = document.querySelector(".catalog-grid");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const catalogItems = Array.from(document.querySelectorAll(".catalog-item"));

  /* =========================
     GSAP: PAGE TRANSITIONS
  ========================= */
  if (window.gsap && window.ScrollTrigger) {
    // Hero entrance
    gsap.fromTo(
      [".catalog-subtitle", ".catalog-title", ".catalog-description"],
      { autoAlpha: 0, y: 26, filter: "blur(6px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.08,
      }
    );

    // Header blends into the page; navbar shadow should remain visible
    if (header && navbar && hero) {
      // keep navbar shadow visible from the start
      gsap.set(header, { backgroundColor: "rgba(92,26,26,0)", backdropFilter: "blur(0px)" });
      gsap.set(navbar, { boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15), inset 0 -1px 0 rgba(255, 255, 255, 0.15)" });

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        onLeave: () => {
          gsap.to(header, { backgroundColor: "rgba(92,26,26,0.28)", backdropFilter: "blur(20px)", duration: 0.45, ease: "power2.out" });
        },
        onEnterBack: () => {
          gsap.to(header, { backgroundColor: "rgba(92,26,26,0)", backdropFilter: "blur(0px)", duration: 0.45, ease: "power2.out" });
        },
      });
    }

    // Marquee reveal (luxury: soft blur + lift)
    if (marquee) {
      gsap.fromTo(
        marquee,
        { autoAlpha: 0, y: 24, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: marquee,
            start: "top 85%",
            end: "top 55%",
            scrub: false,
            once: true,
          },
        }
      );
    }

    // Filters + grid reveal
    if (filters) {
      gsap.fromTo(
        filters,
        { autoAlpha: 0, y: 18, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: filters,
            start: "top 85%",
            once: true,
          },
        }
      );
    }

    if (grid && catalogItems.length) {
      gsap.fromTo(
        catalogItems,
        { autoAlpha: 0, y: 18, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }

  /* =========================
     FILTERS (WORK + GSAP IN/OUT)
  ========================= */
  function showItem(item) {
    item.classList.remove("hide");
    item.style.display = ""; /* restore so grid layout and GSAP can use it */
    if (window.gsap) {
      gsap.killTweensOf(item); /* avoid conflicts with scroll animation */
      gsap.fromTo(
        item,
        { autoAlpha: 0, y: 14, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    } else {
      item.style.opacity = "1";
      item.style.visibility = "visible";
    }
  }

  function hideItem(item) {
    if (window.gsap) {
      gsap.killTweensOf(item);
      gsap.to(item, {
        autoAlpha: 0,
        y: 10,
        scale: 0.98,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          item.classList.add("hide");
          item.style.display = "none"; /* collapse layout so grid reflows */
        },
      });
    } else {
      item.classList.add("hide");
      item.style.display = "none";
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      if (!filter) return;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      catalogItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        const matches = filter === "all" || category === filter;
        if (matches) showItem(item);
        else hideItem(item);
      });
    });
  });
});

