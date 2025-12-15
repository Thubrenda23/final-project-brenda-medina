## ViCare - Medicine & Vaccine Tracker

ViCare is a simple web app that helps users track their medicines, vaccines, and doctor appointments.

### Tech stack

- Node.js + Express
- MongoDB (via Mongoose)
- HTML, CSS, and vanilla JavaScript (no React)

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

- Login / Sign up (email is verified with the apilayer email check service).
- Cloud storage of each user's medicines and vaccines in MongoDB Atlas.
- Track doctor appointments, with upcoming appointments (next 7 days) highlighted.
- Settings: update avatar URL, contact support, and delete account (and related data).


