# AWS Quick Start Guide for fitsnew.in

## 🚀 Fastest Path: AWS Lightsail (Recommended for Beginners)

### Step 1: Create AWS Account
1. Go to https://aws.amazon.com
2. Sign up (requires credit card, but free tier available)
3. Complete account verification

### Step 2: Create Lightsail Instance
1. Go to AWS Console → Search "Lightsail"
2. Click "Create instance"
3. **Platform**: Linux/Unix
4. **Blueprint**: Node.js
5. **Instance Plan**: $5/month (1GB RAM) or $10/month (2GB RAM)
6. **Name**: fitsnew
7. Click "Create instance"

### Step 3: Connect and Deploy
1. Click on your instance → "Connect using SSH" (browser terminal opens)
2. Run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PM2
sudo npm install -g pm2

# Clone your repository (replace with your GitHub URL)
cd /opt/bitnami
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git fitsnew
cd fitsnew

# Install dependencies
sudo npm install

# Build application
sudo npm run build

# Start with PM2
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup  # Follow the instructions shown
```

### Step 4: Setup Static IP
1. In Lightsail → Your Instance → Networking
2. Click "Create static IP"
3. Attach to your instance
4. **Note the Static IP address**

### Step 5: Configure DNS in GoDaddy
1. Login to GoDaddy → My Products → Domains → fitsnew.in → DNS
2. Add A record:
   - **Type**: A
   - **Name**: @
   - **Value**: [Your Lightsail Static IP]
   - **TTL**: 600
3. Add A record for www:
   - **Type**: A
   - **Name**: www
   - **Value**: [Your Lightsail Static IP]
   - **TTL**: 600

### Step 6: Setup SSL Certificate
1. In Lightsail → Your Instance → Networking
2. Click "Create certificate"
3. Add domains: `fitsnew.in` and `www.fitsnew.in`
4. Click "Create"
5. Attach certificate to your instance
6. Enable HTTPS redirect

### Step 7: Wait and Test
- DNS propagation: 1-24 hours (usually 1-2 hours)
- Test: https://fitsnew.in

**That's it! Your site is live on AWS.** 🎉

---

## 🔧 Alternative: AWS EC2 (More Control)

### Quick Setup:
1. **Launch EC2 Instance**:
   - AWS Console → EC2 → Launch Instance
   - Ubuntu 22.04 LTS
   - t2.micro (free tier) or t3.small
   - Configure Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect via SSH**:
   ```bash
   ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
   ```

3. **Setup Server**:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx
   sudo npm install -g pm2
   
   # Deploy app
   cd /home/ubuntu
   git clone YOUR_GITHUB_REPO fitsnew
   cd fitsnew
   npm install && npm run build
   pm2 start ecosystem.config.js
   pm2 save && pm2 startup
   ```

4. **Configure Nginx** (see full guide for details)

5. **Setup SSL**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d fitsnew.in -d www.fitsnew.in
   ```

6. **Configure DNS** in GoDaddy (point to EC2 IP)

---

## 📋 Cost Comparison

| Service | Monthly Cost | Setup Time |
|---------|-------------|------------|
| **Lightsail** | $5-10 | 15 minutes ⭐ |
| **EC2 t2.micro** | $0 (free tier) | 30 minutes |
| **EC2 t3.small** | $15-20 | 30 minutes |
| **Elastic Beanstalk** | $15-30 | 20 minutes |

---

## ✅ Post-Deployment Checklist

- [ ] Website loads at https://fitsnew.in
- [ ] Website loads at https://www.fitsnew.in
- [ ] SSL certificate is valid (green padlock)
- [ ] All images load correctly
- [ ] Admin login works
- [ ] Product uploads work
- [ ] Cart functionality works

---

## 🆘 Troubleshooting

**Can't connect via SSH?**
- Check Security Group (EC2) or Firewall (Lightsail)
- Verify your IP is allowed
- Check key pair is correct

**Application not starting?**
- Check logs: `pm2 logs fitsnew`
- Verify PORT environment variable
- Check if port 5000 is accessible

**DNS not working?**
- Check DNS propagation: https://www.whatsmydns.net
- Wait 1-2 hours for propagation
- Verify DNS records in GoDaddy

---

## 📚 Full Documentation

See `AWS_DEPLOYMENT_GUIDE.md` for detailed instructions for all AWS services.

---

**Recommendation**: Start with **AWS Lightsail** - it's the simplest AWS option! 🚀

