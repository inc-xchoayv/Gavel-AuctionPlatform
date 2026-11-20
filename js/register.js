/* ==========================================================================
   js/register.js — Գրանցման ֆորմա (i18n + ապահով ստուգումներ)
   ========================================================================== */

(function () {
  const registerForm = document.getElementById("register-form");
  if (!registerForm) return;
  registerForm.noValidate = true;

  function tr(key, fallback) {
    return (typeof I18n !== "undefined") ? I18n.t(key, fallback) : fallback;
  }

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors(registerForm);

    const f = registerForm.elements;
    const data = {
      firstName: f.firstName.value.trim(),
      lastName:  f.lastName.value.trim(),
      email:     f.email.value.trim().toLowerCase(),
      phone:     f.phone.value.trim(),
      password:  f.password.value,
      password2: f.password2.value
    };

    // 1. Ստուգումներ — յուրաքանչյուր սխալ իր դաշտի տակ
    let ok = true;
    function fail(input, key, fallback) { showFieldError(input, tr(key, fallback)); ok = false; }

    if (data.firstName.length < 2) fail(f.firstName, "err_first_name_short", "Անունը պետք է լինի առնվազն 2 տառ։");
    if (data.lastName.length < 2)  fail(f.lastName,  "err_last_name_short",  "Ազգանունը պետք է լինի առնվազն 2 տառ։");

    if (data.email === "")              fail(f.email, "err_email_required", "Մուտքագրեք էլ. հասցեն։");
    else if (!isValidEmail(data.email)) fail(f.email, "err_email_invalid",  "Էլ. հասցեի ձևաչափը սխալ է (օր.՝ name@example.com)։");

    if (data.phone !== "" && !/^\+?[0-9\s-]{8,16}$/.test(data.phone))
      fail(f.phone, "err_phone_invalid", "Հեռախոսահամարը սխալ է (օր.՝ +374 91 000000)։");

    if (data.password.length < 8)
      fail(f.password, "err_password_short", "Գաղտնաբառը պետք է լինի առնվազն 8 նիշ։");
    else if (!/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password))
      fail(f.password, "err_password_weak", "Գաղտնաբառը պետք է պարունակի և՛ տառ, և՛ թիվ։");

    if (data.password2 !== data.password) fail(f.password2, "err_password_mismatch", "Գաղտնաբառերը չեն համընկնում։");

    if (!f.terms.checked) {
      showFormAlert(registerForm, tr("err_terms_required", "Գրանցվելու համար պետք է համաձայնել կանոններին։"));
      ok = false;
    }
    if (!ok) return;

    // 2. Ստուգում ենք՝ այդ էլ. հասցեով օգտատեր արդեն կա՞
    let users;
    try {
      users = await Gavel.loadAllUsers();
    } catch (e) {
      showFormAlert(registerForm, tr("err_load_users", "Չհաջողվեց բեռնել տվյալները։ Կայքը բացեք Live Server-ով։"));
      return;
    }
    if (users.some(function (u) { return u.email.toLowerCase() === data.email; })) {
      showFieldError(f.email, tr("err_email_exists", "Այս էլ. հասցեով հաշիվ արդեն գոյություն ունի։"));
      return;
    }

    // 3. Պահպանում ենք նոր օգտատիրոջը localStorage-ում («կեղծ բազա»)
    const newUser = {
      id: Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password, // WARNING: Only for coursework demo; never store plain passwords in production.
      phone: data.phone,
      role: "user",
      status: "active",
      avatar: null,
      registeredAt: new Date().toISOString().slice(0, 10)
    };
    Gavel.saveRegisteredUser(newUser);

    // 4. Անմիջապես մուտք ենք գործում և տանում Անձնական էջ
    Gavel.startSession(newUser);
    Gavel.setFlash(tr("toast_register_success", "Գրանցումը հաջողվեց։ Բարի գալուստ, ") + newUser.firstName + "։");
    window.location.href = "profile.html";
  });
})();
