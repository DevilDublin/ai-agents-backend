// General site scripts (menu highlights, animations, etc.)
document.addEventListener("DOMContentLoaded", () => {
  // highlight current page
  const path = window.location.pathname;
  document.querySelectorAll(".link-chip").forEach(link => {
    if (path.includes(link.getAttribute("href"))) link.classList.add("active");
  });
});
