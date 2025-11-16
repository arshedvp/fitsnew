# Quick Deployment Checklist for fitsnew.in

## 🚀 Fastest Path: Railway.app (Recommended)

### Step 1: Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect and deploy

### Step 3: Add Custom Domain
1. In Railway dashboard → Your Project → Settings → Domains
2. Click "Custom Domain"
3. Add: `fitsnew.in`
4. Add: `www.fitsnew.in`
5. Railway will show you DNS records to add

### Step 4: Configure DNS in GoDaddy
1. Login to GoDaddy → My Products → Domains → fitsnew.in → DNS
2. Add A record:
   - Type: A
   - Name: @
   - Value: [IP from Railway]
   - TTL: 600
3. Add CNAME record:
   - Type: CNAME
   - Name: www
   - Value: [Railway domain]
   - TTL: 600
4. Delete any default GoDaddy records

### Step 5: Wait & Test
- DNS propagation: 1-24 hours (usually 1-2 hours)
- Railway automatically provides SSL/HTTPS
- Test: https://fitsnew.in

**That's it! Railway handles everything else automatically.**

---

## 🔧 Alternative: VPS (DigitalOcean) - More Control

### One-Time Setup (15 minutes)

```bash
# 1. Create Droplet on DigitalOcean
#    - Ubuntu 22.04, $6/month plan
#    - Note your server IP

# 2. Connect to server
ssh root@YOUR_SERVER_IP

# 3. Run this setup script
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install -g pm2
apt update && apt install -y nginx certbot python3-certbot-nginx

# 4. Clone and setup your app
cd /var/www
git clone YOUR_GITHUB_REPO_URL fitsnew
cd fitsnew
npm install
npm run build

# 5. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the command it shows

# 6. Configure Nginx
cat > /etc/nginx/sites-available/fitsnew << 'EOF'
server {
    listen 80;
    server_name fitsnew.in www.fitsnew.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
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
    }
}
EOF

ln -s /etc/nginx/sites-available/fitsnew /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# 7. Get SSL Certificate
certbot --nginx -d fitsnew.in -d www.fitsnew.in

# 8. Configure DNS in GoDaddy
#    Add A records pointing to your server IP
```

### Update Your App Later
```bash
ssh root@YOUR_SERVER_IP
cd /var/www/fitsnew
git pull
npm install
npm run build
pm2 restart fitsnew
```

---

## 📋 GoDaddy DNS Configuration

### Records to Add:

1. **A Record** (Root domain):
   - Type: A
   - Name: @
   - Value: [Your server IP or Railway IP]
   - TTL: 600

2. **A Record** (WWW) - OR CNAME:
   - Type: A (or CNAME)
   - Name: www
   - Value: [Your server IP] OR [Railway domain]
   - TTL: 600

### Records to Delete:
- Any default GoDaddy parking page records
- Any conflicting A or CNAME records

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://fitsnew.in
- [ ] Website loads at https://www.fitsnew.in
- [ ] SSL certificate is valid (green padlock)
- [ ] All images load correctly
- [ ] Admin login works
- [ ] Product uploads work
- [ ] Cart functionality works
- [ ] WhatsApp integration works
- [ ] Mobile responsive design works

---

## 🆘 Troubleshooting

**Website not loading?**
1. Check DNS: https://www.whatsmydns.net/#A/fitsnew.in
2. Wait 1-2 hours for DNS propagation
3. Check server logs: `pm2 logs fitsnew` (VPS) or Railway logs

**SSL not working?**
- Railway: Automatic, just wait
- VPS: Run `certbot --nginx -d fitsnew.in -d www.fitsnew.in`

**Application errors?**
- Check logs: Railway dashboard or `pm2 logs fitsnew`
- Verify environment variables are set
- Check if port 5000 is accessible (or PORT env var is set)

---

## 💰 Cost Comparison

- **Railway**: ~$5-20/month (pay as you go)
- **DigitalOcean**: $6/month (fixed)
- **Render**: Free tier available, then ~$7/month
- **Fly.io**: Free tier, then ~$5/month

---

## 🎯 Recommendation

**For beginners**: Use **Railway.app** - it's the easiest and handles SSL automatically.

**For more control**: Use **DigitalOcean VPS** - you have full server access.

Both will work perfectly with your domain! 🚀

