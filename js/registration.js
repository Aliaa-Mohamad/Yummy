"use strict";

const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("error");

// نفس البيانات اللي استخدمناها في الـ Login
const BIN_ID = "69a2d1c243b1c97be9a6492a";
const API_KEY = "$2a$10$aEr.fC3BTS7ZDuBTSASOP.zrzFXN7aAmAy.4gdn5q2chWkiJaFY1a";

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value.trim();

  errorMsg.textContent = "";
  errorMsg.style.color = "red";
  errorMsg.classList.add("d-none");

  // --- التقييمات الأساسية (Validation) ---
  if (!username || !email || !phone || !password) {
    errorMsg.textContent = "Please fill in all fields";
    errorMsg.classList.remove("d-none");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errorMsg.textContent = "Please enter a valid email address";
    errorMsg.classList.remove("d-none");
    return;
  }

  // --- بداية عملية الربط مع API ---
  try {
    // 1. جلب البيانات الحالية من السيرفر
    const getResponse = await fetch(
      `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
      {
        method: "GET",
        headers: { "X-Master-Key": API_KEY },
      },
    );

    if (!getResponse.ok) throw new Error("Failed to fetch users");

    const data = await getResponse.json();
    let users = data.record.users; // مصفوفة المستخدمين الحالية

    // 2. التأكد من عدم تكرار الإيميل أو اسم المستخدم
    const isExist = users.find(
      (u) => u.email === email || u.username === username,
    );
    if (isExist) {
      errorMsg.textContent = "Email or Username already exists!";
      errorMsg.classList.remove("d-none");
      return;
    }

    // 3. تجهيز المستخدم الجديد
    const newUser = {
      id: crypto.randomUUID().slice(0, 4),
      username,
      email,
      phone,
      password,
      favorites: [],
      lists: [],
    };

    // 4. إضافة المستخدم الجديد للقائمة ورفعها كاملة (PUT)
    users.push(newUser);

    const updateResponse = await fetch(
      `https://api.jsonbin.io/v3/b/${BIN_ID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify({ users: users }),
      },
    );

    if (!updateResponse.ok) throw new Error("Failed to update database");

    // 5. حفظ الجلسة والتوجيه
    form.reset();
    sessionStorage.setItem(
      "loggedUser",
      JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        favorites: [],
        loginAt: new Date().toISOString(),
      }),
    );

    const redirectUrl =
      sessionStorage.getItem("redirectAfterLogin") || "/index.html";
    sessionStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectUrl;
  } catch (error) {
    errorMsg.textContent = "Service unavailable, please try again later";
    errorMsg.classList.remove("d-none");
    console.error(error);
  }
});
