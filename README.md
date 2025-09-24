# Taskflow

A modern Task & Project Management System built with a Next.js frontend and Node.js/Express backend.

---
## Deployment

- **Frontend:** Deployed on Vercel — [https://taskflow.vercel.app](https://taskflow.vercel.app)
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

## Usage
- Register a new account or log in.
- Create projects and add tasks.
- Drag and drop tasks to organize.
- View analytics in Dashboard
