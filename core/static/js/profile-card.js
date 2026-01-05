document.addEventListener("DOMContentLoaded", () => {
  const cardWrapper = document.querySelector(".pc-card-wrapper");
  const cardShell = document.querySelector(".pc-card-shell");

  if (!cardWrapper || !cardShell) return;
  const CONFIG = {
    sensitivity: 5,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    rafId: null,
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const round = (v) => parseFloat(v.toFixed(3));
  const adjust = (v, fMin, fMax, tMin, tMax) =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

  const updateCardStyle = (x, y) => {
    const width = cardShell.clientWidth;
    const height = cardShell.clientHeight;

    const percentX = clamp((100 / width) * x, 0, 100);
    const percentY = clamp((100 / height) * y, 0, 100);

    const centerX = percentX - 50;
    const centerY = percentY - 50;
    const props = {
      "--pointer-x": `${percentX}%`,
      "--pointer-y": `${percentY}%`,
      "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
      "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
      "--pointer-from-center": `${clamp(
        Math.hypot(percentY - 50, percentX - 50) / 50,
        0,
        1
      )}`,
      "--pointer-from-top": `${percentY / 100}`,
      "--pointer-from-left": `${percentX / 100}`,
      "--rotate-x": `${round(-(centerX / 3.5))}deg`,
      "--rotate-y": `${round(centerY / 3.5)}deg`,
    };

    for (const [key, value] of Object.entries(props)) {
      cardWrapper.style.setProperty(key, value);
    }
  };

  const animate = () => {
    const k = 0.1;
    CONFIG.currentX += (CONFIG.targetX - CONFIG.currentX) * k;
    CONFIG.currentY += (CONFIG.targetY - CONFIG.currentY) * k;

    updateCardStyle(CONFIG.currentX, CONFIG.currentY);

    const delta =
      Math.abs(CONFIG.targetX - CONFIG.currentX) +
      Math.abs(CONFIG.targetY - CONFIG.currentY);

    if (delta > 0.1) {
      CONFIG.rafId = requestAnimationFrame(animate);
    } else {
      CONFIG.rafId = null;
    }
  };

  const handleMouseMove = (e) => {
    const rect = cardShell.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    CONFIG.targetX = x;
    CONFIG.targetY = y;

    if (!CONFIG.rafId) {
      CONFIG.rafId = requestAnimationFrame(animate);
    }
  };

  const handleMouseLeave = () => {
    CONFIG.targetX = cardShell.clientWidth / 2;
    CONFIG.targetY = cardShell.clientHeight / 2;

    if (!CONFIG.rafId) {
      CONFIG.rafId = requestAnimationFrame(animate);
    }
  };

  cardShell.addEventListener("mousemove", handleMouseMove);
  cardShell.addEventListener("mouseleave", handleMouseLeave);

  CONFIG.currentX = cardShell.clientWidth / 2;
  CONFIG.currentY = cardShell.clientHeight / 2;
  updateCardStyle(CONFIG.currentX, CONFIG.currentY);
});
