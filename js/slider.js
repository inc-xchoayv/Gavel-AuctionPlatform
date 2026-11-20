/* ==========================================================================
   js/slider.js — Առաջարկվող լոտերի ինտերակտիվ սլայդեր (գլխավոր էջ)
   Աջակցում է՝ սլաքներ, պրոգրես-բար ինդիկատորներ, pause hover/touch/focus-ի վրա,
   ստեղնաշար (ArrowLeft / ArrowRight) և մոբայլ swipe (0 inline styles):
   ========================================================================== */

(function () {
  const INTERVAL_MS = 5000;
  const SWIPE_THRESHOLD = 40;

  function initSlider() {
    const root = document.getElementById("recommended-slider");
    if (!root) return;

    const slides = Array.from(root.querySelectorAll(".recommended-card"));
    const bars   = Array.from(root.querySelectorAll(".rec-bar"));
    const prevBtn = root.querySelector(".rec-prev");
    const nextBtn = root.querySelector(".rec-next");
    const counter = root.querySelector(".rec-counter");

    if (slides.length === 0) return;

    let current = 0;
    let timer = null;
    let isPaused = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function render(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        const active = i === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      bars.forEach(function (bar, i) {
        const active = i === current;
        bar.classList.remove("is-active");
        // Reflow trick so the CSS progress bar animation restarts cleanly
        if (active) {
          void bar.offsetWidth;
          bar.classList.add("is-active");
        }
        bar.setAttribute("aria-selected", active ? "true" : "false");
      });

      if (counter) {
        counter.textContent = (current + 1) + " / " + slides.length;
      }
    }

    function startTimer() {
      stopTimer();
      if (isPaused) return;
      timer = setInterval(function () {
        render(current + 1);
      }, INTERVAL_MS);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function pause() {
      isPaused = true;
      root.classList.add("is-paused");
      stopTimer();
    }

    function resume() {
      isPaused = false;
      root.classList.remove("is-paused");
      startTimer();
    }

    function goTo(index) {
      render(index);
      if (!isPaused) startTimer();
    }

    // 1. Prev / Next buttons
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    // 2. Indicator bars click
    bars.forEach(function (bar, i) {
      bar.addEventListener("click", function () { goTo(i); });
    });

    // 3. Pause on hover & keyboard focus
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) resume();
    });

    // 4. Keyboard arrows when focused inside slider
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(current + 1);
      }
    });

    // 5. Touch swipe on mobile
    root.addEventListener("touchstart", function (e) {
      pause();
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    root.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) >= SWIPE_THRESHOLD) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
      resume();
    }, { passive: true });

    // Start at slide 0
    render(0);
    startTimer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlider);
  } else {
    initSlider();
  }
})();
