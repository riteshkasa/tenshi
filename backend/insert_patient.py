# backend/insert_patient.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# This will read the .env file in the current directory
load_dotenv()

# 1) Change these to match your .env or local Mongo setup
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB  = os.getenv("MONGODB_DB")
COLLECTION  = "patients"

# 2) A unique patient_id you’ll recognize
PATIENT_ID = "test_user_001"

# 3) Path to your photo
PHOTO_PATH = "test-data/my_photo.jpg"

def main():
    # Connect
    client = MongoClient(MONGODB_URI)
    db     = client[MONGODB_DB]
    coll   = db[COLLECTION]
    
    # Read your image as raw bytes
    with open(PHOTO_PATH, "rb") as f:
        photo_bytes = f.read()
    
    # Optional: any extra fields, e.g. medical_history
    doc = {
        "patient_id": PATIENT_ID,
        "photo": photo_bytes,
        "medical_history": "No known allergies"
    }
    
    # Insert (or replace existing)
    coll.delete_many({"patient_id": PATIENT_ID})
    result = coll.insert_one(doc)
    print(f"Inserted document with _id: {result.inserted_id}")

if __name__ == "__main__":
    main()
