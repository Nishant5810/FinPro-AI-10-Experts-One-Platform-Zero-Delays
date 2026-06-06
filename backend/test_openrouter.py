import requests
import json
import os
from dotenv import load_dotenv

# Load key from .env file
load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
if api_key:
    api_key = api_key.strip()
else:
    api_key = "<OPENROUTER_API_KEY>"

print("Sending request to OpenRouter using model: ~openai/gpt-latest ...")

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": f"Bearer {api_key}",
    "HTTP-Referer": "http://localhost:8000", # Optional. Site URL for rankings on openrouter.ai.
    "X-OpenRouter-Title": "FinPro AI", # Optional. Site title for rankings on openrouter.ai.
  },
  data=json.dumps({
    "model": "~openai/gpt-latest",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    "max_tokens": 1000
  })
)

print("Status Code:", response.status_code)
try:
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print("Raw Response Content:", response.text)
