# 🌿 Nature-Ventures

> Transforming Nature Experiences Into Lasting Memories

![Last Commit](https://img.shields.io/github/last-commit/Shaxhwat7/nature-ventures?style=for-the-badge)
![Language](https://img.shields.io/github/languages/count/Shaxhwat7/nature-ventures?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-91.7%25-blue?style=for-the-badge)

---

## 🚀 Overview

**Nature-Ventures** is an all-in-one platform designed to empower developers and adventure businesses to build scalable **experience booking applications**.  
It combines a **robust backend API** with a **component-rich frontend**, enabling seamless management of experiences, scheduling, and reservations.

### ✨ Why Nature-Ventures?

This project simplifies the development of experience-based platforms by offering a modular architecture, reliable TypeScript setup, and reusable UI components.

**Core Highlights:**

- 🧩 **Modular Architecture:** Clear separation between server and client for maintainability and scalability.  
- 🎨 **Rich UI Components:** Reusable React components styled with TailwindCSS.  
- 🔌 **API Layer:** Manage experiences, slots, and bookings via REST APIs.  
- 🔒 **TypeScript Reliability:** Strong type safety and build-time checks.  
- ⚙️ **Utility Functions:** Simplify API and styling logic for better developer productivity.  

---

## 🧰 Built With

| Technology | Purpose |
|-------------|----------|
| **React + Vite** | Frontend development |
| **Express.js** | Backend framework |
| **TypeScript** | Static typing |
| **MongoDB + Mongoose** | Database layer |
| **Axios** | HTTP client |
| **ESLint** | Code linting |
| **Date-fns** | Date management |
| **TailwindCSS** | UI styling |

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or above)
- **npm** or **yarn**
- **MongoDB** (for backend)

---

## 🏗️ Installation

Follow these steps to set up the project locally:

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Shaxhwat7/nature-ventures.git
cd nature-ventures
cd frontend
npm install

cd ../backend
npm install
cd backend
npm run dev
cd frontend
npm run dev
▶️ Running Locally
Start Backend
cd backend
npm run dev


Backend will run on → http://localhost:3001

Start Frontend
cd frontend
npm run dev


Frontend will run on → http://localhost:3000

🌍 Environment Variables
Backend (.env)
PORT=3001
MONGODB_URI=your_mongodb_connection_string

Frontend (.env)
VITE_BACKEND_URL=https://nature-ventures.onrender.com

🧪 API Endpoints
Method	Endpoint	Description
GET	/api/experiences	Get all experiences
GET	/api/experiences/:id	Get specific experience
POST	/api/bookings	Create new booking
GET	/uploads/:imageName	Fetch uploaded images
📂 Project Structure
nature-ventures/
│
├── backend/
│   ├── server.ts
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── uploads/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── api/
│   │   ├── hooks/
│   │   └── assets/
│   ├── vite.config.ts
│   └── package.json
│
└── README.md

🚀 Deployment
Service	URL
Frontend (Vercel)	https://nature-ventures.vercel.app

Backend (Render)	https://nature-ventures.onrender.com
💡 Future Enhancements

🔐 Add JWT-based authentication

🧾 Admin dashboard for managing experiences and slots

💬 User reviews and ratings

☁️ Cloud image storage (Cloudinary / AWS S3)

🗺️ Map-based location view

🤝 Contributing

Fork the repository

Create a new branch (feature/your-feature-name)

Commit your changes

Push to your branch

Create a pull request

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Shashwat Sharma
🔗 GitHub

🔗 LinkedIn

