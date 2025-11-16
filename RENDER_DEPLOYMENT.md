# Render.com Deployment Guide for FitsNew

Step-by-step guide to deploy your FitsNew e-commerce website to Render.com (FREE).

---

## 📋 Prerequisites

1. ✅ Your code is pushed to GitHub
2. ✅ You have a Render.com account (sign up at [render.com](https://render.com))
3. ✅ Your domain `fitsnew.in` is ready in GoDaddy

---

## 🚀 Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your **GitHub account** (recommended for easy deployment)

---

## 🚀 Step 2: Create a New Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Select your repository: `fitsnew` (or your repo name)
4. Click **"Connect"**

---

## ⚙️ Step 3: Configure Build Settings

Render will auto-detect Node.js, but verify these settings:

### Basic Settings:
- **Name:** `fitsnew` (or any name you prefer)
- **Region:** Choose closest to your users (e.g., `Oregon (US West)` or `Frankfurt (EU Central)`)
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (or `.` if needed)

### Build & Deploy:
- **Runtime:** `Node`
- **Build Command:** 
  ```
  npm install && npm run build
  ```
- **Start Command:**
  ```
  npm start
  ```

### Environment Variables:
Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
PORT=10000
```

**Note:** Render automatically sets `PORT`, but we're setting it explicitly to be safe.

---

## 🚀 Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. Wait for build to complete (5-10 minutes)
4. You'll see a URL like: `https://fitsnew.onrender.com`

---

## 🌐 Step 5: Setup Custom Domain

### In Render Dashboard:

1. Go to your service → **"Settings"** tab
2. Scroll to **"Custom Domains"** section
3. Click **"Add Custom Domain"**
4. Enter: `fitsnew.in`
5. Click **"Save"**
6. Add another: `www.fitsnew.in`
7. Click **"Save"**

Render will show you DNS records to add.

### In GoDaddy DNS:

1. Login to [GoDaddy](https://godaddy.com)
2. Go to **My Products** → **Domains** → **fitsnew.in** → **DNS**
3. **Remove any existing A or CNAME records** for `@` and `www`
4. Add these records:

#### For Root Domain (@):
- **Type:** `CNAME`
- **Name:** `@`
- **Value:** `fitsnew.onrender.com` (or the hostname Render shows)
- **TTL:** `600`

#### For www Subdomain:
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `fitsnew.onrender.com` (same as above)
- **TTL:** `600`

**Note:** If GoDaddy doesn't allow CNAME for root domain (@), use:
- **Type:** `A`
- **Name:** `@`
- **Value:** [IP address from Render - check Render docs or support]

---

## 🔒 Step 6: SSL Certificate (Automatic)

Render automatically provisions SSL certificates for your custom domain. Wait 5-10 minutes after adding the domain, then your site will be available at:
- ✅ `https://fitsnew.in`
- ✅ `https://www.fitsnew.in`

---

## ✅ Step 7: Verify Everything Works

Test these URLs:
1. **Home:** `https://fitsnew.in/`
2. **Shop:** `https://fitsnew.in/shop`
3. **Admin Login:** `https://fitsnew.in/admin/login`
4. **Cart:** `https://fitsnew.in/cart`

---

## 🔧 Important Configuration Notes

### ✅ File Uploads & Storage:

**Yes, Render CAN handle file storage!** Here's how it works:

#### How It Works:
- ✅ Admin can upload product photos via `/admin/dashboard`
- ✅ Files are stored in `public/uploads/` directory
- ✅ Files are **persistent** on Render (they survive deployments)
- ✅ Files are served via your Express server at `/uploads/` route
- ✅ Your app already handles this - no code changes needed!

#### Current Setup:
Your app uses:
- **Multer** for file uploads
- **Express static middleware** to serve uploaded files
- Files stored in: `dist/server/public/uploads/` or `public/uploads/`

#### Render Storage Details:
- **Free Tier:** Persistent disk storage included
- **File Persistence:** Files persist between deployments ✅
- **Storage Limit:** Free tier has sufficient storage for images
- **Access:** Files accessible via `https://fitsnew.in/uploads/filename.jpg`

#### ⚠️ Important Notes:
1. **File Size Limits:** 
   - Render free tier: No hard limit, but keep images under 10MB each
   - Your Express server: Default limit is reasonable

2. **Backup Recommendation:**
   - For production, consider cloud storage (AWS S3, Cloudinary) for:
     - Better reliability
     - CDN delivery (faster image loading)
     - Automatic backups
   - But for now, Render's filesystem works perfectly fine!

3. **Testing Uploads:**
   - After deployment, test at: `https://fitsnew.in/admin/dashboard`
   - Upload a product image
   - Verify it appears in your product listing

#### Example Upload Flow:
1. Admin logs in → `https://fitsnew.in/admin/login`
2. Goes to dashboard → `https://fitsnew.in/admin/dashboard`
3. Creates/edits product → Uploads image
4. Image saved to `public/uploads/` on Render
5. Image accessible at `https://fitsnew.in/uploads/[filename]`
6. Product displays with uploaded image ✅

### Database:
- Your app uses `data/db.json` for storage
- This file persists on Render's filesystem
- **Consider:** Migrate to PostgreSQL (Render offers free PostgreSQL) for production

### Environment Variables:
If you need to add more environment variables later:
1. Go to your service → **"Environment"** tab
2. Add variables like:
   ```
   JWT_SECRET=your-secret-key
   UPLOAD_DIR=/opt/render/project/src/public/uploads
   ```

---

## 🎯 Accessing Your Admin Panel

1. Go to: `https://fitsnew.in/admin/login`
2. Use your admin credentials (the ones you created locally)
3. If you need to create an admin account, you can:
   - Use the admin registration endpoint (if you have one)
   - Or temporarily add a route to create admin users

---

## 🔄 Auto-Deploy on Git Push

Render automatically deploys when you push to your `main` branch. To disable:
1. Go to **Settings** → **Auto-Deploy**
2. Toggle off if needed

---

## ⚡ Performance & Speed

### Is Render Fast?

**Short Answer: Yes, once it's awake!**

#### ✅ When Render is Fast:
- **After wake-up:** Response times are **100-500ms** (very fast!)
- **Active service:** Handles requests quickly and efficiently
- **Static assets:** Served via CDN (images, CSS, JS load fast)
- **Database queries:** Fast with in-memory storage
- **File uploads:** Quick processing and storage

#### ⚠️ When It Might Be Slower:
- **Cold start:** First request after 15 min inactivity takes **30-60 seconds**
  - This is the "wake-up" time
  - Only happens if no one visits for 15+ minutes
  - Subsequent requests are fast

#### 🚀 Speed Comparison:

| Scenario | Render Free | Render Paid | AWS EC2 | Vercel |
|----------|-------------|-------------|---------|--------|
| **Cold Start** | 30-60s | <5s | Instant | <1s |
| **Warm Response** | 100-500ms | 50-200ms | 50-200ms | 50-200ms |
| **Static Assets** | Fast (CDN) | Fast (CDN) | Fast | Very Fast |
| **File Uploads** | Fast | Fast | Fast | N/A |

#### 💡 How to Keep It Fast:

1. **Keep Service Awake (Free):**
   - Use [cron-job.org](https://cron-job.org) to ping your site every 10 minutes
   - Prevents cold starts
   - **Cost:** $0

2. **Upgrade to Paid ($7/month):**
   - No sleep/wake cycles
   - Always-on service
   - Faster cold starts (<5 seconds)
   - Better for production

3. **Optimize Your App:**
   - Compress images before upload
   - Use lazy loading for product images
   - Minimize bundle size

#### 📊 Real-World Performance:

**For an e-commerce site like yours:**
- **Homepage load:** 1-2 seconds (after wake-up)
- **Product pages:** 500ms-1s
- **Admin dashboard:** 500ms-1s
- **Image uploads:** 2-5 seconds (depending on file size)

**Verdict:** Render is **fast enough** for your e-commerce site! The free tier works great, and if you need always-on performance, the $7/month plan eliminates cold starts.

---

## 💰 Free Tier Limits

- ✅ **750 hours/month** (enough for 24/7)
- ✅ **512MB RAM**
- ✅ **Free SSL**
- ⚠️ **Service sleeps after 15 minutes** of inactivity (wakes up in ~30 seconds)

### Keep Service Awake (Free - Recommended):

**Why?** Prevents your service from sleeping, eliminating cold starts (30-60 second delays).

**How?** Use a free cron service to ping your site every 10 minutes.

#### Step-by-Step: Using cron-job.org

1. **Go to [cron-job.org](https://cron-job.org)**
   - Click "Sign up for free" or "Login" if you have an account
   - Sign up with email (or use Google/GitHub login)

2. **Verify Your Email**
   - Check your inbox for verification email
   - Click the verification link

3. **Create a New Cron Job:**
   - After login, click **"Create cronjob"** button
   - Or go to Dashboard → **"Cronjobs"** → **"Create cronjob"**

4. **Configure the Cron Job:**

   **Title:**
   ```
   Keep FitsNew Awake
   ```

   **Address (URL):**
   ```
   https://fitsnew.in/
   ```
   *(Use your actual domain, or `https://fitsnew.onrender.com` if domain not set up yet)*

   **Schedule:**
   - Select **"Every X minutes"**
   - Enter: **`10`** (every 10 minutes)

   **Request Method:**
   - Select **"GET"** (default)

   **Notifications (Optional):**
   - You can enable email notifications if the site is down
   - Leave unchecked if you don't want notifications

5. **Save the Cron Job:**
   - Click **"Create cronjob"** button
   - Your cron job is now active! ✅

6. **Verify It's Working:**
   - Wait 10 minutes
   - Check your Render dashboard → **"Logs"** tab
   - You should see GET requests every 10 minutes
   - Your service will stay awake! 🎉

#### Alternative: Using UptimeRobot (Also Free)

If you prefer another service:

1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Click **"Add New Monitor"**
4. Configure:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** FitsNew Keep Alive
   - **URL:** `https://fitsnew.in/`
   - **Monitoring Interval:** 5 minutes
5. Click **"Create Monitor"**

**Note:** UptimeRobot checks every 5 minutes (minimum), which is even better than 10 minutes!

#### Result:

✅ Your Render service will **never sleep**  
✅ **No cold starts** (30-60 second delays)  
✅ **Always fast** response times  
✅ **100% free** - no cost!

#### Pro Tip:

You can also ping multiple endpoints to ensure everything stays awake:
- `https://fitsnew.in/` (homepage)
- `https://fitsnew.in/api/products` (API endpoint)

Just create multiple cron jobs with the same 10-minute schedule.

---

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Verify `package.json` has correct scripts
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

### Service Won't Start:
- Check start command: `npm start`
- Verify `dist/server/index.js` exists after build
- Check environment variables

### Domain Not Working:
- Wait 1-24 hours for DNS propagation
- Verify DNS records in GoDaddy match Render's requirements
- Check Render's custom domain status (should show "Valid")

### Admin Login Not Working:
- Verify backend API is running
- Check `/api/admin/login` endpoint is accessible
- Check browser console for errors

---

## 📊 Monitoring

Render provides:
- **Logs:** View real-time logs in dashboard
- **Metrics:** CPU, Memory usage
- **Events:** Deployment history

---

## 🎉 You're Done!

Your website should now be live at:
- 🌐 **https://fitsnew.in**
- 🔐 **Admin:** https://fitsnew.in/admin/login

---

## 📝 Next Steps (Optional)

1. **Set up database:** Migrate to Render PostgreSQL (free tier)
2. **Cloud storage:** Use AWS S3 or Cloudinary for images
3. **Monitoring:** Set up UptimeRobot for uptime monitoring
4. **Backup:** Regularly backup your `data/db.json` file

---

**Need Help?** Check Render's [documentation](https://render.com/docs) or community forums.

