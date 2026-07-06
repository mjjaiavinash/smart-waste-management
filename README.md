# Smart Waste Management System ♻️

A full-stack web application that allows citizens to report waste issues in their city and enables admins to manage, track, and resolve those reports through a dedicated dashboard.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| Recharts | Analytics charts |
| React Leaflet + Leaflet | Interactive maps |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas + Mongoose | Database |
| JSON Web Token (JWT) | Authentication (7-day expiry) |
| bcryptjs | Password hashing |
| Multer | Image file uploads |
| dotenv | Environment variables |

---

## Project Structure

```
smart-waste-management/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Sticky navbar, role-based links, mobile responsive
│   │   │   ├── Footer.js          # Footer component
│   │   │   ├── ReportCard.js      # Card to display a single waste report
│   │   │   ├── DashboardCard.js   # Stat card for admin dashboard
│   │   │   └── LoadingSpinner.js  # Reusable loading spinner
│   │   ├── pages/
│   │   │   ├── user/
│   │   │   │   ├── Home.js        # Landing page with stats, features, how it works
│   │   │   │   ├── Login.js       # User login
│   │   │   │   ├── Register.js    # User registration
│   │   │   │   ├── ReportWaste.js # Report form with map pin + image upload
│   │   │   │   └── MyReports.js   # User's submitted reports with filter
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js      # Admin-only login page
│   │   │       ├── Dashboard.js       # Stats, recent reports, registered users
│   │   │       ├── Analytics.js       # Pie chart + bar chart (Recharts)
│   │   │       ├── AdminReports.js    # Table view, status update, delete
│   │   │       ├── MapView.js         # All report locations on Leaflet map
│   │   │       └── ManageAdmins.js    # Create and delete admin accounts
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.js  # Redirects unauthenticated users to /login
│   │   │   └── AdminRoute.js      # Redirects non-admins to /
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + all API call functions
│   │   ├── App.js                 # Route definitions
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Tailwind + global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB Atlas connection
│   │   └── database.sql           # SQL reference schema
│   ├── controllers/
│   │   ├── authController.js      # register, login logic
│   │   └── reportController.js    # CRUD operations for reports
│   ├── middleware/
│   │   └── auth.js                # verifyToken, verifyAdmin middleware
│   ├── models/
│   │   ├── User.js                # name, email, password, role (user/admin)
│   │   └── Report.js              # waste_type, description, location, lat/lng, image, status
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   └── reportRoutes.js        # /api/reports/*
│   ├── uploads/                   # Uploaded waste images stored here
│   ├── seedAdmin.js               # Script to create default admin account
│   ├── server.js                  # Express app entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm
- MongoDB Atlas account (or use the existing connection in `.env`)

### 1. Clone the repository
```bash
git clone https://github.com/mjjaiavinash/smart-waste-management.git
cd smart-waste-management
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Seed the default admin account:
```bash
node seedAdmin.js
```

Start the backend server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login (user or admin) |
| GET | `/users` | Admin | Get all users |
| POST | `/create-admin` | Admin | Create a new admin account |
| DELETE | `/users/:id` | Admin | Delete a user |

### Reports — `/api/reports`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | User | Submit a new waste report (with image) |
| GET | `/my` | User | Get current user's reports |
| GET | `/all` | Admin | Get all reports |
| PUT | `/:id/status` | Admin | Update report status |
| DELETE | `/:id` | Admin | Delete a report |

---

## Routes

### Public
| Path | Page |
|---|---|
| `/` | Home — landing page |
| `/login` | User login |
| `/register` | User registration |
| `/admin/login` | Admin login |

### User (requires login)
| Path | Page |
|---|---|
| `/report` | Submit a waste report |
| `/my-reports` | View and filter your reports |

### Admin (requires admin role)
| Path | Page |
|---|---|
| `/dashboard` | Stats overview + recent reports + users |
| `/analytics` | Pie chart (waste types) + bar chart (daily reports) |
| `/admin/reports` | Manage all reports — update status, delete |
| `/admin/map` | Map view of all report locations |
| `/admin/manage-admins` | Create and delete admin accounts |

---

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@gmail.com` | `admin123` |

> Register a new account at `/register` for user access.

---

## Data Models

### User
```
name        String   required
email       String   required, unique
password    String   required (bcrypt hashed)
role        String   'user' | 'admin'  (default: 'user')
timestamps  createdAt, updatedAt
```

### Report
```
user_id     ObjectId  ref: User
waste_type  String    'Plastic' | 'Organic' | 'Metal' | 'Medical' | 'Other'
description String    required
location    String    required
latitude    Number    optional
longitude   Number    optional
image       String    file path (optional)
status      String    'Pending' | 'In Progress' | 'Completed'  (default: 'Pending')
timestamps  createdAt, updatedAt
```

---

## Key Features

- **JWT Authentication** — tokens stored in localStorage, expire in 7 days
- **Role-based access** — separate user and admin flows with route guards
- **Waste reporting** — submit reports with waste type, description, map pin location, and optional photo
- **Interactive map** — click to pin location on OpenStreetMap, auto-fills address via Nominatim reverse geocoding
- **Image upload** — photos stored in `backend/uploads/` via Multer
- **Admin dashboard** — real-time stats (total, pending, in progress, completed)
- **Analytics** — pie chart for waste type distribution, bar chart for daily reports this week
- **Map view** — all report locations plotted on a Leaflet map with popups
- **Manage admins** — create and delete admin accounts from the UI
- **Responsive UI** — mobile hamburger menu, works on all screen sizes

---

## Environment Variables

Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smart_waste_db
JWT_SECRET=your_secret_key
PORT=5000
```

> Never commit `.env` to GitHub. It is already listed in `.gitignore`.

---

## License

MIT
