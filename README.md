# Institute Resource Planning (MERN) — AZ Coaching Center | Version 1.0

A role-based institute/coaching management system built with **MongoDB + Express + React (Vite) + Node.js**.

This repository contains:
- `backend/` → Express API + MongoDB (Mongoose)
- `frontend-new/` → React (Vite) role-based portals (Admin/Receptionist/Teacher/Student)
- `MobileApp/irp_mobile_app` → Flutter Mobile App with all portals (Newly added)
- `docker-compose.yml` → Local Docker deployment (Mongo + Backend + Frontend)

---

## Features

### Role-Based Portals (RBAC)
- **Admin**
  - Dashboard (counts)
  - Manage Teachers
  - Manage Receptionists
  - View Students (admin listing)
- **Receptionist**
  - Register / edit / delete students
  - Mark attendance
  - Collect fees & check fee status
- **Teacher**
  - View students by class
  - Upload results (image-based)
- **Student**
  - Dashboard (results / fee status / etc. depending on backend endpoints)

### Authentication
- Login supports **email** or **identifier** (roll no / teacher id)
- Backend issues JWT in **HTTP-only cookie** (`token`)
- Frontend sends cookies via Axios `withCredentials: true`

---

## Tech Stack
- Frontend: React + Vite + TailwindCSS + Axios + React Router
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT + Multer
- Docker: Docker Desktop / Docker Compose

---

## Repository Structure


---

## Prerequisites (Windows 11)
- Node.js (recommended 18+ or 20+)
- MongoDB (only if running without Docker)
- Docker Desktop (for Docker deployment)

---

### Frontend (`frontend-new`)
- The API base URL is read from:
  - `VITE_API_URL` (recommended), otherwise defaults to `http://localhost:5000/api`
- Example:
  - `VITE_API_URL=http://localhost:5000/api`

---

## Run Locally (Without Docker)

### 1) Backend
From `InstituteResourcePlanning/backend`:
```bash
npm install
npm start
```

Backend starts on:
- `http://localhost:5000`

### 2) Frontend
From `InstituteResourcePlanning/frontend-new`:
```bash
npm install
npm run dev
```

Frontend starts on:
- `http://localhost:5173`

---

---

## Docker Deployment (Mongo + Backend + Frontend)

### Files already in repo
- `backend/dockerfile`
- `frontend-new/dockerfile`
- `docker-compose.yml`

### Step-by-step (Windows 11 + Docker Desktop)

1) Start Docker Desktop (ensure it shows **Running**)

2) Open PowerShell in:
   - `d:\InstituteResourcePlanning`

3) Build and start containers:
```bash
docker compose up --build -d
```

4) Check running containers:
```bash
docker compose ps
```

5) View logs:
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

6) Open app:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/`

7) Stop everything:
```bash
docker compose down
```

8) Stop + delete MongoDB data (fresh DB):
```bash
docker compose down -v
```

### Docker Notes (important)
- Compose builds using the lowercase `dockerfile` filename (already configured in `docker-compose.yml`).
- Mongo is accessible to backend via internal hostname `mongo`.
- In Docker, backend uses `MONGO_URI=mongodb://mongo:27017/irp`.

---

## API Overview (high-level)

Base URL (backend):
- `http://localhost:5000/api`

Auth:
- `POST /api/auth/login`
- `GET /api/auth/logout`

One-time setup:
- `POST /api/setup/register-first-admin`

Admin:
- `GET /api/admin/az-teachers/getAllStudents`
- `GET /api/admin/az-teachers/fetch-all-teachers`
- `POST /api/admin/az-teachers/register-teacher`
- `POST /api/admin/az-reception/register-receptionist`
- etc.

Receptionist Fees:
- `POST /api/reception/fees/collect`
- `GET /api/reception/fees/student/:rollNo`

Teacher:
- `POST /api/teacher/upload-result` (multipart/form-data, field name `image`)
- `GET /api/teacher/students/:className`

Student:
- Student dashboard uses student-scoped endpoints (see `frontend-new/src/components/Student/StudentDashboard.jsx`)

---

## Common Troubleshooting

### 1) CORS / Cookie issues
- Frontend uses cookies (`withCredentials: true`)
- Backend CORS must allow your frontend origin
- For local Docker, use: `http://localhost:5173`

### 2) First admin not creating
- If DB already has an admin, setup returns 403
- Reset DB volume:
  ```bash
  docker compose down -v
  docker compose up --build
  ```

### 3) Blank frontend page
- Open browser console and check errors
- Ensure frontend points to correct API:
  - `VITE_API_URL` or default `http://localhost:5000/api`

### 4) Uploads persistence (optional)
Teacher result uploads temporarily use `uploads/`.
If you want persistence in Docker, map a volume in `docker-compose.yml` (example):
```yaml
backend:
  volumes:
    - ./backend/uploads:/app/uploads
```


## Scripts

### Backend (`backend/package.json`)
- `npm start` → starts server (`node src/app.js`)

### Frontend (`frontend-new/package.json`)
- `npm run dev` → dev server
- `npm run build` → production build
- `npm run lint` → eslint
- `npm run preview` → preview build

---
