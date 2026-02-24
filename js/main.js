import { displayMeals } from "../utils.js";

let searchInputDesk = document.getElementById("searchInputDesk");
let searchInputMob = document.getElementById("searchInputMob");

let meals = [];

fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then((response) => response.json())
  .then((data) => {
    meals = data.meals || [];

    displayMeals(meals);

    // Event listeners
    searchInputDesk.addEventListener("input", display);
    searchInputMob.addEventListener("input", display);
  });

function display() {
  const queryDesk = searchInputDesk?.value.toLowerCase() || "";
  const queryMob = searchInputMob?.value.toLowerCase() || "";

  const query = queryDesk || queryMob;

  const filteredMeals = query
    ? meals.filter((meal) => meal.strMeal.toLowerCase().includes(query))
    : meals;

  displayMeals(filteredMeals);
}
