(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const siteHeader = document.querySelector("#site-header");
  const heroLockup = document.querySelector(".hero-lockup");
  const heroWord = document.querySelector("#hero-word");
  const heroDescription = document.querySelector("#hero-description");
  const heroScroll = document.querySelector(".hero-scroll");
  const menuButton = document.querySelector("#menu-button");
  const menuClose = document.querySelector("#menu-close");
  const mobileMenu = document.querySelector("#mobile-menu");
  const main = document.querySelector("main");
  const footer = document.querySelector(".site-footer");

  const sequence = [
    {
      word: "Campaigns",
      description:
        "We guide candidates, committees, businesses, trade associations, unions, nonprofit organizations and individual donors through complex campaign finance laws at the federal, state and local levels."
    },
    {
      word: "Elections",
      description:
        "We advise candidates, campaigns and political organizations on ballot access, election administration, disputes and the rules governing the electoral process."
    },
    {
      word: "Advocacy",
      description:
        "We help corporations, coalitions and advocacy organizations structure political and issue advocacy across jurisdictions."
    },
    {
      word: "Nonprofits",
      description:
        "We counsel nonprofit organizations on the tax, campaign finance and election laws governing political and issue advocacy."
    },
    {
      word: "Ethics",
      description:
        "We advise public officials, organizations and political professionals on lobbying, governmental ethics and related disclosure obligations."
    },
    {
      word: "Enforcement",
      description:
        "We represent clients in audits, investigations and enforcement matters before federal, state and local regulators."
    },
    {
      word: "You",
      description:
        "The Political Law Group advises clients nationwide at the intersection of law, politics and public policy."
    }
  ];

  function setHeaderState() {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 28);
  }

  function setHeroState(state) {
    heroWord.textContent = state.word;
    heroDescription.textContent = state.description;
  }

  function transitionHero(index) {
    if (index >= sequence.length) return;

    heroWord.classList.add("is-exiting");
    heroDescription.classList.add("is-switching");

    window.setTimeout(() => {
      setHeroState(sequence[index]);
      heroWord.classList.remove("is-exiting");
      heroWord.classList.add("is-entering");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heroWord.classList.remove("is-entering");
          heroDescription.classList.remove("is-switching");
        });
      });

      if (index < sequence.length - 1) {
        window.setTimeout(() => transitionHero(index + 1), 2150);
      }
    }, 460);
  }

  function startHero() {
    siteHeader.classList.add("is-ready");
    heroLockup.classList.add("is-ready");
    heroDescription.classList.add("is-ready");
    heroScroll.classList.add("is-ready");

    window.setTimeout(() => {
      [siteHeader, heroLockup, heroDescription, heroScroll].forEach((element) => {
        element.classList.remove("is-ready");
        element.classList.add("has-arrived");
      });
    }, 2100);

    if (reducedMotion.matches) {
      setHeroState(sequence[sequence.length - 1]);
      return;
    }

    window.setTimeout(() => transitionHero(1), 2700);
  }

  function setMenu(open) {
    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    siteHeader.inert = open;
    main.inert = open;
    footer.inert = open;

    if (open) {
      menuClose.focus();
    } else {
      menuButton.focus();
    }
  }

  menuButton.addEventListener("click", () => setMenu(true));
  menuClose.addEventListener("click", () => setMenu(false));
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileMenu.hidden) setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && !mobileMenu.hidden) setMenu(false);
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px" }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  if (heroLockup && heroWord && heroDescription && heroScroll) startHero();
})();
