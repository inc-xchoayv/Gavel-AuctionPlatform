/* ==========================================================================
   js/login.js — Մուտքի ֆորմա (i18n + ապահով ստուգումներ)
   ========================================================================== */

(function () {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;
  loginForm.noValidate = true;

  function tr(key, fallback) {
    return (typeof I18n !== "undefined") ? I18n.t(key, fallback) : fallback;
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors(loginForm);

    const emailInput = loginForm.elements.email;
    const passInput  = loginForm.elements.password;
    const email    = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    // 1. Ստուգում ենք դաշտերը
    let ok = true;
    if (email === "") {
      showFieldError(emailInput, tr("err_email_required", "Մուտքագրեք էլ. հասցեն։")); ok = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, tr("err_email_invalid", "Էլ. հասցեի ձևաչափը սխալ է (օր.՝ name@example.com)։")); ok = false;
    }
    if (password === "") {
      showFieldError(passInput, tr("err_password_required", "Մուտքագրեք գաղտնաբառը։")); ok = false;
    }
    if (!ok) return;

    // 2. Փնտրում ենք օգտատիրոջը
    let users;
    try {
      users = await Gavel.loadAllUsers();
    } catch (e) {
      showFormAlert(loginForm, tr("err_load_users", "Չհաջողվեց բեռնել տվյալները։ Կայքը բացեք Live Server-ով։"));
      return;
    }
    const user = users.find(function (u) { return u.email.toLowerCase() === email; });

    if (!user || user.password !== password) {
      showFormAlert(loginForm, tr("err_wrong_credentials", "Էլ. հասցեն կամ գաղտնաբառը սխալ է։"));
      return;
    }
    if (user.status === "blocked") {
      showFormAlert(loginForm, tr("err_account_blocked", "Ձեր հաշիվն արգելափակված է։ Կապվեք ադմինիստրացիայի հետ։"));
      return;
    }

    // 3. Հաջողություն՝ բացում ենք սեսիա և ուղարկում ճիշտ էջ
    Gavel.startSession(user);
    Gavel.setFlash(tr("toast_welcome", "Բարի գալուստ, ") + user.firstName + "։");
    const next = new URLSearchParams(window.location.search).get("next");
    const fallback = user.role === "admin" ? "admin-dashboard.html" : "profile.html";
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
})();
