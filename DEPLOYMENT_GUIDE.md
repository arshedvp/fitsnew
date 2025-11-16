# Deployment Guide for fitsnew.in

This guide will help you deploy your FitsNew e-commerce website to your domain **fitsnew.in**.

## Table of Contents
1. [Hosting Options](#hosting-options)
2. [Recommended: VPS Deployment (DigitalOcean/Railway/Render)](#recommended-vps-deployment)
3. [DNS Configuration in GoDaddy](#dns-configuration-in-godaddy)
4. [SSL/HTTPS Setup](#sslhttps-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Hosting Options

### Option 1: Platform-as-a-Service (Easiest - Recommended for beginners)
- **Railway.app** - Simple, auto-deploys from GitHub
- **Render.com** - Free tier available, easy setup
- **Fly.io** - Good performance, global CDN
- **Vercel** - Great for frontend, but you'll need separate backend hosting

### Option 2: VPS (More Control)
- **DigitalOcean** - $6/month droplet
- **AWS EC2** - Pay-as-you-go
- **Linode** - $5/month
- **Vultr** - $6/month

### Option 3: GoDaddy Hosting (If you have hosting plan)
- Use GoDaddy's cPanel if you have a hosting plan

**We'll use Railway.app as the example (easiest), but provide VPS instructions too.**

---

## Recommended: VPS Deployment

### Step 1: Prepare Your Code for Production

1. **Create a `.env` file** (if you don't have one):
```bash
NODE_ENV=production
PORT=3000
# Add any other environment variables you need
```

2. **Test the build locally:**
```bash
npm run build
npm start
```

3. **Push to GitHub** (if not already):
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

## Option A: Deploy to Railway.app (Easiest)

### Step 1: Sign up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

### Step 2: Configure Railway
1. Railway will auto-detect Node.js
2. Add environment variables:
   - `NODE_ENV=production`
   - `PORT` (Railway sets this automatically, but your app defaults to 5000 if not set)

### Step 3: Get Your Railway Domain
- Railway provides a `.railway.app` domain
- Note this domain (e.g., `your-app.railway.app`)

### Step 4: Configure Custom Domain in Railway
1. Go to your project → Settings → Domains
2. Click "Custom Domain"
3. Enter `fitsnew.in` and `www.fitsnew.in`
4. Railway will provide DNS records to add

---

## Option B: Deploy to VPS (DigitalOcean)

### Step 1: Create a DigitalOcean Droplet
1. Sign up at [digitalocean.com](https://digitalocean.com)
2. Create a new Droplet:
   - **OS**: Ubuntu 22.04 LTS
   - **Plan**: Basic $6/month (1GB RAM)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) or password

### Step 2: Connect to Your Server
```bash
ssh root@YOUR_SERVER_IP
```

### Step 3: Install Node.js and PM2
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (web server)
apt install -y nginx
```

### Step 4: Deploy Your Application
```bash
# Clone your repository
cd /var/www
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git fitsnew
cd fitsnew

# Install dependencies
npm install

# Build the application
npm run build

# Start with PM2
pm2 start dist/server/index.js --name fitsnew
pm2 save
pm2 startup  # Follow instructions to enable auto-start
```

### Step 5: Configure Nginx
```bash
nano /etc/nginx/sites-available/fitsnew
```

Add this configuration (note: your app uses PORT env var, default 5000):
```nginx
server {
    listen 80;
    server_name fitsnew.in www.fitsnew.in;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/fitsnew /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

---

## DNS Configuration in GoDaddy

### Step 1: Access DNS Settings
1. Log in to [GoDaddy.com](https://godaddy.com)
2. Go to "My Products" → "Domains"
3. Click on `fitsnew.in`
4. Click "DNS" or "Manage DNS"

### Step 2: Update DNS Records

#### If using Railway:
Add these records:
- **Type**: A
  - **Name**: @
  - **Value**: [Railway's IP address - provided in Railway dashboard]
  - **TTL**: 600

- **Type**: CNAME
  - **Name**: www
  - **Value**: [Railway's domain or your-app.railway.app]
  - **TTL**: 600

#### If using VPS (DigitalOcean):
Add these records:
- **Type**: A
  - **Name**: @
  - **Value**: [Your VPS IP address]
  - **TTL**: 600

- **Type**: A
  - **Name**: www
  - **Value**: [Your VPS IP address]
  - **TTL**: 600

### Step 3: Remove Default Records
- Delete any existing A records pointing to GoDaddy's parking page
- Keep only the records you added above

**DNS propagation can take 24-48 hours, but usually works within 1-2 hours.**

---

## SSL/HTTPS Setup

### Option A: Using Railway
Railway automatically provides SSL certificates via Let's Encrypt. Just add your custom domain and SSL will be enabled automatically.

### Option B: Using VPS with Certbot
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d fitsnew.in -d www.fitsnew.in

# Certbot will automatically configure Nginx and renew certificates
```

Update Nginx config to redirect HTTP to HTTPS:
```nginx
server {
    listen 80;
    server_name fitsnew.in www.fitsnew.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fitsnew.in www.fitsnew.in;

    ssl_certificate /etc/letsencrypt/live/fitsnew.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitsnew.in/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Environment Variables

Create a `.env` file on your server with:
```env
NODE_ENV=production
PORT=3000
# Add any API keys, database URLs, etc.
```

For Railway: Add these in the dashboard under "Variables"
For VPS: Create `.env` file in your project directory

---

## Post-Deployment Checklist

- [ ] Build completes successfully
- [ ] Application starts without errors
- [ ] DNS records are configured correctly
- [ ] SSL certificate is installed (HTTPS works)
- [ ] Website loads at `https://fitsnew.in`
- [ ] Website loads at `https://www.fitsnew.in`
- [ ] All images load correctly
- [ ] File uploads work
- [ ] Admin login works
- [ ] Cart functionality works
- [ ] WhatsApp integration works
- [ ] Mobile responsive design works

---

## Monitoring & Maintenance

### Check Application Status (VPS)
```bash
pm2 status
pm2 logs fitsnew
```

### Restart Application
```bash
pm2 restart fitsnew
```

### Update Application
```bash
cd /var/www/fitsnew
git pull
npm install
npm run build
pm2 restart fitsnew
```

---

## Troubleshooting

### Website not loading?
1. Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
2. Verify DNS records in GoDaddy
3. Check server logs: `pm2 logs fitsnew`
4. Verify Nginx is running: `systemctl status nginx`

### SSL not working?
1. Ensure port 443 is open in firewall
2. Check Certbot status: `certbot certificates`
3. Verify Nginx SSL configuration

### Application crashes?
1. Check logs: `pm2 logs fitsnew`
2. Verify environment variables
3. Check disk space: `df -h`
4. Check memory: `free -h`

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tags/node-js
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Nginx Docs**: https://nginx.org/en/docs/

---

## Quick Start Commands Summary

### Railway (Recommended)
1. Sign up → Connect GitHub → Deploy
2. Add custom domain in Railway
3. Update DNS in GoDaddy
4. Done! (SSL auto-configured)

### VPS (DigitalOcean)
```bash
# On your server
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx
npm install -y pm2
cd /var/www && git clone YOUR_REPO fitsnew
cd fitsnew && npm install && npm run build
pm2 start dist/server/index.js --name fitsnew
pm2 save && pm2 startup
# Configure Nginx (see above)
certbot --nginx -d fitsnew.in -d www.fitsnew.in
```

Good luck with your deployment! 🚀

