import os
import json
import logging
from google.cloud import logging as cloud_logging
import vertexai
from vertexai.preview.generative_models import (
    GenerationConfig,
    GenerativeModel,
    HarmBlockThreshold,
    HarmCategory
)

# Configure logging
logging.basicConfig(level=logging.INFO)
log_client = cloud_logging.Client()
log_client.setup_logging()

# Initialize Vertex AI
PROJECT_ID = os.environ.get("GCP_PROJECT", "your-project-id")
LOCATION = os.environ.get("GCP_REGION", "us-central1")
vertexai.init(project=PROJECT_ID, location=LOCATION)
text_model_pro = GenerativeModel("gemini-pro")

def handler(request):
    # Vercel sends a Request object similar to Flask’s request
    if request.method != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method Not Allowed. Please use POST."})
        }
    try:
        data = request.get_json(silent=True)
        if not data:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Bad Request: JSON body is missing."})
            }

        # Extract form fields from the JSON
        cuisine = data.get("cuisine", "American")
        dietary_preference = data.get("diet", "None")
        allergy = data.get("allergy", "none")
        ingredient_1 = data.get("ingredient_1", "")
        ingredient_2 = data.get("ingredient_2", "")
        ingredient_3 = data.get("ingredient_3", "")
        wine = data.get("wine", "None")

        # Build the prompt
        prompt = (
            f"I am a Chef. I need to create {cuisine} recipes for customers who want {dietary_preference} meals. "
            f"However, don't include recipes that use ingredients with the customer's {allergy} allergy. "
            f"I have {ingredient_1}, {ingredient_2}, and {ingredient_3} in my kitchen and other ingredients. "
            f"The customer's wine preference is {wine}. Please provide some meal recommendations. "
            "For each recommendation include preparation instructions, time to prepare, the recipe title at the beginning, "
            "the wine pairing for each recommendation, and at the end include the calories and nutritional facts."
        )

        generation_config = GenerationConfig(temperature=0.8, max_output_tokens=2048)
        # Generate content using Vertex AI (streaming enabled)
        responses = text_model_pro.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings={
                HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            },
            stream=True
        )

        final_response = ""
        for response in responses:
            try:
                final_response += response.text
            except Exception:
                continue

        return {
            "statusCode": 200,
            "body": json.dumps({"recipe": final_response})
        }
    except Exception as e:
        logging.exception("Error generating recipe.")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
