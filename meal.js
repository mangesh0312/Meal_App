const search = document.getElementById("search");
const submit = document.getElementById("submit");
const favMeal = document.getElementById("fav-meal");
const mealElement = document.getElementById("meals");
const singleMeal = document.getElementById("single-meal");
const container = document.getElementsByClassName(
  "whole-container"
);
const result = document.getElementsByClassName(
  "result-heading"
);
const favList = []; //fav list array
async function mealSearch(e) {
  e.preventDefault();

  singleMeal.innerHTML = ""; //After searching complete it should clear search bar
  favMeal.innerHTML = "";
  const value = search.value;

  if (value.trim()) {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}` //search value by name
      );

      const data = await response.json();
      //   const resultHeading =
      //     document.createElement("result");
      result.innerHTML = `<h2>Search result for ${value}</h2>`;
      if (data.meals === null) {
        result.innerHTML = `<h2>Sorry No result found for ${value}</h2>`;
      } else {
        mealElement.innerHTML = data.meals
          .map(
            (meal) => `
                <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMealThumb}">
                <div id="mealInfo" class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
                </div>
                `
          )
          .join("");
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    alert("Please insert a name!...");
  }
}

//Add Listner

submit.addEventListener("submit", mealSearch);

mealElement.addEventListener("click", () => {
  const item = document.getElementById("mealInfo");
  const mealInfo = item.classList.contains("meal-info");

  if (mealInfo) {
    const mealId = item.getAttribute("data-mealID");
    getMealById(mealId);
  }
});

//function to get meal by Id
function getMealById(mealID) {
  try {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    )
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];

        addMealtoDOM(meal);
      });
  } catch (error) {
    console.log(error);
  }
}

//After fetching the meal by id this function adds and show us more details.
function addMealtoDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`
            ${meal[`strIngredient${i}`]} - ${
        meal[`strMeasure${i}`]
      }
            `);
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class = "single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
    ${meal.Area ? `<p>${meal.Area}</p>` : ""}
    </div>
    <div class="main">
    <p>${meal.strInstructions}</p>
    <h2>Ingredients</h2>
    <ul>
    ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
    </ul>   
    </div>
    <div class="btn-class">
     <a id="button" href="${
       meal.strYoutube
     }" target="_blank">Video</a>
     <button type="submit" id="fav-btn" onclick="addRemoveToFavList(${
       meal.idMeal
     })">Add to Fav</button>
     </div>
    </div>
    `;
}

//function to add and remove meal from list
function addRemoveToFavList(mealId) {
  let flag = false;
  for (let i = 0; i < favList.length; i++) {
    if (mealId == favList[i]) {
      flag = true;
    }
  }

  if (flag) {
    let num = favList.indexOf(mealId);
    favList.splice(num, 1);
    alert("Successfully remove from favourites");
  } else {
    favList.push(mealId);
    alert("Successfully added to Fav List");
  }
}

//function to show list of meal in fav section
function renderFavList() {
  singleMeal.innerHTML = "";
  mealElement.innerHTML = "";
  container.innerHTML = "";
  if (favList.length == 0) {
    favMeal.innerHTML = `
    <h1>Favourites</h1>
      <h3> Sorry there is no fav list</h3>`;
  } else {
    for (let i = 0; i < favList.length; i++) {
      try {
        fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favList[i]}`
        )
          .then((res) => res.json())
          .then((data) => {
            data.meals.map((meal) => {
              favMeal.innerHTML = `
              <h1>Favourites</h1>
                <div class="fav-single-meal">
                        <h2>${meal.strMeal}</h2>
                        <img src="${
                          meal.strMealThumb
                        }" alt="${meal.strMeal}"/>
                        <div class = "fav-single-meal-info">
                        ${
                          meal.strCategory
                            ? `<p>${meal.strCategory}</p>`
                            : ""
                        }
                        ${
                          meal.Area
                            ? `<p>${meal.Area}</p>`
                            : ""
                        }
                        </div>
                        <div class="btn-class">
                         <a id="button" href="${
                           meal.strYoutube
                         }" target="_blank">Video</a>
                         <button type="submit" id="fav-btn" onclick="addRemoveToFavList(${
                           meal.idMeal
                         })">Remove from Fav</button>
                         </div>
                        </div>`;
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
