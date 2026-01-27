import getMealDetails from "../utils.js";

const params = new URLSearchParams(window.location.search);
const mealId = params.get("id");

getMealDetails(mealId);
