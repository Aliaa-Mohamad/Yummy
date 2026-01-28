import { displayMeals } from "../utils.js";

const params = new URLSearchParams(window.location.search);
const recipe = params.get("recipe");
const type = params.get("type");

async function getMeals(recipe) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${type}=${recipe}`,
  );
  let data = await res.json();
  displayMeals(data.meals);
}

getMeals(recipe);
