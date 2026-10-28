# CiviGo 🚀

[![Live Demo](https://img.shields.io/badge/Live%20Demo-civigo.web.app-00c853?style=for-the-badge&logo=firebase)](https://civigo.web.app)
[![Backend API](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://civigo-backend.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-suyogshelke%2FCiviGo-181717?style=for-the-badge&logo=github)](https://github.com/suyogshelke/CiviGo)

**CiviGo** is an intelligent, full-stack civic engagement and issue resolution platform connecting citizens with local municipal authorities. It empowers urban communities to report municipal problems (potholes, garbage accumulation, water leakages, streetlight faults), track their progress with real-time SLA monitoring, and provides officers and city administrators with dedicated command consoles to manage remediation pipelines transparently.

---

## 🌐 Live Deployments

* **Frontend Web App:** [https://civigo.web.app](https://civigo.web.app) *(Alternative: [https://civigo.firebaseapp.com](https://civigo.firebaseapp.com))*
* **Backend REST API:** [https://civigo-backend.onrender.com](https://civigo-backend.onrender.com)
* **Firebase Project:** `civicsystem-59fef` (Hosting Site: `civigo`)

---

## 🔑 Demo Access Accounts

The login page features instant auto-fill buttons for quick role access:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Citizen** | `suyog@civigo.in` | `Citizen@123` | Civic Command Center, Report Issues, Track Tickets |
| **Field Officer** | `rahul.officer@civigo.in` | `Officer@123` | Field Console, Assigned Complaints, Priority Queue |
| **Administrator** | `admin@civigo.in` | `Admin@123` | City Command & Operations, Telemetric Analytics, Department Management |

---

## 🌟 Key Features

### 👤 Citizen Portal
* **Intuitive Issue Reporting**: Submit geo-tagged civic incidents with photo evidence, ward classification, and priority weighting.
* **Full-Lifecycle Tracking**: Monitor ticket progress through stages: `Submitted` ➔ `Under Review` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.
* **Citizen Feedback**: Rate and comment on completed remediation work to uphold civic standards.
* **Public Tracking**: Track complaints instantly without logging in using ticket reference numbers.

### 👷 Field Officer Console
* **Dedicated Department Workspace**: Structured view of tickets assigned to the officer's jurisdiction.
* **SLA Priority Queue**: Real-time indicators highlighting overdue tickets and turnaround deadlines.
* **Field Updates**: Change remediation status, attach inspection remarks, and submit resolution proof.

### 🏛️ Municipal Executive Oversight
* **City Command Telemetry**: Real-time aggregate counters for total complaints, pending triage, resolution rates, and critical SLA alerts.
* **Temporal & Lifecycle Analytics**: Interactive charts powered by Recharts showing 6-month submission vs. resolution trends and status distribution.
* **Department Performance**: Resolution velocity tracking across Water Supply, Sanitation, Public Works, Electrical, and Health departments.

---

## 🛠 Tech Stack

* **Frontend**:
  * [React 18](https://react.dev/) & [Vite](https://vitejs.dev/)
  * [Bootstrap 5](https://getbootstrap.com/) with customized modern dark-mode glassmorphism
  * [Recharts](https://recharts.org/) for data visualization & telemetry
  * [Bootstrap Icons](https://icons.getbootstrap.com/)
  * [React Router v6](https://reactrouter.com/)
* **Backend**:
  * [Django 5](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/)
  * JWT (JSON Web Token) Bearer Authentication
  * Role-Based Access Control (RBAC) & SLA tracking algorithms
* **Hosting & Infrastructure**:
  * **Frontend**: [Firebase Hosting](https://firebase.google.com/docs/hosting) (Site: `civigo`, Project: `civicsystem-59fef`)
  * **Backend**: [Render Web Service](https://render.com/) with Gunicorn

---

## 🚀 Local Development

### Prerequisites
* **Node.js**: v18+
* **Python**: 3.10+
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/suyogshelke/CiviGo.git
cd CiviGo
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows (or: source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
The API server will run at `http://127.0.0.1:8000`.

---

## 📦 Deployment

### Frontend (Firebase Hosting)
The repository is pre-configured with `firebase.json` and `.firebaserc` targeting the `civigo` site under `civicsystem-59fef`:

```bash
cd frontend
npm run build
npx firebase-tools deploy --only hosting
```
*Live site accessible at: [https://civigo.web.app](https://civigo.web.app)*

### Backend (Render)
The backend includes a `build.sh` script for Render deployment:
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

---

## 📄 License
This project is licensed under the MIT License.
