"use strict";

const form = document.getElementById("signupForm");
const errorMsg = document.getElementById("error");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value.trim();

  errorMsg.textContent = "";
  errorMsg.style.color = "red";
  errorMsg.classList.add("d-none");

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

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordPattern.test(password)) {
    errorMsg.textContent =
      "Password must be at least 6 characters, include uppercase, lowercase letters and a number";
    errorMsg.classList.remove("d-none");
    return;
  }

  const newUser = {
    id: crypto.randomUUID().slice(0, 4),
    username,
    email,
    phone,
    password,
    favorites: [],
    lists: [],
  };

  try {
    const checkResponse = await fetch(
      `http://localhost:5501/users?email=${email}`,
    );
    const existingUsers = await checkResponse.json();

    if (existingUsers.length > 0) {
      errorMsg.textContent = "This email is already registered!";
      errorMsg.classList.remove("d-none");
      return;
    }

    const response = await fetch("http://localhost:5501/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) throw new Error("Failed to register");

    form.reset();
    sessionStorage.setItem(
      "loggedUser",
      JSON.stringify({
        id: newUser.id,
        username: newUser.username,
        favorites: [],
        loginAt: new Date().toISOString(),
      })
    );
    
    
    const redirectUrl = sessionStorage.getItem("redirectAfterLogin") || "/index.html";
    sessionStorage.removeItem("redirectAfterLogin");
    window.location.href = redirectUrl;
    
  } catch (error) {
    errorMsg.textContent = "Something went wrong, try again later";
    errorMsg.classList.remove("d-none");
  }
});
