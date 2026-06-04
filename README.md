# Lead Management CRM

A robust, full-stack application designed to help internal sales teams efficiently manage, track, and analyze leads through various stages of the sales pipeline.

## 🚀 Live Links
- **Frontend (Vercel):** https://lead-manager-crm-eight.vercel.app/
- **Backend API (Render):** https://lead-manager-crm-3pdt.onrender.com

## ✨ Key Features
- **Complete CRUD Operations:** Create, Read, Update, and Delete leads seamlessly.
- **Clean, Responsive Dashboard UI:** Built with Tailwind CSS to ensure a beautiful and intuitive user experience across all devices.
- **Interactive Status Management:** Easy-to-use dropdowns to transition leads through the pipeline (New, Contacted, Qualified, Converted, Lost).
- **Advanced Search & Filtering:** A dedicated search bar to quickly find leads by name, email, or company.
- **Dynamic Statistics Header (Bonus Feature):** A real-time dashboard component that instantly calculates and displays Total Leads, Active Pipeline, Converted, and Lost metrics based on the current database state.
- **Form Functionality:** Robust forms designed to add new leads and edit existing ones with ease.

## 🛠 Tech Stack
- **Frontend:** React (scaffolded with Vite), standard JavaScript, Tailwind CSS, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (hosted on MongoDB Atlas), Mongoose.
- **Deployment:** Frontend on Vercel, Backend on Render.

## 💻 Local Setup & Installation

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/lead-manager-crm.git
cd lead-manager-crm
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your MongoDB connection string and port:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder (if using custom environment variables for the API URL):
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## 📡 API Endpoints Summary

All routes are prefixed with `/api/leads`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Fetch all leads from the database |
| `POST` | `/` | Create and add a new lead |
| `PUT` | `/:id` | Update an existing lead's details or status |
| `DELETE` | `/:id` | Remove a lead from the database |

## 🙏 Thank You
Thank you for taking the time to review my submission. I thoroughly enjoyed working on this assignment, building out the features, and implementing the bonus statistics functionality. I look forward to discussing the project and my technical choices with the team!
