# Deployment Guide for ViCare

## Option 1: Deploy to Render (Recommended)

### Steps:

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign up/Login with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select repository: `final-project-brenda-medina`

3. **Configure Service**
   - **Name**: `vicare-medicine-tracker` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is fine for testing

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   - `MONGODB_URI` = `mongodb+srv://bcm:vilcare@vilcare.dr0ijnv.mongodb.net/vicare?appName=Vilcare`
   - `SESSION_SECRET` = (generate a random string, e.g., use: `openssl rand -hex 32`)
   - `EMAIL_VERIFY_API_KEY` = `f3a5ed3cabe2fd74c2fcd37772e9a1ca`
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render sets this automatically, but good to have)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Your app will be live at: `https://vicare-medicine-tracker.onrender.com` (or your custom name)

---

## Option 2: Deploy to Railway

### Steps:

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Sign up/Login with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose repository: `final-project-brenda-medina`

3. **Configure Environment Variables**
   Click on your service → "Variables" tab → "New Variable":
   - `MONGODB_URI` = `mongodb+srv://bcm:vilcare@vilcare.dr0ijnv.mongodb.net/vicare?appName=Vilcare`
   - `SESSION_SECRET` = (generate a random string)
   - `EMAIL_VERIFY_API_KEY` = `f3a5ed3cabe2fd74c2fcd37772e9a1ca`
   - `NODE_ENV` = `production`

4. **Deploy**
   - Railway will automatically detect Node.js and deploy
   - Your app will be live at: `https://your-project-name.up.railway.app`

---

## Option 3: Deploy to Vercel (Requires Refactoring)

Vercel uses serverless functions. Your current Express app would need to be refactored to work with Vercel's serverless architecture. This is more complex and not recommended unless you're familiar with serverless functions.

---

## Important Notes:

1. **Session Cookies**: The app is configured to use secure cookies in production
2. **Environment Variables**: Never commit `.env` files to GitHub (already in `.gitignore`)
3. **MongoDB**: Your MongoDB Atlas connection should work from any hosting platform
4. **File Uploads**: Uploaded avatars are stored in `public/uploads/` - these won't persist on free hosting tiers (consider using cloud storage like AWS S3 or Cloudinary for production)

---

## Testing Your Deployment:

After deployment, test:
- ✅ Sign up with a new account
- ✅ Login
- ✅ Add a medicine
- ✅ Add a vaccine
- ✅ Add an appointment
- ✅ Upload profile picture
- ✅ Settings functionality

---

## Troubleshooting:

- **Build fails**: Check that all dependencies are in `package.json`
- **App crashes**: Check logs in Render/Railway dashboard
- **Database connection fails**: Verify `MONGODB_URI` is correct and MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- **Sessions not working**: Ensure `SESSION_SECRET` is set and cookies are enabled in your browser

