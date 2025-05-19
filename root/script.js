function generateRecipe() {
    const cuisine = document.getElementById("cuisine").value;
    const diet = document.getElementById("diet").value;
    const recipeKey = `${cuisine}_${diet}`; // Match keys in recipes.json

  fetch("/recipes.json") // Relative path based on your file structure// Updated path for correct fetching
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
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
                document.getElementById("recipe-output").innerHTML = `<p style="color: red;">No recipe found for this selection.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            document.getElementById("recipe-output").innerHTML = `<p style="color: red;">Error loading recipes. Please check JSON file or path.</p>`;
        });
}
