function updateGlobalNavbar() {
  const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

  // Desktop
  const desktopUserProfile = document.querySelector(".d-lg-flex.userProfile");
  const desktopAuthButtons = document.querySelector(".d-lg-flex .authButtons");
  const desktopUserName = desktopUserProfile?.querySelector(".userNameDisplay");

  // Mobile
  const mobileUserProfile = document.querySelector(".d-lg-none.userProfile");
  const mobileAuthButtons = document.querySelector(".d-lg-none .authButtons");
  const mobileUserName = mobileUserProfile?.querySelector(".userNameDisplay");

  if (loggedUser) {
    desktopUserProfile?.classList.add("d-lg-flex");
    desktopUserProfile?.classList.remove("d-none");
    desktopAuthButtons?.classList.add("d-none");
    if (desktopUserName) {
      desktopUserName.textContent = loggedUser.username;

      // اضيف رابط للنقر
      desktopUserName.style.cursor = "pointer";
      desktopUserName.onclick = () => {
        window.location.href = `/pages/profile.html`;
      };
    }

    mobileUserProfile?.classList.add("d-flex");
    mobileUserProfile?.classList.remove("d-none");
    mobileAuthButtons?.classList.add("d-none");
    if (mobileUserName) {
      mobileUserName.textContent = loggedUser.username;

      mobileUserName.style.cursor = "pointer";
      mobileUserName.onclick = () => {
        window.location.href = `/pages/profile.html`;
      };
    }
  } else {
    desktopUserProfile?.classList.remove("d-lg-flex");
    desktopUserProfile?.classList.add("d-none");
    desktopAuthButtons?.classList.remove("d-none");

    mobileUserProfile?.classList.remove("d-flex");
    mobileUserProfile?.classList.add("d-none");
    mobileAuthButtons?.classList.remove("d-none");
  }
  // Logout buttons (desktop & mobile)
  const logoutBtns = document.querySelectorAll(".logoutBtn");
  logoutBtns.forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault(); // لمنع أي سلوك افتراضي
      // console.log(desktopUserProfile)

      console.log(desktopUserProfile);

      // مسح session
      sessionStorage.removeItem("loggedUser");

      // تحديث الواجهة قبل إعادة التوجيه
      desktopUserProfile?.classList.remove("d-lg-flex");
      console.log(desktopUserProfile);
      desktopUserProfile?.classList.add("d-none");
      console.log(desktopUserProfile);
      desktopAuthButtons?.classList.remove("d-none");
      // desktopUserName.classList.add('d-none')

      mobileUserProfile?.classList.add("d-none");
      mobileAuthButtons?.classList.remove("d-none");

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 50); // 50ms تأخير بسيط لضمان التطبيق
    };
  });
}

// تشغيل التحديث عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", updateGlobalNavbar);

// Handle login/register button clicks
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-login")) {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `/pages/login.html?redirect=${currentUrl}`;
  }
  if (e.target.classList.contains("registerBtn")) {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `/pages/registration.html?redirect=${currentUrl}`;
  }
});
