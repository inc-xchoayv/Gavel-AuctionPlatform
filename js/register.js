/* ==========================================================================
   js/register.js — Գրանցման ֆորմա
   ========================================================================== */

const registerForm = document.getElementById("register-form");
registerForm.noValidate = true;

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
  function fail(input, msg) { showFieldError(input, msg); ok = false; }

  if (data.firstName.length < 2) fail(f.firstName, "Անունը պետք է լինի առնվազն 2 տառ։");
  if (data.lastName.length < 2)  fail(f.lastName,  "Ազգանունը պետք է լինի առնվազն 2 տառ։");

  if (data.email === "")             fail(f.email, "Մուտքագրեք էլ. հասցեն։");
  else if (!isValidEmail(data.email)) fail(f.email, "Էլ. հասցեի ձևաչափը սխալ է (օր.՝ name@example.com)։");

  if (data.phone !== "" && !/^\+?[0-9\s-]{8,16}$/.test(data.phone))
    fail(f.phone, "Հեռախոսահամարը սխալ է (օր.՝ +374 91 000000)։");

  if (data.password.length < 8)
    fail(f.password, "Գաղտնաբառը պետք է լինի առնվազն 8 նիշ։");
  else if (!/[A-Za-z]/.test(data.password) || !/[0-9]/.test(data.password))
    fail(f.password, "Գաղտնաբառը պետք է պարունակի և՛ տառ, և՛ թիվ։");

  if (data.password2 !== data.password) fail(f.password2, "Գաղտնաբառերը չեն համընկնում։");

  if (!f.terms.checked) {
    showFormAlert(registerForm, "Գրանցվելու համար պետք է համաձայնել կանոններին։");
    ok = false;
  }
  if (!ok) return;

  // 2. Ստուգում ենք՝ այդ էլ. հասցեով օգտատեր արդեն կա՞
  let users;
  try {
    users = await Gavel.loadAllUsers();
  } catch (e) {
    showFormAlert(registerForm, "Չհաջողվեց բեռնել տվյալները։ Կայքը բացեք Live Server-ով (տե՛ս README)։");
    return;
  }
  if (users.some(function (u) { return u.email.toLowerCase() === data.email; })) {
    showFieldError(f.email, "Այս էլ. հասցեով հաշիվ արդեն գոյություն ունի։");
    return;
  }

  // 3. Պահպանում ենք նոր օգտատիրոջը localStorage-ում («կեղծ բազա»)
  const newUser = {
    id: Date.now(),                    // Պարզ եզակի ID
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,           // ⚠ Միայն ուսումնական նպատակով։ Իրական կայքում՝ երբեք։
    phone: data.phone,
    role: "user",                      // Գրանցվողը միշտ "user" է, ադմին չի կարող դառնալ
    status: "active",
    avatar: null,
    registeredAt: new Date().toISOString().slice(0, 10)
  };
  Gavel.saveRegisteredUser(newUser);

  // 4. Անմիջապես մուտք ենք գործում և տանում Անձնական էջ
  Gavel.startSession(newUser);
  Gavel.setFlash("Գրանցումը հաջողվեց։ Բարի գալուստ, " + newUser.firstName + "։");
  window.location.href = "profile.html";
});
