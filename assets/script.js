// app.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startQuizBtn");
  const target = document.getElementById("quiz");
  const insightSection = document.getElementById("insightText");
  const insightFill = document.getElementById("insightFill");
  const testimonialsSection = document.getElementById("testimonials");
  const testimonialsRowTop = document.getElementById("testimonialsRowTop");
  const testimonialsRowBottom = document.getElementById("testimonialsRowBottom");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  let testimonialsRaf = null;
  let topCurrent = 0;
  let bottomCurrent = 0;
  let topTarget = 0;
  let bottomTarget = 0;
  let topLoopWidth = 0;
  let bottomLoopWidth = 0;
  let topDragOffset = 0;
  let bottomDragOffset = 0;
  let dragStartOffset = 0;
  let activeDragRow = null;
  let isHorizontalDrag = false;
  let dragStartX = 0;
  let dragStartY = 0;

  const updateInsightFill = () => {
    if (!insightSection || !insightFill) return;

    const rect = insightSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const start = viewportHeight * 0.85;
    const end = viewportHeight * 0.25;
    const progress = (start - rect.top) / (start - end);
    const clamped = Math.max(0, Math.min(1, progress));
    insightFill.style.setProperty("--fill", `${clamped * 100}%`);
  };

  const wrapOffset = (value, loopWidth) => {
    if (!loopWidth) return value;
    let wrapped = value % loopWidth;
    if (wrapped > loopWidth / 2) wrapped -= loopWidth;
    if (wrapped < -loopWidth / 2) wrapped += loopWidth;
    return wrapped;
  };

  const normalizeTargetNearCurrent = (target, current, loopWidth) => {
    if (!loopWidth) return target;
    let normalized = target;
    while (normalized - current > loopWidth / 2) normalized -= loopWidth;
    while (normalized - current < -loopWidth / 2) normalized += loopWidth;
    return normalized;
  };

  const setupInfiniteRow = (row) => {
    if (!row) return 0;
    if (row.dataset.loopReady === "true") {
      return Number(row.dataset.loopWidth || 0);
    }

    const cards = Array.from(row.children);
    cards.forEach((card) => row.appendChild(card.cloneNode(true)));

    const loopWidth = row.scrollWidth / 2;
    row.dataset.loopReady = "true";
    row.dataset.loopWidth = String(loopWidth);
    return loopWidth;
  };

  const refreshLoopWidths = () => {
    if (!testimonialsRowTop || !testimonialsRowBottom) return;
    topLoopWidth = setupInfiniteRow(testimonialsRowTop);
    bottomLoopWidth = setupInfiniteRow(testimonialsRowBottom);
    topLoopWidth = testimonialsRowTop.scrollWidth / 2;
    bottomLoopWidth = testimonialsRowBottom.scrollWidth / 2;

    topCurrent = wrapOffset(topCurrent, topLoopWidth);
    bottomCurrent = wrapOffset(bottomCurrent, bottomLoopWidth);
    topTarget = wrapOffset(topTarget, topLoopWidth);
    bottomTarget = wrapOffset(bottomTarget, bottomLoopWidth);
    topDragOffset = wrapOffset(topDragOffset, topLoopWidth);
    bottomDragOffset = wrapOffset(bottomDragOffset, bottomLoopWidth);
  };

  const smoothScrollTo = (destinationY, duration = 850) => {
    const startY = window.scrollY;
    const distance = destinationY - startY;
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);
      updateInsightFill();

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const updateTestimonialsTarget = () => {
    if (!testimonialsSection || !testimonialsRowTop || !testimonialsRowBottom) return;

    const sectionRect = testimonialsSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const sectionProgress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);
    const clampedProgress = Math.max(0, Math.min(1, sectionProgress));
    const isPhone = viewportWidth <= 640;
    const isTablet = viewportWidth <= 1024;
    const movementRange = isPhone ? 90 : isTablet ? 150 : 220;
    const scrollSpeed = isPhone ? 0.012 : isTablet ? 0.02 : 0.03;
    const bottomMultiplier = isPhone ? 0.5 : 0.7;
    const scrollFactor = window.scrollY * scrollSpeed;

    const baseTopTarget = -(clampedProgress * movementRange + scrollFactor);
    const baseBottomTarget = clampedProgress * movementRange + scrollFactor * bottomMultiplier;

    const desiredTop = baseTopTarget + topDragOffset;
    const desiredBottom = baseBottomTarget + bottomDragOffset;

    topTarget = normalizeTargetNearCurrent(desiredTop, topCurrent, topLoopWidth);
    bottomTarget = normalizeTargetNearCurrent(desiredBottom, bottomCurrent, bottomLoopWidth);
  };

  const animateTestimonials = () => {
    if (!testimonialsRowTop || !testimonialsRowBottom) {
      testimonialsRaf = null;
      return;
    }

    const lerpFactor = activeDragRow ? 0.22 : 0.08;
    topCurrent += (topTarget - topCurrent) * lerpFactor;
    bottomCurrent += (bottomTarget - bottomCurrent) * lerpFactor;

    topCurrent = wrapOffset(topCurrent, topLoopWidth);
    bottomCurrent = wrapOffset(bottomCurrent, bottomLoopWidth);

    testimonialsRowTop.style.setProperty("--offset", `${topCurrent}px`);
    testimonialsRowBottom.style.setProperty("--offset", `${bottomCurrent}px`);

    const shouldContinue =
      Math.abs(topTarget - topCurrent) > 0.2 || Math.abs(bottomTarget - bottomCurrent) > 0.2;

    if (shouldContinue) {
      testimonialsRaf = requestAnimationFrame(animateTestimonials);
    } else {
      testimonialsRaf = null;
    }
  };

  const startTestimonialsAnimation = () => {
    updateTestimonialsTarget();
    if (!testimonialsRaf) {
      testimonialsRaf = requestAnimationFrame(animateTestimonials);
    }
  };

  const onTestimonialsPointerDown = (e, rowKey) => {
    const row = rowKey === "top" ? testimonialsRowTop : testimonialsRowBottom;
    if (!row) return;
    activeDragRow = rowKey;
    isHorizontalDrag = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartOffset = rowKey === "top" ? topDragOffset : bottomDragOffset;
    row.classList.add("is-dragging");
  };

  const onTestimonialsPointerMove = (e) => {
    if (!activeDragRow) return;

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;

    if (!isHorizontalDrag) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        return;
      }
      isHorizontalDrag = true;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    if (activeDragRow === "top") {
      topDragOffset = wrapOffset(dragStartOffset + dx, topLoopWidth);
    } else if (activeDragRow === "bottom") {
      bottomDragOffset = wrapOffset(dragStartOffset + dx, bottomLoopWidth);
    }
    startTestimonialsAnimation();
  };

  const onTestimonialsPointerEnd = () => {
    if (!activeDragRow) return;
    if (testimonialsRowTop) testimonialsRowTop.classList.remove("is-dragging");
    if (testimonialsRowBottom) testimonialsRowBottom.classList.remove("is-dragging");
    activeDragRow = null;
    isHorizontalDrag = false;
    startTestimonialsAnimation();
  };

  if (btn && target) {
    btn.addEventListener("click", (e) => {
      if (btn.getAttribute("href") === "#quiz") {
        e.preventDefault();
        smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - 16, 900);
      }
    });
  }

  // Desktop-only inertial wheel smoothing for a softer scroll feel.
  if (!prefersReducedMotion && !isTouchDevice) {
    let currentY = window.scrollY;
    let targetY = currentY;
    let rafId = null;

    const clampTarget = (value) => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(value, maxScroll));
    };

    const animateWheelScroll = () => {
      const delta = targetY - currentY;
      currentY += delta * 0.12;

      if (Math.abs(delta) < 0.35) {
        currentY = targetY;
      }

      window.scrollTo(0, currentY);
      updateInsightFill();
      startTestimonialsAnimation();

      if (Math.abs(targetY - currentY) > 0.35) {
        rafId = requestAnimationFrame(animateWheelScroll);
      } else {
        rafId = null;
      }
    };

    window.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();

        targetY = clampTarget(targetY + e.deltaY);

        if (!rafId) {
          currentY = window.scrollY;
          rafId = requestAnimationFrame(animateWheelScroll);
        }
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      targetY = clampTarget(targetY);
      currentY = clampTarget(currentY);
      startTestimonialsAnimation();
    });
  }

  refreshLoopWidths();
  updateInsightFill();
  startTestimonialsAnimation();

  if (testimonialsRowTop || testimonialsRowBottom) {
    testimonialsRowTop?.addEventListener("pointerdown", (e) => onTestimonialsPointerDown(e, "top"), {
      passive: true,
    });
    testimonialsRowBottom?.addEventListener("pointerdown", (e) => onTestimonialsPointerDown(e, "bottom"), {
      passive: true,
    });
    window.addEventListener("pointermove", onTestimonialsPointerMove, { passive: false });
    window.addEventListener("pointerup", onTestimonialsPointerEnd, { passive: true });
    window.addEventListener("pointercancel", onTestimonialsPointerEnd, { passive: true });
  }

  window.addEventListener(
    "scroll",
    () => {
      updateInsightFill();
      startTestimonialsAnimation();
    },
    { passive: true }
  );
  window.addEventListener("resize", () => {
    refreshLoopWidths();
    updateInsightFill();
    startTestimonialsAnimation();
  });
});
