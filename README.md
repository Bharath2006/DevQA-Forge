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
D:\DevQA Forge
│
├── app.py
├── index.html
│
├── static
│   ├── css
│   │   └── styles.css
│   │
│   └── js
│       └── app.js
│
└── __pycache__
    └── app.cpython-313.pyc
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

## 3️⃣ Install Required Packages

```bash
pip install flask
```

```bash
pip install google-genai
```

```bash
pip install reportlab
```

```bash
pip install requests
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

# 📥 Input Structure

DevQA Forge accepts different types of QA and API testing inputs from users.

---

## 1️⃣ Feature / Requirement Input

Users can enter:
- User stories
- Functional requirements
- API descriptions
- Feature details

### Example Input

```text
Create login functionality with email and password validation.
The system should prevent invalid logins and handle incorrect passwords.
```

### System Process
- AI analyzes the requirement
- Extracts testing scenarios
- Generates QA test cases automatically

---

## 2️⃣ API Testing Input

Users can test APIs by entering:

### Example API Details

```json
{
  "url": "https://api.example.com/login",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "email": "test@gmail.com",
    "password": "123456"
  }
}
```

### API Testing Includes
- Status code validation
- Response validation
- Header verification
- Error testing
- Response time analysis

---

## 3️⃣ Database Validation Input

Users can validate database connections using:

```json
{
  "dbType": "MySQL",
  "host": "localhost",
  "database": "qa_testing",
  "username": "root",
  "password": "password"
}
```

### Supported Databases
- MySQL
- PostgreSQL
- MongoDB
- SQL Server

---

# 📤 Output Structure

DevQA Forge generates intelligent QA outputs automatically.

---

## 1️⃣ Generated Test Cases Output

### Example Output

```json
{
  "feature": "Login Functionality",
  "test_cases": [
    {
      "id": "TC001",
      "scenario": "Verify login with valid credentials",
      "expected_result": "User should login successfully",
      "priority": "High",
      "status": "Pass"
    },
    {
      "id": "TC002",
      "scenario": "Verify login with invalid password",
      "expected_result": "Error message should appear",
      "priority": "High",
      "status": "Pass"
    }
  ]
}
```

---

## 2️⃣ API Testing Output

### Example Output

```json
{
  "status_code": 200,
  "response_time": "120ms",
  "response_status": "Success",
  "validation": "Passed"
}
```

### API Analysis Output Includes
- Response status
- JSON validation
- Error detection
- Security validation
- Performance insights

---

## 3️⃣ Database Validation Output

### Example Output

```json
{
  "database": "MySQL",
  "connection": "Successful",
  "status": "Connected",
  "message": "Database connection validated successfully"
}
```

---

## 4️⃣ PDF Report Output

Generated PDF contains:
- QA test cases
- API test results
- Validation reports
- Workflow diagrams
- QA summaries

### Export Format
```text
QA_Report.pdf
```

---

# 🔄 Complete Project Workflow

```text
User Input
    ↓
AI Requirement Analysis
    ↓
Feature Extraction
    ↓
Test Case Generation
    ↓
API / Database Validation
    ↓
Result Analysis
    ↓
PDF Report Generation
    ↓
Final QA Output
```

---

# 📊 Output Benefits

✅ Faster QA process  
✅ Reduced manual testing effort  
✅ Intelligent test generation  
✅ Professional QA reporting  
✅ Realtime validation system  
✅ Improved testing accuracy  

---

# 🚀 DevQA Forge Workflow Summary

| Module | Input | Output |
|---|---|---|
| AI Test Generator | Feature Description | QA Test Cases |
| API Analyzer | API Details | API Validation Report |
| Database Validator | DB Configurations | Connection Status |
| PDF Generator | QA Results | Downloadable Reports |

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
