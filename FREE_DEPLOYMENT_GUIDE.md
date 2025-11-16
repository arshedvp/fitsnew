# Free Deployment Options for FitsNew

This guide covers **completely free** hosting options for your full-stack e-commerce application.

## 🆓 Best Free Options (Ranked)

### 1. **Render.com** ⭐ (Recommended - Best Free Tier)

**Free Tier Includes:**
- 750 hours/month (enough for 24/7 operation)
- 512MB RAM
- Free SSL certificate
- Auto-deploy from GitHub
- Custom domain support

**Limitations:**
- Service spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
- 512MB RAM (should be enough for your app)

**Steps to Deploy:**

1. **Sign up at [render.com](https://render.com)** (use GitHub account)

2. **Create a New Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Build Settings:**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)

6. **Setup Custom Domain:**
   - Go to Settings → Custom Domain
   - Add `fitsnew.in` and `www.fitsnew.in`
   - Update DNS in GoDaddy (instructions below)

**Cost:** $0/month (free tier)

---

### 2. **Railway.app** ⭐ (Great for Development)

**Free Tier Includes:**
- $5 credit/month (usually enough for small apps)
- 500MB RAM
- Free SSL
- Auto-deploy from GitHub

**Limitations:**
- Credit-based (may run out if you exceed usage)
- Service may sleep after inactivity

**Steps to Deploy:**

1. **Sign up at [railway.app](https://railway.app)** (use GitHub)

2. **Create New Project:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Railway auto-detects Node.js:**
   - It will automatically run `npm install` and `npm start`
   - Make sure your `package.json` has the correct start script

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add: `NODE_ENV=production`

5. **Setup Custom Domain:**
   - Go to Settings → Domains
   - Add `fitsnew.in`
   - Update DNS in GoDaddy

**Cost:** $0/month (within free credit limit)

---

### 3. **Fly.io** ⭐ (Good Performance)

**Free Tier Includes:**
- 3 shared-cpu-1x VMs (256MB RAM each)
- 3GB persistent volume storage
- 160GB outbound data transfer
- Free SSL

**Limitations:**
- Limited to 3 VMs
- 256MB RAM per VM (may need to optimize)

**Steps to Deploy:**

1. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign up and login:**
   ```bash
   fly auth signup
   fly auth login
   ```

3. **Create a Fly app:**
   ```bash
   fly launch
   ```
   - Follow the prompts
   - Select a region close to you
   - Don't deploy yet (we'll configure first)

4. **Create `fly.toml` in your project root:**
   ```toml
   app = "fitsnew"
   primary_region = "iad"  # Change to your preferred region

   [build]
     builder = "paketobuildpacks/builder:base"

   [http_service]
     internal_port = 5000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[vm]]
     memory_mb = 256
     cpu_kind = "shared"
     cpus = 1
   ```

5. **Deploy:**
   ```bash
   fly deploy
   ```

6. **Add Custom Domain:**
   ```bash
   fly certs add fitsnew.in
   fly certs add www.fitsnew.in
   ```
   - Follow DNS instructions shown

**Cost:** $0/month (within free tier limits)

---

### 4. **Vercel (Frontend) + Render/Railway (Backend)** (Split Deployment)

**Why Split?**
- Vercel is excellent for frontend (React)
- Backend needs a separate service

**Frontend on Vercel (Free):**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build:client`
   - **Output Directory:** `dist/public`
   - **Install Command:** `npm install`

**Backend on Render/Railway:**
- Follow Render or Railway steps above
- Update frontend API URLs to point to backend

**Cost:** $0/month (both free)

---

### 5. **AWS Free Tier** (Limited but Free)

**Free Tier Includes:**
- 750 hours/month of t2.micro EC2 (1 year)
- 30GB storage
- 2 million HTTP requests

**Limitations:**
- Only free for 12 months
- Requires credit card (won't charge if you stay within limits)
- More complex setup

**Steps:**
- Follow the AWS EC2 section in `AWS_DEPLOYMENT_GUIDE.md`
- Use t2.micro instance (free tier eligible)

**Cost:** $0/month (first 12 months, then ~$5-10/month)

---

## 🌐 DNS Configuration for GoDaddy

After deploying to any platform above, configure DNS:

### For Render/Railway/Fly.io:

1. **Login to GoDaddy** → My Products → Domains → fitsnew.in → DNS

2. **Add CNAME record:**
   - **Type:** CNAME
   - **Name:** @
   - **Value:** [Your service URL, e.g., `fitsnew.onrender.com`]
   - **TTL:** 600

3. **Add CNAME for www:**
   - **Type:** CNAME
   - **Name:** www
   - **Value:** [Your service URL]
   - **TTL:** 600

### For AWS EC2:

1. **Add A record:**
   - **Type:** A
   - **Name:** @
   - **Value:** [Your EC2 Public IP]
   - **TTL:** 600

2. **Add A record for www:**
   - **Type:** A
   - **Name:** www
   - **Value:** [Your EC2 Public IP]
   - **TTL:** 600

---

## 📋 Quick Comparison

| Platform | Free Tier | RAM | Sleeps? | SSL | Custom Domain | Best For |
|----------|-----------|-----|---------|-----|---------------|----------|
| **Render** | 750 hrs/mo | 512MB | Yes (15min) | ✅ | ✅ | Best overall |
| **Railway** | $5 credit | 500MB | Yes | ✅ | ✅ | Easy setup |
| **Fly.io** | 3 VMs | 256MB | Yes | ✅ | ✅ | Good performance |
| **Vercel** | Unlimited | N/A | No | ✅ | ✅ | Frontend only |
| **AWS** | 12 months | 1GB | No | Manual | ✅ | Long-term |

---

## 🎯 Recommended Setup

**For beginners:** Use **Render.com**
- Easiest setup
- Good free tier
- Auto-deploys from GitHub
- Free SSL included

**For better performance:** Use **Fly.io**
- Faster cold starts
- Better global distribution
- More control

**For production (after free tier):** Migrate to **AWS Lightsail** ($5/month) or **DigitalOcean** ($6/month)

---

## ⚠️ Important Notes

1. **File Uploads:** Free tiers may have storage limitations. Consider using cloud storage (AWS S3, Cloudinary) for images.

2. **Database:** Your app uses in-memory storage (`data/db.json`). For production, consider:
   - **Free PostgreSQL:** [Supabase](https://supabase.com) (free tier)
   - **Free MongoDB:** [MongoDB Atlas](https://mongodb.com/cloud/atlas) (free tier)

3. **Cold Starts:** Free tiers often "sleep" after inactivity. First request may take 30-60 seconds.

4. **Monitoring:** Set up uptime monitoring (free services: UptimeRobot, Better Uptime)

---

## 🚀 Next Steps

1. Choose a platform (recommend Render.com)
2. Deploy following the steps above
3. Configure DNS in GoDaddy
4. Wait 1-24 hours for DNS propagation
5. Test your site at https://fitsnew.in

---

## 💡 Pro Tips

- **Keep service awake:** Use a free cron service (cron-job.org) to ping your site every 10 minutes
- **Monitor usage:** Check your platform dashboard regularly to avoid exceeding free limits
- **Backup data:** Since you're using file-based storage, regularly backup `data/db.json`
- **Optimize images:** Compress images before upload to save bandwidth

---

**Need help?** Check the platform's documentation or community forums.

