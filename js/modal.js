document.addEventListener("DOMContentLoaded", () => {
  const listModal = document.getElementById("listModal");
  const listsContainer = document.getElementById("listsContainer");
  const closeModalBtn = document.querySelector(".close-modal");
  const createListBtn = document.querySelector(".create-list-btn");
  const listsView = document.getElementById("listsView");
  const createListView = document.getElementById("createListView");
  const closeFormBtn = document.querySelector(".close-form-btn");
  const createListForm = document.getElementById("createListForm");
  const modalFooter = document.getElementById("modalFooter");

  // const listModal = document.getElementById("listModal");
  if (listModal) {
    listModal.classList.add("hidden");
  }

  // **تأكد كل العناصر موجودة قبل إضافة Event Listeners**
  if (createListBtn) {
    createListBtn.addEventListener("click", () => {
      listModal.style.display = "flex"; // يظهر المودال

      createListView.classList.remove("hidden");
      if (modalFooter) modalFooter.classList.add("hidden");
    });
  }

  function renderLists(lists, mealId) {
    const listsContainer = document.getElementById("listsContainer");
    if (!listsContainer) return;

    if (!lists.length) {
      listsContainer.innerHTML = `
        <div class="empty-lists">You haven't made any lists yet</div>
      `;
      return;
    }

    let html = "";
    lists.forEach((list) => {
      html += `
        <div class="user-list" onclick="addMealToList('${list.id}', '${mealId}')">
          ${list.name}
        </div>
      `;
    });

    listsContainer.innerHTML = html;
  }

  window.handleOpenLists = function (event, mealId) {
    event.stopPropagation();

    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!loggedUser) {
      showLoginAlert();
      return;
    }

    // عرض الليستات
    renderLists(loggedUser.lists || [], mealId);

    // فتح المودال
    listModal.style.display = "flex";
  };

  // إغلاق عند الضغط على الإكس
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      listModal.style.display = "none";
    };
  }

  // إغلاق عند الضغط على الخلفية
  if (listModal) {
    listModal.onclick = (e) => {
      if (e.target === listModal) {
        listModal.style.display = "none";
      }
    };
  }

  if (createListForm) {
    createListForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
      if (!loggedUser) return;

      const name = document.getElementById("listNameInput").value.trim();
      // const privacy = document.getElementById("listPrivacy").value;

      if (!name) return;

      const newList = {
        id: crypto.randomUUID(), // معرف فريد لكل list
        name,
        ownerID: loggedUser.id,
        // public: privacy === "public",
        likes: 0,
        items: [],
      };

      // إضافة الـ list للمستخدم
      loggedUser.lists = loggedUser.lists || [];
      loggedUser.lists.push(newList);

      // حفظ في sessionStorage
      sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

      // تحديث الـ DB (إذا عندك سيرفر)
      try {
        await fetch(`http://localhost:5501/users/${loggedUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lists: loggedUser.lists }),
        });
      } catch (err) {
        console.log("Create list error:", err);
      }

      // إعادة عرض القوائم في المودال
      renderLists(loggedUser.lists, null);

      // إخفاء الفورم والرجوع للقوائم
      createListView.classList.add("hidden");
      listsView.classList.remove("hidden");
      if (modalFooter) modalFooter.classList.remove("hidden");

      // إعادة تعيين الفورم
      createListForm.reset();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      resetModalState();
      listModal.style.display = "none";
    };
  }

  if (listModal) {
    listModal.onclick = (e) => {
      if (e.target === listModal) {
        resetModalState();
        listModal.style.display = "none";
      }
    };
  }

  function resetModalState() {
    if (createListForm) createListForm.reset();
    if (createListView) createListView.classList.add("hidden");
    if (listsView) listsView.classList.remove("hidden");
    if (modalFooter) modalFooter.classList.remove("hidden");
  }

  window.addMealToList = async function (listId, mealId) {
    const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
    if (!loggedUser) {
      showLoginAlert();
      return;
    }

    const list = loggedUser.lists.find((l) => l.id === listId);
    if (!list) return;

    // لو الـ meal موجود أصلاً، ما نكررش
    if (!list.items.includes(mealId)) {
      list.items.push(mealId);
    }

    // تحديث sessionStorage
    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

    // تحديث الـ DB
    try {
      await fetch(`http://localhost:5501/users/${loggedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lists: loggedUser.lists }),
      });
    } catch (err) {
      console.log("Add meal to list error:", err);
    }

    // Feedback للمستخدم
    alert(`Meal added to ${list.name}`);

    // اختفاء المودال بعد الإضافة
    resetModalState();
    listModal.style.display = "none";
  };
});
