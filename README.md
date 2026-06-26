# 🤖 IntelliAI

> **An AI-powered chatbot built with Flask and Google Gemini API, delivering fast, intelligent, and human-like conversations through a clean and responsive web interface.**

---

## 📖 Overview

**IntelliAI** is a full-stack AI chatbot that integrates **Google Gemini API** with a **Flask backend** to provide real-time, context-aware conversations.

The project demonstrates how modern **Generative AI** can be combined with web technologies to build intelligent applications while following secure development practices.

Whether you're asking questions, seeking explanations, brainstorming ideas, or learning something new, IntelliAI delivers natural and interactive conversations.

---

# ✨ Features

- 🤖 AI-powered conversational assistant
- ⚡ Real-time responses using Google Gemini API
- 🌐 Flask backend
- 🎨 Clean and responsive user interface
- 🔒 Secure API key management using `.env`
- 📱 Mobile-friendly design
- 💬 Interactive chat experience
- ⚙️ Lightweight and easy to extend

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Python | Backend Development |
| Flask | Web Framework |
| HTML5 | Frontend Structure |
| CSS3 | Styling |
| JavaScript | Client-side Interactivity |
| Google Gemini API | AI Response Generation |
| Git | Version Control |
| GitHub | Project Hosting |

---

# 📂 Project Structure

```text
IntelliAI/
│
├── static/
│   ├── script.js
│   └── style.css
│
├── templates/
│   └── index.html
│
├── app.py
├── requirements.txt
├── .gitignore
├── README.md
└── .env (Not Uploaded)
```

---

# 🏗️ System Architecture

```text
                 User
                   │
                   ▼
      HTML • CSS • JavaScript
                   │
                   ▼
            Flask Backend
                   │
                   ▼
        Google Gemini API
                   │
                   ▼
        AI Generated Response
                   │
                   ▼
               User
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/KeerthanaPriyankaDurga/IntelliAI.git
```

---

## 2. Navigate to the Project

```bash
cd IntelliAI
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a file named `.env`

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

> ⚠️ Never upload your `.env` file to GitHub.

---

## 5. Start the Application

```bash
python app.py
```

Open your browser and visit

```
http://127.0.0.1:5000
```

---

# 📸 Application Preview

> Screenshots will be added soon.

- 🏠 Home Screen
- 💬 Chat Interface
- 🤖 AI Response Example

---

# 💡 How It Works

1. User enters a message.
2. Flask receives the request.
3. Backend sends the prompt to Google Gemini API.
4. Gemini generates an intelligent response.
5. Flask returns the response.
6. The chatbot displays the answer instantly.

---

# 🎯 Project Highlights

- Full Stack AI Application
- Generative AI Integration
- REST API Communication
- Secure Environment Variable Management
- Responsive Web Design
- Production-ready Project Structure

---

# 🛣️ Future Enhancements

- [ ] Voice Assistant
- [ ] Speech-to-Text
- [ ] Text-to-Speech
- [ ] Chat History
- [ ] User Authentication
- [ ] Multiple AI Models
- [ ] Image Upload Support
- [ ] PDF Export
- [ ] Dark Mode
- [ ] Multi-language Support

---

# 🔒 Security

Sensitive credentials are securely managed using environment variables.

The `.env` file is excluded from version control using `.gitignore`, ensuring that API keys remain private and are never exposed in the repository.

---

# 🤝 Contributing

Contributions are welcome!

If you'd like to improve IntelliAI:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 👩‍💻 Developer

**Keerthana**

**B.Tech – Artificial Intelligence & Machine Learning (AIML)**

Passionate about:

- Artificial Intelligence
- Machine Learning
- Deep Learning
- Full Stack Development
- Building Real-World AI Applications

---

# 📄 License

This project is created for educational purposes and portfolio demonstration.

---

# ⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub.

Your support motivates continuous improvement and the development of more open-source AI projects.

---

## 🙏 Acknowledgements

- Google Gemini API
- Flask
- Python
- Open Source Community
