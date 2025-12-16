## ViCare - Medicine & Vaccine Tracker

ViCare is a simple web app that helps users track their medicines, vaccines, and doctor appointments.

### Tech stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT tokens
- **Security**: bcrypt, express-validator, helmet, rate limiting
- **Cloud**: Render (hosting) + MongoDB Atlas (database)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with:

```bash
MONGODB_URI=mongodb+srv://bcm:vilcare@vilcare.dr0ijnv.mongodb.net/?appName=Vilcare
SESSION_SECRET=change_this_secret
EMAIL_VERIFY_API_KEY=YOUR_APILAYER_ACCESS_KEY
```

3. Run the app:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Features

- **Authentication**: Secure login/signup with JWT tokens and email verification
- **Medicine Tracking**: Add, view, and delete medicines with dosage and frequency
- **Vaccine Tracking**: Track vaccines with dates and provider information
- **Appointment Reminders**: Track doctor appointments with automatic reminders (next 7 days)
- **User Profile**: Upload profile picture, set emergency contacts
- **Settings**: Dark mode, account management, support contact
- **Security**: Password hashing, input validation, rate limiting, security headers

### Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Input validation and sanitization
- ✅ Rate limiting (prevents brute force attacks)
- ✅ Security headers (Helmet.js)
- ✅ HTTPS in production
- ✅ XSS prevention
- ✅ MongoDB injection prevention

See [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for detailed security implementation.

### Technology Choices

This project uses Node.js/Express instead of Python/Flask and Render instead of Vercel. See [TECH_STACK_EXPLANATION.md](./TECH_STACK_EXPLANATION.md) for detailed rationale.


