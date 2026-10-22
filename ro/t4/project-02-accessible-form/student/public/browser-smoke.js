const form = document.querySelector("#enrollment");
const summary = document.querySelector("#error-summary");
form.requestSubmit();
await Promise.resolve();
const invalid = !summary.hidden && document.activeElement === summary && document.querySelector("#name").getAttribute("aria-invalid") === "true" && summary.querySelectorAll("a").length === 4;
const labels = [...form.querySelectorAll("input")].every((input) => input.labels?.length > 0);
let linksFocus = true;
for (const link of summary.querySelectorAll("a")) {
  const target = document.getElementById(link.hash.slice(1));
  link.click();
  await new Promise((resolve) => setTimeout(resolve, 0));
  linksFocus &&= Boolean(target) && document.activeElement === target;
}

form.elements.name.value = "Ada Lovelace"; form.elements.email.value = "ada@example.test"; form.querySelector('[name="track"][value="frontend"]').checked = true; form.elements.terms.checked = true;
form.requestSubmit();
await Promise.resolve();
const valid = summary.hidden && document.querySelector("#success").textContent === "Enrolled Ada Lovelace";
document.documentElement.dataset.browserSmoke = invalid && labels && linksFocus && valid ? "pass" : "fail";
document.documentElement.dataset.summaryFocused = String(invalid);

document.documentElement.dataset.summaryLinksFocused = String(linksFocus);
