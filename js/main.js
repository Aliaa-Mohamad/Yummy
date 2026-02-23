import { displayMeals } from "../utils.js";

let searchInputDesk = document.getElementById("searchInputDesk");
let searchInputMob = document.getElementById("searchInputMob");

let meals = [];

// جلب البيانات
fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
  .then((response) => response.json())
  .then((data) => {
    meals = data.meals || [];

    // أول عرض
    displayMeals(meals);

    // Event listeners
    searchInputDesk.addEventListener("input", display);
    searchInputMob.addEventListener("input", display);
  });

// دالة العرض بعد التصفية
function display() {
  const queryDesk = searchInputDesk?.value.toLowerCase() || "";
  const queryMob = searchInputMob?.value.toLowerCase() || "";

  // نستخدم query واحدة فقط (إذا كنتِ تريدين أن أي input يأثر على العرض)
  const query = queryDesk || queryMob;

  const filteredMeals = query
    ? meals.filter((meal) => meal.strMeal.toLowerCase().includes(query))
    : meals;

  displayMeals(filteredMeals);
}
