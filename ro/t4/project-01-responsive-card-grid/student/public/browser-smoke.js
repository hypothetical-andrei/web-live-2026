const grid = document.querySelector(".card-grid");
const header = document.querySelector(".site-header");
const card = document.querySelector(".card");
const link = card.querySelector("a");
link.focus();
const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length;
const checks = { columns, headerFlex: getComputedStyle(header).display === "flex", cardFlex: getComputedStyle(card).display === "flex", noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth, focusVisible: parseFloat(getComputedStyle(link).outlineWidth) >= 3, reducedMotion: !matchMedia("(prefers-reduced-motion: reduce)").matches || getComputedStyle(link).transitionDuration.split(",").every((value) => parseFloat(value) === 0) };
document.documentElement.dataset.columns = String(columns);
document.documentElement.dataset.viewport = String(innerWidth);
document.documentElement.dataset.browserSmoke = Object.values(checks).every(Boolean) ? "pass" : "fail";

document.documentElement.dataset.reducedMotion = String(matchMedia("(prefers-reduced-motion: reduce)").matches);
