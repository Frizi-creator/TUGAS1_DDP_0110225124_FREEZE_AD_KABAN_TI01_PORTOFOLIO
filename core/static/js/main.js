document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert alert-success mt-3";
      alertDiv.role = "alert";
      alertDiv.innerHTML = `<strong>Terima kasih, ${name}!</strong> Pesan Anda telah terkirim (Simulasi).`;
      contactForm.appendChild(alertDiv);
      contactForm.reset();

      setTimeout(() => {
        alertDiv.remove();
      }, 3000);
    });
  }
});
