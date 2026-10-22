import { handleSubmission } from "./form-validation.js";

const form = document.querySelector("#enrollment");
const summary = document.querySelector("#error-summary");
const success = document.querySelector("#success");
const fields = ["name", "email", "track", "terms"];

function fieldControls(field) {
  const controls = form.elements.namedItem(field);
  return controls instanceof RadioNodeList ? controls : [controls];
}

function setErrors(errors) {
  // Mirror each validation result next to its field and in the summary list.
  for (const field of fields) {
    document.querySelector(`#${field}-error`).textContent = errors[field] ?? "";

    for (const input of fieldControls(field)) {
      input?.setAttribute("aria-invalid", String(Boolean(errors[field])));
    }
  }

  summary.hidden = !Object.keys(errors).length;
  summary.querySelector("ul").replaceChildren(
    ...Object.entries(errors).map(([field, message]) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${field}`;
      link.textContent = message;
      item.append(link);
      return item;
    }),
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);

  handleSubmission(
    {
      name: data.get("name"),
      email: data.get("email"),
      track: data.get("track"),
      terms: data.get("terms") !== null,
    },
    {
      setErrors,
      focusSummary: () => summary.focus(),
      submit: (values) => {
        success.textContent = `Enrolled ${values.name}`;
        form.reset();
      },
    },
  );
});
