/**
 * திருக்குறள் 396 — ஊற்றெடுக்கும் அறிவு
 * Interactive Vanilla JavaScript Engine
 */

document.addEventListener("DOMContentLoaded", () => {
  initStarfield();
  initMobileNav();
  initOlaichuvadi();

  // If on kural.html (interactive experience page)
  if (document.querySelector(".experience-main")) {
    initKuralExperience();
  }
});

/* ==========================================================================
   1. விண்மீன் பின்னணி அமைப்பு (STARFIELD GENERATION)
   ========================================================================== */
function initStarfield() {
  const starfield = document.querySelector(".starfield-container");
  if (!starfield) return;

  const starCount = window.innerWidth < 768 ? 45 : 90;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = (Math.random() * 2.2 + 1.2).toFixed(1);
    const duration = (Math.random() * 3 + 2.5).toFixed(2);
    const delay = (Math.random() * 4).toFixed(2);

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty("--duration", `${duration}s`);
    star.style.setProperty("--delay", `${delay}s`);

    fragment.appendChild(star);
  }

  starfield.appendChild(fragment);
}

/* ==========================================================================
   2. கைபேசி வழிகாட்டி மெனு (MOBILE NAVIGATION)
   ========================================================================== */
function initMobileNav() {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", isOpen);
    mobileToggle.innerHTML = isOpen ? "✕" : "☰";
  });

  // Close mobile nav when any link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.innerHTML = "☰";
    });
  });
}

/* ==========================================================================
   3. குறள் 396 ஊடாடும் அனுபவம் (KURAL INTERACTIVE EXPERIENCE ENGINE)
   ========================================================================== */
