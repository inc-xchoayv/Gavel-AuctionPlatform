/* ==========================================================================
   js/form-helpers.js — սխալների ցուցադրում ֆորմաներում (login + register)
   ========================================================================== */

// Ցույց տալ սխալը կոնկրետ դաշտի տակ
function showFieldError(input, message) {
  input.classList.add("is-invalid");
  let error = input.parentElement.querySelector(".form-error");
  if (!error) {
    error = document.createElement("small");
    error.className = "form-error";
    input.insertAdjacentElement("afterend", error);
  }
  error.textContent = message;
}

// Մաքրել ֆորմայի բոլոր սխալները
function clearErrors(form) {
  form.querySelectorAll(".is-invalid").forEach(function (el) { el.classList.remove("is-invalid"); });
  form.querySelectorAll(".form-error").forEach(function (el) { el.remove(); });
  const alert = form.querySelector(".form-alert");
  if (alert) alert.remove();
}

// Ընդհանուր սխալ ֆորմայի վերևում (օր.՝ «սխալ էլ. հասցե կամ գաղտնաբառ»)
function showFormAlert(form, message) {
  const alert = document.createElement("div");
  alert.className = "form-alert";
  alert.textContent = message;
  form.prepend(alert);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
