/* ==========================================================================
   js/slider.js — Առաջարկվող լոտերի ինտերակտիվ սլայդեր (գլխավոր էջ)
   Պահպանում է սկզբնական սահուն ուղղահայաց (float + fade) անիմացիան՝
   ավելացնելով սլաքներ, պրոգրես-բար, pause hover/touch/focus, ստեղնաշար և swipe:
   ========================================================================== */

(function () {
  const INTERVAL_MS = 4500;
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

    function render(nextIndex) {
      const prev = current;
      current = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.remove("is-active", "is-leaving");
        if (i === current) {
          slide.classList.add("is-active");
          slide.setAttribute("aria-hidden", "false");
        } else {
          if (i === prev && prev !== current) {
            slide.classList.add("is-leaving");
          }
          slide.setAttribute("aria-hidden", "true");
        }
      });

      bars.forEach(function (bar, i) {
        const active = i === current;
        bar.classList.remove("is-active");
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

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    bars.forEach(function (bar, i) {
      bar.addEventListener("click", function () { goTo(i); });
    });

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) resume();
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(current + 1);
      }
    });

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

    render(0);
    startTimer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlider);
  } else {
    initSlider();
  }
})();
