# Elderly Care Project

This is a **full-stack elderly care application** with:
- **Frontend:** React + Vite  
- **Backend:** FastAPI (Python)  

---

## 📂 Project Structure
```
elderly-care/
│
├── backend/          # FastAPI backend
│   ├── main.py        # Entry point for the backend
│   └── requirements.txt
│
├── package.json       # Frontend dependencies
├── vite.config.js     # Vite config
└── README.md
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/aaravaggarwal3535/elderly-care.git
cd elderly-care
```

---

### 2️⃣ Backend Setup (FastAPI + Python)
```bash
cd backend
```

#### Create Virtual Environment
```bash
python -m venv venv
```

#### Activate Virtual Environment
- **Linux/macOS**
```bash
source venv/bin/activate
```
- **Windows (PowerShell)**
```powershell
venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Run the Backend
```bash
uvicorn main:app --reload
```
- Backend URL → **http://127.0.0.1:8000/**
- API Docs → **http://127.0.0.1:8000/docs**

---

### 3️⃣ Frontend Setup (React + Vite)
From the **root directory**:
```bash
cd ..
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```
- Frontend URL → **http://localhost:5173/**

---

### 4️⃣ Environment Variables (Optional)
If your frontend needs to call the backend, create a `.env` file in the **root directory**:
```env
VITE_API_URL=http://127.0.0.1:8000
```
Use it in your frontend code:
```javascript
import.meta.env.VITE_API_URL
```

---

## 🏃 Running the Project
**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Frontend:**
```bash
cd ..
npm run dev
```

---

## 📜 License
This project is licensed under the MIT License.
