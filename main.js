"use strict";
document.documentElement.classList.add("js");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#nav-links");
menuToggle.hidden = false;
function closeMenu(restoreFocus = false) {
  const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = 'Menu <span aria-hidden="true">+</span>';
  navigation.classList.remove("is-open");
  if (restoreFocus && wasOpen) menuToggle.focus();
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.innerHTML = open
    ? 'Close <span aria-hidden="true">−</span>'
    : 'Menu <span aria-hidden="true">+</span>';
  navigation.classList.toggle("is-open", open);
});
navigation.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  closeMenu();
  // Move keyboard focus into the requested section before hiding the mobile menu.
  if (target) {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu(true);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav")) closeMenu();
});
const mobileBreakpoint = window.matchMedia("(max-width:700px)");
mobileBreakpoint.addEventListener("change", () => closeMenu());
// Native anchors preserve deep links and browser Back behavior.
const projects = Array.from(document.querySelectorAll(".project"));
document.querySelector(".work-toolbar").hidden = false;
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let count = 0;
    projects.forEach((project) => {
      project.hidden = filter !== "all" && project.dataset.category !== filter;
      if (!project.hidden) count++;
    });
    document
      .querySelectorAll("[data-filter]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    document.querySelector(".result-count").textContent =
      `${count} ${count === 1 ? "project" : "projects"}`;
  });
});
const projectDetails = {
  aura: {
    title: "Aura Tanta",
    category: "Hospitality / Web experience",
    summary:
      "A restaurant experience that connects a strong visual identity to an easy-to-explore menu.",
    features: [
      "A categorized menu covering 18 dishes and drinks.",
      "An interactive shopping bag with quantity controls and item removal.",
      "Responsive navigation, accessible dialogs, and restaurant location details.",
    ],
    note: "This is a frontend ordering demo. The confirmation flow does not send real restaurant orders or process payments.",
    stack: "HTML, CSS, JavaScript",
    links: [
      ["Explore live demo", "https://yahyabar2007.github.io/Aura-resturant/"],
      ["View source code", "https://github.com/yahyabar2007/Aura-resturant"],
    ],
  },
  nova: {
    title: "NovaCare",
    category: "Healthcare / Website & local management app",
    summary:
      "A clinic website with a separate local workspace for the practical details of running a clinic.",
    features: [
      "Appointment requests and doctor availability in the local application.",
      "Patient records, staff roles, and appointment status management.",
      "Invoices, partial payment records, audit history, and local SQLite backups.",
    ],
    note: "The public link is a static website preview. Booking and clinic management require the included local Node.js server; the preview does not accept live appointments or payments.",
    stack: "HTML, CSS, JavaScript, Node.js 24+, SQLite",
    links: [
      ["Preview website", "https://yahyabar2007.github.io/NovaCare/"],
      [
        "Explore application source",
        "https://github.com/yahyabar2007/NovaCare",
      ],
    ],
  },
  lumo: {
    title: "Lumo Store",
    category: "Retail / Shopify storefront",
    summary:
      "A Shopify store for accessories, beauty, and home products, with a distinctive pink brand identity.",
    features: [
      "A cohesive storefront designed around the Lumo identity.",
      "Product collections for accessories, beauty, and home essentials.",
      "Responsive layouts and Shopify theme styling.",
    ],
    note: "The portfolio artwork shows the supplied Lumo brand identity. This is a Shopify project, separate from the GitHub code examples.",
    stack: "Shopify, Liquid, CSS",
    links: [["Visit storefront", "https://lumo-26.myshopify.com/"]],
  },
};
const dialog = document.querySelector(".project-dialog");
let dialogTrigger;
function appendTextElement(parent, tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}
if (typeof dialog.showModal === "function") {
  document.querySelectorAll("[data-project]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const details = projectDetails[button.dataset.project];
      if (!details) return;
      dialogTrigger = button;
      dialog.querySelector("#dialog-title").textContent = details.title;
      dialog.querySelector(".dialog-category").textContent = details.category;
      dialog.querySelector(".dialog-summary").textContent = details.summary;
      const body = dialog.querySelector(".dialog-body");
      body.replaceChildren();
      appendTextElement(body, "h3", "What’s inside");
      const list = appendTextElement(body, "ul", "");
      details.features.forEach((feature) =>
        appendTextElement(list, "li", feature),
      );
      appendTextElement(body, "h3", "Built with");
      appendTextElement(body, "p", details.stack);
      appendTextElement(body, "p", details.note, "dialog-note");
      const links = dialog.querySelector(".dialog-links");
      links.replaceChildren();
      details.links.forEach(([label, url]) => {
        const link = appendTextElement(links, "a", `${label} ↗`);
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      });
      dialog.showModal();
      document.body.classList.add("modal-open");
      dialog.scrollTop = 0;
      dialog.querySelector(".dialog-close").focus();
    });
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (dialogTrigger && !dialogTrigger.closest("[hidden]"))
      dialogTrigger.focus();
  });
}
const form = document.querySelector("#contactForm");
function invalidateDraft() {
  const link = form.querySelector(".prepared-email");
  link.hidden = true;
  link.href = "mailto:yahyabar2007@gmail.com";
  form.querySelector(".form-status").textContent = "";
}
form.addEventListener("input", invalidateDraft);
form.addEventListener("change", invalidateDraft);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(form);
  const name = String(values.get("name")).trim();
  const email = String(values.get("email")).trim();
  const message = String(values.get("message")).trim();
  const status = form.querySelector(".form-status");
  if (!name || !email || !message) {
    status.textContent =
      "Please add your name, email, and a short project description.";
    const invalid = !name
      ? form.elements.name
      : !email
        ? form.elements.email
        : form.elements.message;
    invalid.focus();
    return;
  }
  const type = String(values.get("project-type"));
  const body = `Hi Yahya,\n\n${message}\n\nProject: ${type}\nFrom: ${name}\nEmail: ${email}`;
  const href = `mailto:yahyabar2007@gmail.com?subject=${encodeURIComponent(`${type} — ${name}`)}&body=${encodeURIComponent(body)}`;
  const link = form.querySelector(".prepared-email");
  link.href = href;
  link.hidden = false;
  status.textContent =
    "Your draft is ready. Open the prepared email below, then send it from your email app.";
  link.focus();
});
const copyEmail = document.querySelector(".copy-email");
if (navigator.clipboard && window.isSecureContext) {
  copyEmail.hidden = false;
  copyEmail.addEventListener("click", async () => {
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText("yahyabar2007@gmail.com");
      status.textContent = "Email address copied.";
    } catch {
      status.textContent =
        "Select and copy the email address above, or use the email link.";
    }
  });
}
document.querySelector("#year").textContent = new Date().getFullYear();
