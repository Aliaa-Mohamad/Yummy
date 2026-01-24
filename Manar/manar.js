fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
.then((response) => response.json())
.then((data)=>{
    meals = data.meals;
    console.log(meals);
})