# ⚡ CampusConnect - Full Stack Web Architecture

> **CampusConnect** is a comprehensive college event discovery, club engagement, and event registration platform. Built with a modern **Node.js & Express** backend, **MongoDB / Mongoose ODM** for database persistence, high-performance **Local JSON File storage** APIs, resilient **External API integrations**, and an interactive frontend with an integrated testing hub.

---

## 🎯 Architecture Overview & The 4 Parameters

This project strictly adheres to and demonstrates all 4 required parameters:

| Parameter | Feature | Technology / Implementation | Endpoints / Modules |
| :--- | :--- | :--- | :--- |
| **1** | **Fetching & Showing External APIs Data** | Live Weather Forecast (Open-Meteo API), Daily Motivational Quote (DummyJSON/Quotable), and Semester Holidays API with graceful offline caching. | `GET /api/external/weather`<br>`GET /api/external/quote`<br>`GET /api/external/holidays`<br>`GET /api/external/feed` |
| **2** | **Node & Express Setup** | Enterprise-grade Express server with CORS, body parsers, environment configurations (`.env`), static page serving, centralized error handling, and graceful shutdown. | `server.js`<br>`backend/config/db.js`<br>`backend/middleware/` |
| **3** | **Express APIs for Local JSON Storage** | Asynchronous, atomic file-based persistence for Events, Registrations, Clubs, and Feedback using Node's `fs.promises`. | `GET/POST /api/local/events`<br>`GET/POST /api/local/registrations`<br>`GET/POST /api/local/clubs`<br>`GET/POST /api/local/feedback` |
| **4** | **CRUD Operations with MongoDB** | Full RESTful Mongoose CRUD operations managing Events, Registrations, and Clubs with schema validation, indexing, and relationships. | `POST /api/events` (Create)<br>`GET /api/events` (Read)<br>`PUT/PATCH /api/events/:id` (Update)<br>`DELETE /api/events/:id` (Delete)<br>`POST/GET/PUT/DELETE /api/registrations` |

---

## 📂 Project Structure

```text
Campus_Connect-main/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection & reconnection handler
│   ├── controllers/
│   │   ├── externalController.js    # Parameter 1: External API handlers
│   │   ├── jsonController.js        # Parameter 3: Local JSON storage controller
│   │   ├── eventController.js       # Parameter 4: MongoDB Event CRUD controller
│   │   ├── registrationController.js# Parameter 4: MongoDB Registration CRUD controller
│   │   └── clubController.js        # Parameter 4: MongoDB Club CRUD controller
│   ├── data/                        # Parameter 3: Local JSON storage files
│   │   ├── events.json              # Campus events data store
│   │   ├── clubs.json               # Student clubs data store
│   │   ├── registrations.json       # Student registration records
│   │   └── feedback.json            # Student inquiries & feedback
│   ├── middleware/
│   │   ├── errorHandler.js          # Centralized error & 404 handler
│   │   └── logger.js                # HTTP request logger
│   ├── models/
│   │   ├── Event.js                 # Mongoose Event schema
│   │   ├── Registration.js          # Mongoose Registration schema
│   │   └── Club.js                  # Mongoose Club schema
│   ├── routes/
│   │   ├── externalRoutes.js        # Parameter 1: /api/external/*
│   │   ├── jsonRoutes.js            # Parameter 3: /api/local/*
│   │   ├── eventRoutes.js           # Parameter 4: /api/events/*
│   │   ├── registrationRoutes.js    # Parameter 4: /api/registrations/*
│   │   └── clubRoutes.js            # Parameter 4: /api/clubs/*
│   ├── services/
│   │   ├── externalApiService.js    # Parameter 1: External HTTP client
│   │   └── jsonStorageService.js    # Parameter 3: Atomic fs.promises service
│   ├── test/
│   │   └── api-test-runner.js       # Automated verification test suite
│   └── seed.js                      # MongoDB seeder script
├── public/
│   └── api-docs.html                # Interactive API Documentation & Test Console
├── frontend-api-client.js           # Dynamic data hydration client for frontend
├── server.js                        # Parameter 2: Server entry point
├── package.json                     # Dependencies & scripts
├── .env                             # Environment configuration
├── .env.example                     # Environment template
│
│── [Frontend Views]
├── index/                           # Home page (Hero, stats, featured events)
├── events/                          # Events list (Search, filter, weather badge)
├── event-detail/                    # Event detailed schedule & info
├── registration/                    # Live dynamic registration form & QR pass
├── clubs/                           # Student clubs directory
├── calendar/                        # Event calendar view
├── dashboard/                       # Student dashboard with registered events & quote
├── profile/                         # User profile view
└── auth/                            # Authentication (Login/Logout)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** (Local `mongod` service or MongoDB Atlas cluster connection string)

### 2. Installation
Open your terminal inside the project directory:
```bash
npm install
```

### 3. Environment Setup
The `.env` file is pre-configured:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/campus_connect
WEATHER_API_BASE_URL=https://api.open-meteo.com/v1
CAMPUS_LATITUDE=28.6139
CAMPUS_LONGITUDE=77.2090
CAMPUS_CITY="New Delhi"
ENABLE_JSON_FALLBACK=true
```

