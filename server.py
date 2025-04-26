from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import io
from PIL import Image
import cv2
import numpy as np

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
def generate_suggestion(patient_id, health_status):
    history = get_patient_medical_history(patient_id)
    conditions = history.get("conditions", [])

    if "Asthma" in conditions and health_status["cyanosis_detected"]:
        return "Administer oxygen immediately."

    if "Diabetes" in conditions and not health_status["conscious"]:
        return "Check blood sugar levels urgently."

    if health_status["bleeding_detected"]:
        return "Apply pressure to wound and prepare for evacuation."

    return "Monitor patient and reassess."