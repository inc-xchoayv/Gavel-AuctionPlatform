/* ==========================================================================
   js/login.js — Մուտքի ֆորմա
   ========================================================================== */

const loginForm = document.getElementById("login-form");
loginForm.noValidate = true;   // Անջատում ենք բրաուզերի ստանդարտ «փուչիկները»՝ մեր հաղորդագրությունների համար

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();      // Թույլ չենք տալիս էջը վերաբեռնվի
  clearErrors(loginForm);

  const emailInput = loginForm.elements.email;
  const passInput  = loginForm.elements.password;
  const email    = emailInput.value.trim().toLowerCase();
  const password = passInput.value;

  // 1. Ստուգում ենք դաշտերը
  let ok = true;
  if (email === "") {
    showFieldError(emailInput, "Մուտքագրեք էլ. հասցեն։"); ok = false;
  } else if (!isValidEmail(email)) {
    showFieldError(emailInput, "Էլ. հասցեի ձևաչափը սխալ է (օր.՝ name@example.com)։"); ok = false;
  }
  if (password === "") {
    showFieldError(passInput, "Մուտքագրեք գաղտնաբառը։"); ok = false;
  }
  if (!ok) return;

  // 2. Փնտրում ենք օգտատիրոջը
  let users;
  try {
    users = await Gavel.loadAllUsers();
  } catch (e) {
    showFormAlert(loginForm, "Չհաջողվեց բեռնել տվյալները։ Կայքը բացեք Live Server-ով (տե՛ս README)։");
    return;
  }
  const user = users.find(function (u) { return u.email.toLowerCase() === email; });

  if (!user || user.password !== password) {
    showFormAlert(loginForm, "Էլ. հասցեն կամ գաղտնաբառը սխալ է։");
    return;
  }
  if (user.status === "blocked") {
    showFormAlert(loginForm, "Ձեր հաշիվն արգելափակված է։ Կապվեք ադմինիստրացիայի հետ։");
    return;
  }

  // 3. Հաջողություն՝ բացում ենք սեսիա և ուղարկում ճիշտ էջ
  Gavel.startSession(user);
  Gavel.setFlash("Բարի գալուստ, " + user.firstName + "։");
  const next = new URLSearchParams(window.location.search).get("next");
  const fallback = user.role === "admin" ? "admin-dashboard.html" : "profile.html";
  // next-ը թույլատրում ենք միայն մեր .html էջերի համար (ոչ արտաքին հղումներ)
  window.location.href = (next && /^[a-z0-9-]+\.html$/.test(next)) ? next : fallback;
});

// Դեմո կոճակներ՝ լրացնում են ֆորմը դասախոսի համար
document.querySelectorAll("[data-demo-email]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    loginForm.elements.email.value = btn.dataset.demoEmail;
    loginForm.elements.password.value = btn.dataset.demoPass;
    loginForm.requestSubmit();
  });
});
