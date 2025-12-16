# ViCare Application Architecture

## ✅ You Already Have Both Front-End AND Back-End!

This document shows you exactly what you have and how it works together.

---

## 🎨 Front-End (Client-Side)

**Location**: `public/` directory

### Files:

1. **`public/index.html`** - Login/Signup Page
   - User authentication interface
   - Login and signup forms
   - Email verification

2. **`public/dashboard.html`** - Main Application Page
   - Medicine list and form
   - Vaccine list and form
   - Doctor appointments list and form
   - Reminders section
   - Settings modal

3. **`public/css/styles.css`** - Styling
   - All visual design
   - Dark mode support
   - Responsive layout

4. **`public/js/auth.js`** - Authentication Logic
   - Handles login/signup forms
   - Stores JWT tokens in localStorage
   - Redirects to dashboard

5. **`public/js/dashboard.js`** - Dashboard Logic
   - Fetches medicines, vaccines, appointments
   - Adds new items
   - Deletes items
   - Displays reminders

6. **`public/js/settings.js`** - Settings Logic
   - Profile picture upload
   - Emergency contacts
   - Account deletion
   - Dark mode toggle

**Technology**: HTML, CSS, Vanilla JavaScript

---

## ⚙️ Back-End (Server-Side)

**Location**: Root directory + `routes/`, `models/`, `middleware/`, `config/`

### Main Server File:

**`server.js`** - Express Server
- Starts the web server
- Handles HTTP requests
- Serves static files (front-end)
- Routes API requests to appropriate handlers
- Security middleware (helmet, rate limiting, CORS)

### API Routes:

1. **`routes/auth.js`** - Authentication Endpoints
   - `POST /api/auth/signup` - Create new user account
   - `POST /api/auth/login` - Login user
   - `POST /api/auth/logout` - Logout user
   - `GET /api/auth/me` - Get current user profile

2. **`routes/dashboard.js`** - Data Management Endpoints
   - `GET /api/medicines` - Get all medicines
   - `POST /api/medicines` - Add new medicine
   - `DELETE /api/medicines/:id` - Delete medicine
   - `GET /api/vaccines` - Get all vaccines
   - `POST /api/vaccines` - Add new vaccine
   - `DELETE /api/vaccines/:id` - Delete vaccine
   - `GET /api/appointments` - Get all appointments
   - `POST /api/appointments` - Add new appointment
   - `DELETE /api/appointments/:id` - Delete appointment

3. **`routes/settings.js`** - Settings Endpoints
   - `POST /api/avatar` - Upload profile picture
   - `POST /api/support` - Send support message
   - `DELETE /api/account` - Delete account

### Database Models:

- **`models/User.js`** - User schema (email, password, name, avatar, contacts)
- **`models/Medicine.js`** - Medicine schema (name, dose, frequency, dates)
- **`models/Vaccine.js`** - Vaccine schema (name, date, provider)
- **`models/Appointment.js`** - Appointment schema (doctor, date, location)
- **`models/SupportMessage.js`** - Support message schema

### Middleware:

- **`middleware/auth.js`** - JWT token verification
- **`middleware/validation.js`** - Input validation and sanitization

### Configuration:

- **`config/db.js`** - MongoDB connection

**Technology**: Node.js + Express + MongoDB

---

## 🔄 How Front-End and Back-End Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Front-End (HTML/CSS/JS)                             │  │
│  │  - index.html (Login page)                           │  │
│  │  - dashboard.html (Main app)                         │  │
│  │  - auth.js, dashboard.js, settings.js                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP Requests (fetch API)
                          │ Authorization: Bearer <token>
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              RENDER.COM (Cloud Server)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Back-End (Node.js + Express)                         │  │
│  │  - server.js (Main server)                            │  │
│  │  - routes/auth.js (Authentication)                    │  │
│  │  - routes/dashboard.js (Data CRUD)                     │  │
│  │  - routes/settings.js (Settings)                      │  │
│  │  - middleware/auth.js (JWT verification)              │  │
│  │  - middleware/validation.js (Input validation)         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Database Queries
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud Database)                 │
│  - Users collection                                          │
│  - Medicines collection                                      │
│  - Vaccines collection                                       │
│  - Appointments collection                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Communication Flow

### Example: Adding a Medicine

1. **User fills form** in `dashboard.html` (Front-End)
2. **JavaScript** (`dashboard.js`) sends POST request:
   ```javascript
   fetch('/api/medicines', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer <token>',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ name: 'Aspirin', dose: '100mg' })
   })
   ```
3. **Express server** (`server.js`) receives request
4. **Route handler** (`routes/dashboard.js`) processes request
5. **Middleware** (`middleware/auth.js`) verifies JWT token
6. **Validation** (`middleware/validation.js`) validates input
7. **Database** (`models/Medicine.js`) saves to MongoDB
8. **Response** sent back to front-end
9. **Front-end** updates the UI to show new medicine

---

## ✅ Summary: You Have Everything!

| Component | Status | Location |
|-----------|--------|----------|
| **Front-End** | ✅ Complete | `public/` directory |
| **Back-End** | ✅ Complete | Root + `routes/`, `models/`, `middleware/` |
| **Database** | ✅ Complete | MongoDB Atlas (cloud) |
| **API** | ✅ Complete | RESTful endpoints in `routes/` |
| **Security** | ✅ Complete | JWT, validation, rate limiting |
| **Deployment** | ✅ Complete | Render.com (hosting) |

---

## 🚀 Your Application is Full-Stack!

- **Front-End**: Handles user interface and interactions
- **Back-End**: Handles business logic, data processing, and database operations
- **API**: Connects front-end and back-end via RESTful endpoints
- **Database**: Stores all user data securely

**Everything is already implemented and working!** 🎉

