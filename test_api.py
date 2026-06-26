# test_api.py - Test if API key is working
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env file
load_dotenv()

# Get API key
api_key = os.getenv('GEMINI_API_KEY')

print(f"API Key found: {'Yes' if api_key else 'No'}")

if api_key:
    print(f"API Key starts with: {api_key[:10]}...")
    
    try:
        # Try to configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Try a simple test
        response = model.generate_content("Say 'Hello, API is working!'")
        print("✅ API Test Successful!")
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"❌ API Test Failed: {e}")
else:
    print("❌ No API key found. Check your .env file!")