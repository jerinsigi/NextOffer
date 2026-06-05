<div align="center">
  <h1>🚀 NextOffer : AI Powered Interview Automation platform</h1>
  <p><strong>Your Ultimate AI-Powered Hiring Platform</strong></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange.svg)](https://firebase.google.com/)


</div>

<br />

Welcome to **NextOffer**, a modern and comprehensive hiring platform designed to bridge the gap between talented job seekers and leading companies. Built with a powerful MERN stack + Firebase + AI capabilities, the platform provides distinct dashboard experiences for Admins, Companies, and Candidates (Users), facilitating a seamless hiring flow from resume parsing to real-time AI-powered video interviews.

---

## ✨ Key Features

### 🏢 For Companies
- **Dynamic Job Posting:** Effortlessly create, manage, and track job listings.
- **Analytics & Reports Dashboard:** Real-time metrics on candidate engagement, interview completion, and application tracking.
- **Integrity & Compliance Center:** Monitor candidates dynamically using face detection features to ensure no violation occurs during their AI interview.

### 👤 For Candidates
- **AI Interview Center:** Real-time video/audio interviews enriched with:
  - **Speech-to-Text Recognition:** Live transcribing using `react-speech-recognition`.
  - **Face Tracking / Integrity Checks:** Using `@mediapipe/face_detection` to monitor multiple faces or unauthorized activities.
  - **AI Insights:** Powered by `@google/generative-ai` to assess skills and match dynamically.
- **Smart Resume Parsing:** Uses `pdf-parse` to quickly read applications.

### ⚙️ For Administrators
- **Platform Management:** Oversee logs, user activities, and overall stability.
- **System Activity & Detailed Reports:** Centralized metrics and logging to keep the platform clean.

---

## 🛠️ Tech Stack & Technologies Used

### Frontend 🌐
- **Framework:** React.js (^19.x)
- **Styling:** Vanilla CSS, Bootstrap (^5.3), Framer Motion (^12.x), Canvas Confetti
- **Components & Icons:** Lucide React, react-phone-input-2
- **Integrity & Recording:** `@mediapipe/face_detection`, `react-speech-recognition`

### Backend 🖥️
- **Framework:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI Capabilities:** Google Generative AI (`@google/generative-ai`)
- **Authentication:** Firebase Admin Authentication
- **Utilities:** Multer (File uploads), Nodemailer (Emails), PDF-Parse (Resume evaluation), bcrypt

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v16 or higher mapped version)
* NPM / Yarn
* MongoDB Instance (Local or Atlas)
* Firebase Project Credentials
* Google Generative AI API Key

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/NextOffer.git
   ```

2. **Navigate to the workspace and install backend dependencies:**
   ```sh
   cd NextOffer/backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```sh
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**
   You will need to create two `.env` files:
   
   **In `backend/.env`:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongo_url
   GOOGLE_GEN_AI_KEY=your_gemini_key
   FIREBASE_ADMIN_CREDENTIALS=your_base64_or_json_path
   ```
   **In `frontend/.env`:**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_key
   ```
   *(Consult `.env.example` in both folders for the exact list of variables needed.)*

---

## 💻 Running the Application

NextOffer is built with a separate frontend and backend folder architecture but can be run simultaneously.

**Terminal 1 (Backend):**
```sh
cd backend
npm run dev
```
*(Backend runs on `http://localhost:5000`)*

**Terminal 2 (Frontend):**
```sh
cd frontend
npm start
```
*(Frontend runs on `http://localhost:3000` and proxies APIs to the backend via `package.json` proxy config)*

---

## 📦 Deployment Structure

The project is configured for easy serverless deployment using Vercel. 
The top-level `vercel.json` provides routing instructions to automatically assign the frontend paths to a static build and route `/api/*` to the Node.js Express backend.

---

## 🤝 Contributing & Support
Feel free to open an issue or submit a pull request for new features, bug fixes, or documentation improvements.

**Happy Coding! - [Jerin Sigi](https://github.com/dev-jerin)**
