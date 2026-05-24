from flask import Flask, request, jsonify, send_file
from google import genai
import os

app = Flask(__name__)

client = genai.Client()

contents = []

@app.route("/")
def home():
    return send_file("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message")
    test_cases = data.get("testCases", [])
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    context = ""
    if test_cases:
        context = "Here are the user's current test cases:\n"
        for tc in test_cases:
            context += f"ID: {tc.get('id')}, Feature: {tc.get('feature')}, Type: {tc.get('type')}, Priority: {tc.get('priority')}\n"

    system_instruction = "You are an expert QA (Quality Assurance) tester chatbot. You only answer questions related to QA testing, test cases, and quality assurance. Customize your answers based on the user's provided test cases. When displaying test case data or comparing things, always use Markdown tables. You can suggest 'actions' in a table column if appropriate."
    
    prompt = f"System Instruction: {system_instruction}\n\n{context}\n\nUser Message: {user_input}"

    contents.append({
        "role": "user",
        "parts": [{"text": prompt}]
    })

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=contents
        )

        bot_reply = response.text

        contents.append({
            "role": "model",
            "parts": [{"text": bot_reply}]
        })

        return jsonify({"response": bot_reply})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/chat/reset", methods=["POST"])
def reset_chat():
    global contents
    contents = []
    return jsonify({"status": "success"})

if __name__ == "__main__":
    print("🤖 Flask Server Started!")
    print("Go to http://127.0.0.1:5000 in your browser.")
    app.run(debug=True)