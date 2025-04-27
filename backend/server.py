from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
import io
from PIL import Image
import cv2
import numpy as np
from dotenv import load_dotenv
import os
from pymongo import MongoClient
import face_recognition

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)

load_dotenv()

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

        # Step 4: Suggest Next Action
        suggestion = generate_suggestion(patient_id)

        # Step 5: Create response
        response = {
            "patient_id": patient_id,
            "medical_history": get_patient_medical_history(patient_id),
            "suggested_action": suggestion
        }

        return JSONResponse(content=response)

    except Exception as e:
        print(f"Error processing snapshot: {e}")
        return JSONResponse(content={"error": "Failed to process snapshot"}, status_code=500)

@app.get("/")
def root():
    return {"message": "PulseAR backend running!"}


@app.on_event("startup")
def load_known_patients_from_db():
    global URI, DB_NAME, CLIENT, DB, COLL, KNOWN_ENCODINGS, KNOWN_IDS

    # 1) Connect to MongoDB
    URI     = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("MONGODB_DB",  "mydatabase")
    CLIENT  = MongoClient(URI)
    DB      = client[DB_NAME]
    COLL    = DB["patients"]

    # 2) Fetch every patient document, but only pull the ID + photo field
    cursor = COLL.find({}, {"patient_id": 1, "photo": 1})

    for doc in cursor:
        pid        = doc.get("patient_id")
        photo_data = doc.get("photo")   # this should be your binary image blob

        if not pid or not photo_data:
            continue

        try:
            # 3) Load into face_recognition from bytes
            image    = face_recognition.load_image_file(io.BytesIO(photo_data))
            encodings = face_recognition.face_encodings(image)

            if encodings:
                KNOWN_ENCODINGS.append(encodings[0])
                KNOWN_IDS.append(pid)

            print(f"Loaded {len(KNOWN_IDS)} known patient faces")

        except Exception as e:
            print(f"[WARN] could not encode face for {pid}: {e}")


def recognize_patient(cv2_image):
    rgb_image = cv2.cvtColor(cv2_image, cv2.COLOR_BGR2RGB)
    face_encodings = face_recognition.face_encodings(rgb_image)

    if not face_encodings:
        return "unknown_patient"

    uploaded_encoding = face_encodings[0]
    matches = face_recognition.compare_faces(KNOWN_ENCODINGS, uploaded_encoding)

    if True in matches:
        first_match_index = matches.index(True)
        return KNOWN_IDS[first_match_index]

    return "unknown_patient"

def get_patient_medical_history(patient_id):
    doc = COLL.find_one(
        {"patient_id": patient_id},
        {"_id": 0, "medical_history": 1}
    )
    if not doc:
        return {}
    return doc["medical_history"]

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

        success, buffer = cv2.imencode(".jpg", cv_image)
        image_bytes = buffer.tobytes()

        # Step 2: Construct the prompt for Gemini
        prompt = f"""
        You are a medical AI assistant for a first responder. Based on the following information, provide a actionable suggestion for the first responder to tell a bystander how they can help the following person in need given the following medical information:
        
        Medical History:
        {medical_history}
        
        The image provided shows visible health cues. Use this context to enhance your suggestion.
        
        Suggestion shzould be suitable enough for a bystander with little to no medical experience to help out until first responders arrive onto the scene.
        """

        # Step 3: Call Gemini API to generate the suggestion
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                # first the image part, then the text prompt
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                prompt
            ]
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