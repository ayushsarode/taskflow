# Taskflow

A modern Task & Project Management System built with a Next.js frontend and Node.js/Express backend.

---

## Preview  
Click the image to watch the demo video 👇  

[![demo video](https://img.youtube.com/vi/_6hQY4kVWsk/0.jpg)](https://youtu.be/_6hQY4kVWsk)





---
## Deployment

- **Frontend:** Deployed on Vercel — [Deployed Link](https://taskflow-theta-five.vercel.app/)
- **Backend:** Deployed on Google Cloud Platform (GCP)
---

## Features
- User authentication (login/signup)
- Project and task management
- Drag-and-drop task interface
- Analytics and reporting
- Responsive, modern UI

---

## Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- MongoDB Atlas account (or local MongoDB instance)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/ayushsarode/taskflow.git
cd taskflow
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env # Create your environment file
npm install
```

#### Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.template .env.local # Create your environment file
npm install
```

- Edit `.env.local` and set your API URL or other variables as needed (e.g. `NEXT_PUBLIC_API_URL=http://localhost:4000`).

#### Start the frontend (Next.js) server:
```bash
npm run dev
```

- The frontend will be available at `http://localhost:3000`
- The backend will be available at `http://localhost:4000` 

---

## Testing

To run the backend test suite:

```bash
cd backend
npm test
```

---

## Architecture

This project uses a modern full-stack architecture:

- **Frontend:**
  - Built with Next.js (React framework) for server-side rendering and fast client-side navigation.
  - Uses environment variables (e.g., `NEXT_PUBLIC_API_URL`) to connect to the backend API.
  - Deployed on Vercel for global scalability and performance.

- **Backend:**
  - Node.js with Express.js for RESTful API endpoints.
  - Connects to MongoDB (Atlas or local) for data storage.
  - Handles authentication, business logic, and data management.
  - Deployed on Google Cloud Platform (GCP) for reliability.

- **Communication:**
  - The frontend communicates with the backend via HTTP API calls using the URL specified in the environment variable.

This separation allows independent deployment, scaling, and development of frontend and backend services.

---

## Usage
- Register a new account or log in.
- Create projects and add tasks.
- Drag and drop tasks to organize.
- View analytics in Dashboard
