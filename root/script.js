function generateRecipe() {
  const cuisine = document.getElementById("cuisine").value;
  const diet = document.getElementById("diet").value;
  const allergy = document.getElementById("allergy").value;
  const ingredient_1 = document.getElementById("ingredient_1").value;
  const ingredient_2 = document.getElementById("ingredient_2").value;
  const ingredient_3 = document.getElementById("ingredient_3").value;
  const wine = document.getElementById("wine").value;

  const data = {
    cuisine,
    diet,
    allergy,
    ingredient_1,
    ingredient_2,
    ingredient_3,
    wine
  };

  document.getElementById("recipe-output").innerText = "Generating recipe...";
  
  fetch("/api/generate_recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.recipe) {
        document.getElementById("recipe-output").innerText = result.recipe;
      } else {
        document.getElementById("recipe-output").innerText = "No recipe generated.";
      }
    })
    .catch((error) => {
      document.getElementById("recipe-output").innerText = "Error: " + error;
    });
}
