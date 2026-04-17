https://ats-resume-analysis-tool-1.onrender.com


# 🚀 ATS-Enhanced Resume Analyzer  
Built with MERN Stack + Google Gemini AI

An AI-powered resume analysis platform designed to optimize resumes for Applicant Tracking Systems (ATS) and improve job matching accuracy.

---

## 🌐 Live Deployment

- 🔗 Frontend (Vercel): https://ats-resume-analysis-tool-rqq8.vercel.app 
- 🔗 Backend (Render): https://ats-resume-analysis-tool-1.onrender.com  
- 🌍 Full App: https://ats-resume-analysis-tool-rqq8.vercel.app

---

## ✨ Features

- 🤖 AI-powered resume evaluation using Google Gemini  
- 📊 ATS score based on job description match  
- ✅ Matched keywords detection  
- ❌ Missing keywords identification  
- 💡 Smart improvement suggestions  
- 📝 AI-generated professional summary  
- 📋 Resume analysis history dashboard  
- 🔐 Secure authentication (JWT-based)  

---

## 🛠️ Tech Stack

Frontend: React 18, React Router 6, CSS  
Backend: Node.js, Express  
Database: MongoDB  
AI: Google Gemini 1.5 Flash  
Auth: JWT + bcryptjs  
Upload: Multer  

---

## 📦 Prerequisites

- Node.js (v18+)  
- MongoDB Compass or Atlas  
- Git  
- VS Code  

---

## ⚙️ Local Setup

### 1. Clone Repository

git clone <your-repo-link>  
cd ATS-Enhanced  

---

### 2. Backend Setup

cd backend  
npm install  
cp .env.example .env  

Update `.env`:

MONGO_URI=mongodb://127.0.0.1:27017/ats_project  
GEMINI_API_KEY=your_key_here  
JWT_SECRET=your_secret_key  
PORT=5000  
FRONTEND_URL=http://localhost:3000  

Run backend:

npm run dev  

---

### 3. Frontend Setup

cd frontend  
npm install  
cp .env.example .env  

Update `.env`:

REACT_APP_API_URL=http://localhost:5000  

Run frontend:

npm start  

---

## 🗄️ MongoDB Setup

- Open MongoDB Compass  
- Connect to: mongodb://127.0.0.1:27017  
- Database `ats_project` will be created automatically  

---

## ☁️ Deployment

### Backend (Render)

- Root Directory: backend  
- Build Command: npm install  
- Start Command: npm start  

Environment Variables:

MONGO_URI=<your_mongodb_atlas_uri>  
GEMINI_API_KEY=<your_key>  
JWT_SECRET=<your_secret>  
FRONTEND_URL=<your_vercel_url>  

---

### Frontend (Vercel)

- Root Directory: frontend  
- Framework: Create React App  

Environment Variable:

REACT_APP_API_URL=<your_render_backend_url>  

---

## 📁 Project Structure

ATS-Enhanced/  
├── backend/  
│   ├── models/  
│   ├── routes/  
│   ├── server.js  
│   └── .env.example  
│  
├── frontend/  
│   ├── src/  
│   ├── public/  
│   └── vercel.json  
│  
└── README.md  

---

## 🐛 Common Issues

Server not connecting → Run backend properly  
MongoDB error → Ensure MongoDB is running  
Invalid API key → Check .env file  
PDF upload fails → Use text-based PDF  
Vercel 404 error → Ensure vercel.json exists  

---

## 🚀 Future Improvements

- DOCX & image resume support  
- Resume score visualization charts  
- Job recommendation system  
- AI cover letter generator  

---

## 📜 License

MIT License