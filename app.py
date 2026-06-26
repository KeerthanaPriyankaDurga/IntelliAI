# app.py - UPDATED WITH BEAUTIFUL UI SUPPORT
from flask import Flask, request, jsonify, render_template  # ← CHANGED: render_template instead of render_template_string
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("❌ ERROR: No API key found!")
    print("Create a .env file with: GEMINI_API_KEY=your_key_here")
    exit(1)

# Configure Gemini
genai.configure(api_key=api_key)

# ===== AUTO-DISCOVER AVAILABLE MODELS =====
print("🔍 Discovering available models...")
available_models = []
try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            available_models.append(model.name)
            print(f"✅ Found: {model.name}")
except Exception as e:
    print(f"❌ Error listing models: {e}")

# Choose the best model
model_to_use = None
preferred_models = [
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-1.0-pro',
    'models/gemini-pro'
]

for preferred in preferred_models:
    if preferred in available_models or preferred.replace('models/', '') in available_models:
        model_to_use = preferred
        break

if not model_to_use and available_models:
    # Use the first available model
    model_to_use = available_models[0]

if not model_to_use:
    print("❌ No suitable model found!")
    exit(1)

print(f"✅ Using model: {model_to_use}")
model = genai.GenerativeModel(model_to_use)

# Create Flask app
app = Flask(__name__)

# Store conversation history
conversation_history = []

# ===== ROUTES =====

@app.route('/')
def home():
    # CHANGED: Now loads from templates/index.html instead of HTML string
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        print(f"📨 Received: {user_message}")
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        # Add to conversation history
        conversation_history.append({'role': 'user', 'text': user_message})
        
        # Get response from Gemini
        response = model.generate_content(user_message)
        ai_response = response.text
        
        # Add to conversation history
        conversation_history.append({'role': 'ai', 'text': ai_response})
        
        print(f"🤖 Response sent: {ai_response[:50]}...")
        
        # Return response with history
        return jsonify({
            'response': ai_response,
            'history': conversation_history
        })
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/clear', methods=['POST'])
def clear():
    global conversation_history
    conversation_history = []
    return jsonify({'message': 'Chat cleared'})

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify({'history': conversation_history})

@app.route('/models', methods=['GET'])
def list_models():
    """Debug endpoint to see available models"""
    return jsonify({
        'available_models': available_models, 
        'using': model_to_use
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Starting Beautiful AI Chatbot...")
    print(f"📦 Using model: {model_to_use}")
    print("📍 Open: http://127.0.0.1:5000")
    print("🔍 Models: http://127.0.0.1:5000/models")
    print("📁 Using templates from: templates/")
    print("🎨 Using styles from: static/")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)