### 4. Seed the Database (Optional)
To populate MongoDB with realistic initial campus events, clubs, and registrations:
```bash
npm run seed
```

### 5. Start the Server
- **Production / Standard start:**
  ```bash
  npm start
  ```
- **Development (Auto-reload):**
  ```bash
  npm run dev
  ```

Once started:
- 🌐 **Web Application:** [http://localhost:5000](http://localhost:5000)
- 📖 **Interactive API Documentation & Test Console:** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- 🩺 **Health Check & Diagnostics:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Automated Test Suite

Run the automated verification suite to validate all 4 parameters:
```bash
npm test
```
The test suite validates:
1. External weather and quote API connections, JSON parsing, and outdoor advisories.
2. Local JSON file reading, safe atomic appending, updating, and deletion.
3. Student registration validation, seat limit calculation, and custom ID generation.

---

## 📡 API Reference

### Parameter 1: External APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/external/weather` | Live campus weather forecast & fest outdoor advisory from Open-Meteo. |
| `GET` | `/api/external/quote` | Daily student inspirational quote. |
| `GET` | `/api/external/holidays` | Academic and national holiday calendar. |
| `GET` | `/api/external/feed` | Aggregated weather + daily quote bundle for widgets. |

### Parameter 3: Local JSON File Storage APIs
| Method | Endpoint | Description | Storage File |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/local/events` | Fetch all events | `backend/data/events.json` |
| `GET` | `/api/local/events/:id` | Fetch event by ID | `backend/data/events.json` |
| `POST` | `/api/local/events` | Save new event | `backend/data/events.json` |
| `PUT` | `/api/local/events/:id` | Update existing event | `backend/data/events.json` |
| `DELETE` | `/api/local/events/:id` | Delete event | `backend/data/events.json` |
| `GET` | `/api/local/registrations` | Fetch student registrations | `backend/data/registrations.json` |
| `POST` | `/api/local/registrations` | Save student registration | `backend/data/registrations.json` |
| `GET` | `/api/local/clubs` | Fetch clubs list | `backend/data/clubs.json` |
| `POST` | `/api/local/clubs` | Add new club | `backend/data/clubs.json` |
| `POST` | `/api/local/feedback` | Save student inquiry | `backend/data/feedback.json` |

### Parameter 4: MongoDB CRUD APIs
| Operation | Method | Endpoint | Payload / Query Params |
| :--- | :--- | :--- | :--- |
| **CREATE** | `POST` | `/api/events` | `{ "title", "category", "venue", "club", "totalSeats", ... }` |
| **READ ALL** | `GET` | `/api/events` | Query params: `?category=Hackathon&search=Tech&sort=date` |
| **READ ONE** | `GET` | `/api/events/:id` | MongoDB `_id` or Title slug |
| **UPDATE** | `PUT` | `/api/events/:id` | `{ "title", "venue", "totalSeats", ... }` |
| **PATCH** | `PATCH` | `/api/events/:id` | Partial update fields `{ "registeredSeats": 190 }` |
| **DELETE** | `DELETE` | `/api/events/:id` | Removes document from collection |
| **CREATE** | `POST` | `/api/registrations` | `{ "eventTitle", "fullName", "rollNumber", "email", ... }` |
| **READ ALL** | `GET` | `/api/registrations` | Filter: `?email=student@college.edu&eventTitle=TechFest` |
| **READ ONE** | `GET` | `/api/registrations/:id` | Lookup by `_id` or Registration ID (`CC-2026-0847`) |
| **UPDATE** | `PUT` | `/api/registrations/:id` | Update registration attributes (e.g. t-shirt size, dietary) |
| **DELETE** | `DELETE` | `/api/registrations/:id` | Cancels pass and automatically decrements event seat count |

---

## 🛡️ Robustness & Fallback Design

- **Dual-Mode Data Handling:** If MongoDB is offline, the backend automatically transitions to the Local JSON store for both reads and writes. The server will never crash due to a missing database connection.
- **Resilient External APIs:** If external API requests encounter network latency or sandbox boundaries, the system automatically falls back to an offline cache with pre-calculated campus advisories.
- **Atomic JSON Writes:** File modifications write to a temporary file before renaming, preventing file corruption during high concurrency.
