# Frontend
Command: uvicorn server:app --reload

# Backend
Command: npm run dev

Installations
pip install fastapi uvicorn pillow opencv-python scikit-learn

Must use python 3.11 in order to use face_recognition → use venv
Windows:
  .\venv\Scripts\Activate
Mac:
  python3 -m venv .venv
  source .venv/bin/activate    

face_recognition library also requires cmake and dlib to be installed
