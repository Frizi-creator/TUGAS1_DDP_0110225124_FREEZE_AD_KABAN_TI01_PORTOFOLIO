document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.querySelector(".gooey-nav-container");
  if (!navContainer) return;

  const navList = navContainer.querySelector("ul");
  const listItems = navList.querySelectorAll("li");

  let filterEl = navContainer.querySelector(".effect.filter");
  let textEl = navContainer.querySelector(".effect.text");

  const COLORS = [1, 2, 3, 1, 2];
  const PARTICLE_COUNT = 12;
  const TIME_VARIANCE = 300;
  const ANIMATION_TIME = 600;
  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticleData = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], PARTICLE_COUNT - i, PARTICLE_COUNT),
      end: getXY(d[1] + noise(7), PARTICLE_COUNT - i, PARTICLE_COUNT),
      time: t,
      scale: 1 + noise(0.2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element) => {
    const d = [60, 15];
    const r = 100;
    const bubbleTime = ANIMATION_TIME * 2 + TIME_VARIANCE;

    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = ANIMATION_TIME * 2 + noise(TIME_VARIANCE * 2);
      const p = createParticleData(i, t, d, r);

      element.classList.remove("active");

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");

        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add("point");

        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => {
          element.classList.add("active");
        });
        setTimeout(() => {
          if (particle.parentNode === element) {
            element.removeChild(particle);
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (targetLi) => {
    if (!targetLi || !filterEl || !textEl) return;

    const containerRect = navContainer.getBoundingClientRect();
    const rect = targetLi.getBoundingClientRect();

    const styles = {
      left: `${rect.left - containerRect.left}px`,
      top: `${rect.top - containerRect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    };

    Object.assign(filterEl.style, styles);
    Object.assign(textEl.style, styles);

    const link = targetLi.querySelector("a");
    if (link) textEl.innerText = link.innerText;
  };

  const handleItemClick = (e, li) => {
    updateEffectPosition(li);
    if (filterEl) {
      const oldParticles = filterEl.querySelectorAll(".particle");
      oldParticles.forEach((p) => p.remove());
    }

    if (textEl) {
      textEl.classList.remove("active");
      void textEl.offsetWidth;
      textEl.classList.add("active");
    }

    if (filterEl) {
      makeParticles(filterEl);
    }
  };

  const activeLi = navContainer.querySelector("li.active");

  if (activeLi) {
    updateEffectPosition(activeLi);
    if (textEl) textEl.classList.add("active");
  } else {
    if (textEl) textEl.style.opacity = "0";
  }

  listItems.forEach((li) => {
    li.addEventListener("click", (e) => handleItemClick(e, li));
    li.addEventListener("mouseenter", () => {
      updateEffectPosition(li);
      if (textEl) textEl.style.opacity = "1";
    });
  });

  if (navList) {
    navList.addEventListener("mouseleave", () => {
      const currentActive = navContainer.querySelector("li.active");
      if (currentActive) {
        updateEffectPosition(currentActive);
      }
    });
  }

  window.addEventListener("resize", () => {
    const currentActive = navContainer.querySelector("li.active");
    if (currentActive) updateEffectPosition(currentActive);
  });
});
