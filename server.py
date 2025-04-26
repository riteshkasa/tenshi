from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from google import genai
import io
from PIL import Image
import cv2
import numpy as np

client = genai.Client(api_key="AIzaSyAWSG-pqv9n2oRaon2tkMohHp3cS2DZe1k")


app = FastAPI()

@app.post("/analyze-snapshot")
async def analyze_snapshot(file: UploadFile = File(...)):
    try:
        # Step 1: Load the uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Step 2: Perform Face Recognition (mocked for now)
        patient_id = recognize_patient(cv_image)

        # Step 3: Perform Health Analysis
        health_status = analyze_health_cues(cv_image)

        # Step 4: Suggest Next Action
        suggestion = generate_suggestion(patient_id, health_status)

        # Step 5: Create response
        response = {
            "patient_id": patient_id,
            "medical_history": get_patient_medical_history(patient_id),
            "health_status": health_status,
            "suggested_action": suggestion
        }

        return JSONResponse(content=response)

    except Exception as e:
        print(f"Error processing snapshot: {e}")
        return JSONResponse(content={"error": "Failed to process snapshot"}, status_code=500)

@app.get("/")
def root():
    return {"message": "PulseAR backend running!"}

# Placeholder function for patient recognition
def recognize_patient(image):
    # TODO: Implement real facial recognition here
    # For now, return dummy patient
    return "patient_001"

# Placeholder function for health analysis
def analyze_health_cues(image):
    # TODO: Analyze skin color, bleeding, consciousness
    # Mock some health status for now
    return {
        "cyanosis_detected": False,
        "bleeding_detected": True,
        "conscious": True
    }

# Placeholder medical database
PATIENT_DATABASE = {
    "patient_001": {
        "name": "John Doe",
        "conditions": ["Diabetes", "Hypertension"],
        "allergies": ["Penicillin"]
    }
}

def get_patient_medical_history(patient_id):
    return PATIENT_DATABASE.get(patient_id, {})

# Placeholder suggestion engine
from pydantic import BaseModel

# Define a Pydantic model for the request body
class MedicalHistoryRequest(BaseModel):
    medical_history: str

@app.post("/generate-suggestion")
async def generate_suggestion(request: MedicalHistoryRequest):
    try:
        # Extract the medical history from the request
        medical_history = request.medical_history

        # Step 1: Load the hardcoded image
        image_path = "assets/img.jpg"
        image = Image.open(image_path)
        # Convert the image to a format suitable for analysis (if needed)
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # Step 2: Construct the prompt for Gemini
        prompt = f"""
        You are a medical AI assistant. Based on the following information, provide a concise, actionable suggestion for a bystander:
        
        Medical History:
        {medical_history}
        
        The image provided shows visible health cues. Use this context to enhance your suggestion.
        
        Suggestion should be simple and suitable for a bystander using Snap AR lenses. Respond with very few words as if the bystander is vieweing the suggestion on their lens screen. 
        """

        # Step 3: Call Gemini API to generate the suggestion
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        suggestion = response.text.strip()

        # Step 4: Return the suggestion
        return JSONResponse(content={
            "medical_history": medical_history,
            "suggestion": suggestion
        })

    except Exception as e:
        print(f"Error generating suggestion: {e}")
        return JSONResponse(content={"error": "Failed to generate suggestion"}, status_code=500)