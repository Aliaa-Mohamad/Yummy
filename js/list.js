const urlParams = new URLSearchParams(window.location.search);
const listId = urlParams.get("id");
const listTitleEl = document.getElementById("listTitle");
const listMealsContainer = document.getElementById("listMeals");

const loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
if (!loggedUser) {
  alert("You must log in first!");
  window.location.href = "login.html";
}

const list = loggedUser.lists.find((l) => l.id === listId);
if (!list) {
  alert("List not found");
  window.location.href = "profile.html";
}

listTitleEl.textContent = list.name;

async function displayMeals(mealIds) {
  let html = "";
  for (const id of mealIds) {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const meal = await res.json();
    const mealObj = meal.meals[0];

    html += `
      <div class="col">
        <div class="card-box position-relative rounded-3">
          <div class="card-img">
            <img src="${mealObj.strMealThumb}" alt="${mealObj.strMeal}">
            <div class="overlay">
              <span class="delete-icon"><i class="fa-solid fa-trash"></i></span>
            </div>
          </div>
          <div class="card-info">
            <div>
              <a href="meal.html?id=${mealObj.idMeal}">
                <h6 class="meal-title">${mealObj.strMeal}</h6>
              </a>
            </div>
            <div>
              <span class="fav-icon" onclick="toggleFavorite('${mealObj.idMeal}', event)">
                <i class="fa-solid fa-heart"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  listMealsContainer.innerHTML = html;
}

displayMeals(list.items);

// toggle favorite function
window.toggleFavorite = function (mealId, event) {
  event.stopPropagation();
  // نفس الفنكشن اللي عندك في utils
};
