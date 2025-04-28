# Devpost Submission
https://devpost.com/software/a-oj8kix

# Inspiration
In critical emergencies, every second counts — yet bystanders often hesitate because they don’t know what to do, and first responders frequently arrive without a full understanding of the situation. We envisioned Tenshi as a way to bridge that gap. By crowdsourcing immediate assistance through intuitive, step-by-step tutorials and leveraging real-time data captured through Snap lenses, Tenshi empowers ordinary people to take life-saving action while professional help is on the way. At the same time, Tenshi ensures that first responders arrive better prepared, armed with vital visual and medical context that can dramatically improve outcomes. Our goal is to make expert help accessible in the moment it’s needed most — whether it’s through the hands of a nearby stranger or a paramedic racing to the scene.

# What it does
Tenshi uses Snap lenses to walk bystanders through emergency procedures like CPR with simple, interactive tutorials. As bystanders help, Tenshi captures an image of the scene and sends it to a backend server built with Python and MongoDB. There, medical information linked to the image — such as known conditions, allergies, or other critical notes — can be quickly retrieved. First responders can securely access this data before arriving, helping them prepare better for the specific needs of each patient and act faster when every second matters.

# How we built it
We built Tenshi by combining real-time augmented reality, backend infrastructure, and medical data management. On the front end, we used TypeScript inside Snap Lens Studio to create interactive lenses that guide bystanders through CPR and emergency steps with clear prompts and buttons. We also integrated text-to-speech directly into the lens experience, allowing instructions to be spoken aloud, ensuring that users can keep their eyes and hands free while delivering aid. When a lens detects a patient or when the user triggers an action, a snapshot is captured through the Spectacles and securely sent to a backend server built with Python (FastAPI). Each image is associated with a unique identifier that ties it to stored medical information in a MongoDB database. If a patient’s medical data (e.g., history of diabetes, allergies, or recent health issues) is available, it can be quickly retrieved by first responders. On the responder side, we developed a simple web dashboard that queries the backend and displays the patient’s critical information the moment they are en route. This real-time flow ensures that responders are no longer walking into unknown situations — they are armed with the context they need to deliver faster, more precise care.

# Challenges we ran into
One of the biggest challenges we faced was getting Snap’s Lens Studio to work properly with Spectacles. The documentation was limited and often unclear, especially around features like facial recognition that were supposed to be supported but didn’t function as expected in practice. This led to a lot of trial-and-error as we tried to implement core features. On the backend side, we also ran into difficulties coordinating our API libraries. Since it was our first time working with tools like FastAPI and the Gemini API, getting them to play nicely together took a lot of debugging and iteration. Integrating all the moving parts — from AR interactions to real-time data capture and secure backend communication — was a steep learning curve, but we pushed through it together.

# Accomplishments that we're proud of
We’re proud of connecting several complex technologies in our tech stack together — AR, real-time image capture, integration of a backend server, and medical data management — into a seamless experience in just a short period of time. In particular, getting Snap Spectacles to reliably capture and transmit data while maintaining a smooth user experience was a major milestone. This was our biggest roadblock, affecting us for a long duration of the provided hacking time.

# What we learned
Throughout this project, we learned a lot about working with hardware and software together in real time. Working with a new technology like Snap Lens and integrating Spectacles into our web technologies was a challenge we were excited to tackle together. Additionally, we also deepened our understanding of building secure and scalable backends with FastAPI and MongoDB, especially for handling sensitive data like medical information. This project ultimately showed us the importance of user-centered design in critical situations — clear, intuitive interfaces and step-by-step guidance can make the difference between hesitation and immediate life-saving action.

# What's next for Tenshi
We plan to expand Tenshi by integrating AI-driven analysis on the captured images, helping first responders identify potential injuries even before they arrive. We also want to collaborate with hospitals, emergency services, and public safety organizations to validate and pilot Tenshi in real-world environments. Long term, we envision Tenshi becoming a platform that supports not just CPR, but a wide range of emergency procedures — from trauma care to allergic reactions — making life-saving guidance available to anyone, anywhere, at any time.


# Run this App
## Frontend
Command: npm run dev

## Backend
Command: uvicorn server:app --reload

Installations
pip install fastapi uvicorn pillow opencv-python scikit-learn

Must use python 3.11 in order to use face_recognition → use venv

Windows:

  .\venv\Scripts\Activate

Mac:
  python3 -m venv .venv

  source .venv/bin/activate    

face_recognition library also requires cmake and dlib to be installed
