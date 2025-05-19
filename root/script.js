function generateRecipe() {
    const cuisine = document.getElementById("cuisine").value;
    const diet = document.getElementById("diet").value;
    const recipeKey = `${cuisine}_${diet}`; // Match keys in recipes.json

    fetch("/recipes.json") // Load JSON file
        .then(response => response.json())
        .then(data => {
            const recipe = data.recipes[recipeKey];

            if (recipe) {
                document.getElementById("recipe-output").innerHTML = `
                    <h2>${recipe.title}</h2>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                    <p><strong>Time to Prepare:</strong> ${recipe.time_to_prepare}</p>
                    <p><strong>Calories:</strong> ${recipe.calories}</p>
                    <p><strong>Nutritional Facts:</strong> ${recipe.nutritional_facts}</p>
                `;
            } else {
                document.getElementById("recipe-output").innerText = "No recipe found for this selection.";
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            document.getElementById("recipe-output").innerText = "Error loading recipes.";
        });
}