function initKuralExperience() {
  // DOM Elements
  const header = document.querySelector(".experience-header");
  const centerCard = document.querySelector(".kural-center-card");
  const words = document.querySelectorAll(".kural-word");
  const cards = document.querySelectorAll(".meaning-card");
  const svg = document.getElementById("connection-svg");

  const explorationView = document.getElementById("exploration-view");
  const moralView = document.getElementById("moral-view");
  const storyView = document.getElementById("story-view");

  const nextBtn = document.getElementById("next-step-btn");
  const returnBtn = document.getElementById("return-step-btn");
  const stepDots = document.querySelectorAll(".step-dot");

  let currentState = 0; // 0: Exploration, 1: Moral, 2: Story

  /* ==========================================================================
     PAGE LOAD ANIMATION ORDER (REQUIREMENT 10):
     1. stars (already initialized)
     2. page title
     3. Kural
     4. individual words/phrases
     5. SVG connection lines
     6. meaning cards
     ========================================================================== */
  // 2. Page title
  setTimeout(() => {
    if (header) header.classList.add("revealed");
  }, 250);

  // 3. Central Kural
  setTimeout(() => {
    if (centerCard) centerCard.classList.add("revealed");
  }, 650);

  // 4. Individual words/phrases
  setTimeout(() => {
    words.forEach((word, idx) => {
      setTimeout(() => {
        word.classList.add("revealed");
      }, idx * 100);
    });
  }, 1050);

  // 5. SVG connection lines
  setTimeout(() => {
    initSvgConnections();
  }, 1500);

  // 6. Meaning cards
  setTimeout(() => {
    cards.forEach((card, idx) => {
      setTimeout(() => {
        card.classList.add("revealed");
      }, idx * 120);
    });
  }, 1850);

  /* --- SVG Connection System --- */
  function initSvgConnections() {
    if (!svg || window.innerWidth <= 860) return;

    // Clear previous paths
    svg.innerHTML = "";

    const svgRect = svg.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return;

    svg.setAttribute("viewBox", `0 0 ${svgRect.width} ${svgRect.height}`);

    words.forEach((word) => {
      const idx = word.getAttribute("data-index");
      const card = document.querySelector(`.meaning-card[data-index="${idx}"]`);
      if (!card) return;

      const wordRect = word.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      // Determine anchor point based on position relative to word
      const isCardOnLeft = cardRect.right <= wordRect.left + wordRect.width / 2;

      let startX, startY, endX, endY;

      if (isCardOnLeft) {
        // From left side of word to right edge of card
        startX = wordRect.left - svgRect.left;
        startY = wordRect.top + wordRect.height / 2 - svgRect.top;
        endX = cardRect.right - svgRect.left;
        endY = cardRect.top + cardRect.height / 2 - svgRect.top;
      } else {
        // From right side of word to left edge of card
        startX = wordRect.right - svgRect.left;
        startY = wordRect.top + wordRect.height / 2 - svgRect.top;
        endX = cardRect.left - svgRect.left;
        endY = cardRect.top + cardRect.height / 2 - svgRect.top;
      }

      // Smooth cubic bezier control points
      const dx = (endX - startX) * 0.5;
      const cp1X = startX + dx;
      const cp1Y = startY;
      const cp2X = endX - dx;
      const cp2Y = endY;

      const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("class", "connection-line animated");
      path.setAttribute("data-index", idx);

      // Dash length for smooth drawLine animation
      const length = 1000;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      svg.appendChild(path);
    });
  }

  // Recalculate on window resize with debounce
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (currentState === 0) {
        initSvgConnections();
      }
    }, 150);
  });

  /* --- Word & Meaning Card Highlighting & Interactivity --- */
  function highlightIndex(index, active) {
    if (!index) return;

    const targetWords = document.querySelectorAll(`.kural-word[data-index="${index}"]`);
    const targetCards = document.querySelectorAll(`.meaning-card[data-index="${index}"]`);
    const targetPaths = svg ? svg.querySelectorAll(`.connection-line[data-index="${index}"]`) : [];

    targetWords.forEach((el) => {
      active ? el.classList.add("active") : el.classList.remove("active");
    });

    targetCards.forEach((el) => {
      active ? el.classList.add("active") : el.classList.remove("active");
    });

    targetPaths.forEach((el) => {
      active ? el.classList.add("active") : el.classList.remove("active");
    });
  }

  // Bind mouse and keyboard focus events to words
  words.forEach((word) => {
    const idx = word.getAttribute("data-index");
    word.setAttribute("tabindex", "0");
    word.setAttribute("role", "button");
    word.setAttribute("aria-label", `குறள் சொல்: ${word.innerText.trim()}`);

    word.addEventListener("mouseenter", () => highlightIndex(idx, true));
    word.addEventListener("mouseleave", () => highlightIndex(idx, false));
    word.addEventListener("focus", () => highlightIndex(idx, true));
    word.addEventListener("blur", () => highlightIndex(idx, false));
  });

  // Bind mouse and keyboard focus events to cards
  cards.forEach((card) => {
    const idx = card.getAttribute("data-index");
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("mouseenter", () => highlightIndex(idx, true));
    card.addEventListener("mouseleave", () => highlightIndex(idx, false));
    card.addEventListener("focus", () => highlightIndex(idx, true));
    card.addEventListener("blur", () => highlightIndex(idx, false));
  });

  /* --- 3-State Transition Management --- */
  function updateUIForState(state) {
    currentState = state;

    // Update state indicator dots
    stepDots.forEach((dot, i) => {
      if (i === state) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    if (state === 0) {
      // நிலை 0: குறள் மற்றும் சொற்பொருள் அரங்கம் (EXPLORATION)
      explorationView.classList.remove("hidden-state");
      moralView.classList.add("hidden-state");
      storyView.classList.add("hidden-state");

      nextBtn.style.display = "inline-flex";
      nextBtn.innerHTML = "<span>மேலும் அறியலாம்</span> <span aria-hidden='true'>→</span>";
      returnBtn.classList.remove("visible");

      // Redraw SVG connections after elements become visible
      setTimeout(() => {
        initSvgConnections();
      }, 350);
    } else if (state === 1) {
      // நிலை 1: நெறிமுறை (MORAL)
      explorationView.classList.add("hidden-state");
      moralView.classList.remove("hidden-state");
      storyView.classList.add("hidden-state");

      nextBtn.style.display = "inline-flex";
      nextBtn.innerHTML = "<span>மேலும் அறியலாம்</span> <span aria-hidden='true'>→</span>";
      returnBtn.classList.add("visible");
      returnBtn.innerHTML = "← திரும்புக";
    } else if (state === 2) {
      // நிலை 2: சிறுகதை (STORY)
      explorationView.classList.add("hidden-state");
      moralView.classList.add("hidden-state");
      storyView.classList.remove("hidden-state");

      // Hide next button as per flow requirement
      nextBtn.style.display = "none";
      returnBtn.classList.add("visible");
      returnBtn.innerHTML = "← திரும்புக";
    }

    // Scroll smoothly to top of stage area
    const stage = document.querySelector(".stage-container");
    if (stage) {
      const topOffset = stage.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  }

  // Next Step Button Handler (மேலும் அறியலாம்)
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentState === 0) {
        updateUIForState(1);
      } else if (currentState === 1) {
        updateUIForState(2);
      }
    });
  }

  // Return Step Button Handler (திரும்புக)
  if (returnBtn) {
    returnBtn.addEventListener("click", () => {
      if (currentState === 2) {
        updateUIForState(1);
      } else if (currentState === 1) {
        updateUIForState(0);
      }
    });
  }
}

/* ==========================================================================
   4. ஓலைச்சுவடி 3D திறப்பு அனிமேஷன் (OLAICHUVADI 3D INTERACTIVE ENGINE)
   ========================================================================== */
function initOlaichuvadi() {
  const closedCard = document.getElementById("olaichuvadi-closed");
  const openCard = document.getElementById("olaichuvadi-open");
  const closeBtn = document.getElementById("close-olaichuvadi-btn");

  if (!closedCard || !openCard) return;

  const leafLeft = openCard.querySelector(".leaf-left");
  const leafRight = openCard.querySelector(".leaf-right");

  function openOlaichuvadi() {
    closedCard.style.display = "none";
    openCard.classList.remove("hidden-olaichuvadi");

    if (leafLeft && leafRight) {
      leafLeft.classList.remove("opening-left");
      leafRight.classList.remove("opening-right");

      // Trigger reflow
      void leafLeft.offsetWidth;

      leafLeft.classList.add("opening-left");
      leafRight.classList.add("opening-right");
    }

    openCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function closeOlaichuvadi() {
    openCard.classList.add("hidden-olaichuvadi");
    closedCard.style.display = "block";
    closedCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  closedCard.addEventListener("click", openOlaichuvadi);
  closedCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openOlaichuvadi();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOlaichuvadi);
  }
}

