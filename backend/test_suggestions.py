
from google import genai

client = genai.Client(api_key="AIzaSyAWSG-pqv9n2oRaon2tkMohHp3cS2DZe1k")

response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Explain how AI works in a few words"
)
print(response.text)
