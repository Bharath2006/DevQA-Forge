# DevQA Forge 🚀  
### AI-Powered QA Test Case Generator & API Testing Platform

[DevQA Forge GitHub Repository](https://github.com/Bharath2006/DevQA-Forge)

DevQA Forge is an intelligent QA automation and testing platform built to simplify software testing workflows using AI.  
It helps developers, QA engineers, and testers generate test cases, analyze APIs, validate databases, visualize testing flows, and export reports — all from a modern web interface.

The project combines:

- ✅ AI-based test case generation
- ✅ API testing and validation
- ✅ Database connectivity checks
- ✅ QA workflow visualization
- ✅ PDF report generation
- ✅ Interactive frontend dashboard
- ✅ FastAPI / Flask backend support
- ✅ Gemini AI integration support

---

# ✨ Features

## 🤖 AI Test Case Generator
Generate intelligent QA test cases automatically from:

- Feature descriptions
- API responses
- User stories
- Requirements text
- Functional specifications

Includes:

- Positive test cases
- Negative test cases
- Edge cases
- Validation scenarios
- Security test scenarios

---

## 🔌 API Testing Module

Analyze and validate APIs directly from the dashboard.

### Supports:
- GET requests
- POST requests
- PUT requests
- DELETE requests

### API Testing Includes:
- Status code validation
- Response time analysis
- JSON structure validation
- Error handling tests
- Authentication testing
- Header validation

---

## 🗄️ Database Validation

Realtime database connectivity checker for:

- MySQL
- PostgreSQL
- MongoDB
- SQL Server

Features:
- Connection validation
- Configuration verification
- Error detection
- Database health checks

---

## 📊 QA Workflow Visualization

Visual representation of:

- Testing flow
- API lifecycle
- QA execution process
- Test progress tracking

Users can export workflows into:
- PDF reports
- QA documentation

---

# 📄 PDF Export System

Generate professional QA reports including:

- Test cases
- API analysis
- Validation results
- QA flow diagrams

Useful for:
- QA documentation
- Client reports
- Sprint reports
- Audit tracking

---

# 🎨 Modern Frontend UI

Responsive UI built with:

- HTML5
- CSS3
- JavaScript

Features:
- Interactive dashboard
- Toast notifications
- Dynamic charts
- Realtime validation
- Responsive layout

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend logic |
| FastAPI | API backend |
| Flask | Web server |
| HTML/CSS/JS | Frontend |
| Gemini AI | AI integration |
| ReportLab | PDF generation |
| Chart.js | Data visualization |
| JSON | API handling |

---

# 📂 Project Structure

```bash
DevQA-Forge/
│
├── backend/
│   ├── app.py
│   ├── api.py
│   ├── database.py
│   └── pdf_generator.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── templates/
├── static/
├── reports/
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Bharath2006/DevQA-Forge.git
```

```bash
cd DevQA-Forge
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

# ▶️ Running the Project

## FastAPI Version

```bash
uvicorn app:app --reload
```

---

## Flask Version

```bash
python app.py
```

---

# 🌐 Open in Browser

```bash
http://127.0.0.1:8000
```

or

```bash
http://127.0.0.1:5000
```

---

# 🔑 Gemini AI Setup

Create an environment variable:

### Windows

```bash
set GEMINI_API_KEY=your_api_key
```

### Linux / Mac

```bash
export GEMINI_API_KEY=your_api_key
```

---

# 📌 Example Use Cases

## QA Engineers
- Generate test cases automatically
- Validate APIs quickly
- Export QA reports

## Developers
- Test backend APIs
- Validate DB connections
- Debug integrations

## Students
- Learn QA testing
- Understand API workflows
- Practice automation testing

## Startups
- Reduce manual QA effort
- Improve testing coverage
- Accelerate releases

---

# 📷 Screenshots

## Dashboard UI
-  Input panel
  <img width="1325" height="414" alt="image" src="https://github.com/user-attachments/assets/4c0b8207-de19-409b-a193-e746486c44e7" />

- QA flow section
  <img width="1301" height="352" alt="image" src="https://github.com/user-attachments/assets/aa71fa6c-58c7-4ceb-b0df-b29b0301def8" />

- AI test generator
  <img width="1304" height="593" alt="image" src="https://github.com/user-attachments/assets/b9048c40-118e-4052-a94a-a228868dd28c" />

  <img width="1309" height="565" alt="image" src="https://github.com/user-attachments/assets/1a29a0aa-8cae-412f-9fe2-819bcb980210" />

- Database validation

  <img width="1299" height="475" alt="image" src="https://github.com/user-attachments/assets/b42f6f2e-c12f-41c7-8dcd-6762d9e72bed" />


## Reports
- Exported PDF reports
  <img width="793" height="518" alt="image" src="https://github.com/user-attachments/assets/f7e159ac-be70-49f1-ac0c-16f4ff004e6e" />
  
---

# 🔥 Future Enhancements

Planned features:

- Selenium automation
- Playwright integration
- AI bug prediction
- Authentication testing suite
- CI/CD pipeline integration
- Docker deployment
- GitHub Actions support
- Multi-user authentication
- Cloud deployment support

---

# 🧪 Sample API Request

```json
{
  "feature": "Login API",
  "method": "POST",
  "expected_status": 200
}
```

---

# 📤 Sample Generated Test Case

```json
{
  "test_case": "Verify login with valid credentials",
  "expected_result": "User should login successfully",
  "status": "Pass"
}
```

---

# 🤝 Contributing

Contributions are welcome.

## Steps

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 🐞 Issues

Found a bug or want a feature?

Open an issue here:

https://github.com/Bharath2006/DevQA-Forge/issues

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed by **Bharath S**

- Power Platform Developer
- QA & AI Automation Enthusiast

GitHub:

https://github.com/Bharath2006

---

# ⭐ Support

If you like this project:

- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Contribute improvements
- 📢 Share with developers & testers

---

# 🚀 DevQA Forge

### Smart QA Testing Powered by AI
