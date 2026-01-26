let ingredientResult = document.getElementById("ingredientResult");

let ingredientCard = document.getElementsByClassName("ingredient-card");

async function getIngredients() {
  let ingredients = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`,
  );

  ingredients = await ingredients.json();
  displayIngredient(ingredients);
}

function displayIngredient(ingredients) {
  let str = "";
  for (let i = 0; i < 20; i++) {
    str += `<div class="col"  >
  <div class="ingredient-card rounded-3" data-name=${ingredients.meals[i].strIngredient} >
    <div class="ingredient-img-box">
      <img src="${ingredients.meals[i].strThumb}" alt="${ingredients.meals[i].strIngredient}">
    </div>

    <div class="ingredient-info">
      <h5>${ingredients.meals[i].strIngredient}</h5>
      <p>${ingredients.meals[i].strDescription.slice(0, 100)}</p>
    
    </div>
  </div>
</div>
  `;
  }

  ingredientResult.innerHTML = str;
}

getIngredients();

async function getMeals(mealName) {
  let meals = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=${mealName}`,
  );

  meals = await meals.json();
  displayIngredient(meals);
}

document.addEventListener("click", async (e) => {
  const card = e.target.closest(".ingredient-card");
  if (!card) return;

  const mealName = card.dataset.name;

  document.getElementById("cardsSection").style.display = "none";

  document.getElementById("mealSection").style.display = "block";

  await getMeals(mealName);
});
