# AWS Deployment Guide for fitsnew.in

This guide covers deploying your FitsNew e-commerce website to AWS and connecting it to your domain **fitsnew.in**.

## Table of Contents
1. [AWS Service Options](#aws-service-options)
2. [Option 1: AWS Elastic Beanstalk (Easiest - Recommended)](#option-1-aws-elastic-beanstalk)
3. [Option 2: AWS EC2 (More Control)](#option-2-aws-ec2)
4. [Option 3: AWS Lightsail (Simplest AWS Option)](#option-3-aws-lightsail)
5. [DNS Configuration in GoDaddy](#dns-configuration-in-godaddy)
6. [SSL/HTTPS Setup](#sslhttps-setup)

---

## AWS Service Options

### Option 1: AWS Elastic Beanstalk ⭐ (Recommended)
- **Best for**: Full-stack Node.js apps
- **Difficulty**: Easy
- **Cost**: ~$15-30/month (includes EC2 + load balancer)
- **Pros**: Auto-scaling, easy deployment, handles SSL
- **Cons**: Slightly more expensive

### Option 2: AWS EC2
- **Best for**: Full control, custom configurations
- **Difficulty**: Medium
- **Cost**: ~$5-10/month (t2.micro free tier eligible)
- **Pros**: Full control, cheaper
- **Cons**: Manual setup, you manage everything

### Option 3: AWS Lightsail
- **Best for**: Simple deployments, fixed pricing
- **Difficulty**: Easy
- **Cost**: $5-10/month (fixed pricing)
- **Pros**: Simple, predictable pricing
- **Cons**: Less flexible than EC2

**We'll cover all three options. Start with Elastic Beanstalk if you're new to AWS.**

---

## Option 1: AWS Elastic Beanstalk

### Prerequisites
- AWS Account (create at https://aws.amazon.com)
- AWS CLI installed (optional, but helpful)
- Your code pushed to GitHub

### Step 1: Prepare Your Application

1. **Create a `.ebextensions` folder** in your project root:
```bash
mkdir .ebextensions
```

2. **Create `.ebextensions/nodecommand.config`**:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
```

3. **Create `.ebextensions/01_nginx.config`** (for proper routing):
```yaml
files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      client_max_body_size 50M;

container_commands:
  01_reload_nginx:
    command: "sudo service nginx reload"
```

### Step 2: Install EB CLI (Elastic Beanstalk CLI)

**Windows (PowerShell):**
```powershell
# Install Python first if not installed
# Then install EB CLI
pip install awsebcli
```

**Mac/Linux:**
```bash
pip3 install awsebcli
```

### Step 3: Initialize Elastic Beanstalk

```bash
# In your project directory
eb init

# Follow prompts:
# - Select region (e.g., us-east-1)
# - Select "Node.js" platform
# - Select Node.js version (18 or 20)
# - Set up SSH (yes, recommended)
# - Select keypair or create new one
```

### Step 4: Create and Deploy Environment

```bash
# Create environment (this takes 5-10 minutes)
eb create fitsnew-prod

# Or with custom configuration:
eb create fitsnew-prod --instance-type t3.small --envvars NODE_ENV=production
```

### Step 5: Deploy Updates

```bash
# Deploy your code
eb deploy

# View logs
eb logs

# Open in browser
eb open
```

### Step 6: Configure Custom Domain

1. **Get your Elastic Beanstalk URL**:
   - After deployment, you'll get a URL like: `fitsnew-prod.eba-xxxxx.us-east-1.elasticbeanstalk.com`
   - Note this URL

2. **In AWS Console**:
   - Go to Elastic Beanstalk → Your Environment → Configuration
   - Click "Edit" on "Load balancer"
   - Add listener for HTTPS (port 443)
   - Request SSL certificate (or use ACM)

3. **Add Custom Domain**:
   - Go to EC2 → Load Balancers
   - Select your load balancer
   - Add listener rule for your domain

### Step 7: Update DNS in GoDaddy

Add CNAME record:
- **Type**: CNAME
- **Name**: @ (or leave blank for root domain)
- **Value**: `fitsnew-prod.eba-xxxxx.us-east-1.elasticbeanstalk.com`
- **TTL**: 600

For www subdomain:
- **Type**: CNAME
- **Name**: www
- **Value**: `fitsnew-prod.eba-xxxxx.us-east-1.elasticbeanstalk.com`
- **TTL**: 600

---

## Option 2: AWS EC2

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 → Launch Instance
2. **Configure**:
   - **Name**: fitsnew-server
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.micro (free tier) or t3.small
   - **Key Pair**: Create new or use existing
   - **Network Settings**: 
     - Allow HTTP (port 80)
     - Allow HTTPS (port 443)
     - Allow SSH (port 22) from your IP
   - **Storage**: 20GB (free tier) or 30GB
3. **Launch Instance**

### Step 2: Connect to Your Instance

**Windows (using PowerShell or PuTTY):**
```bash
# If using SSH key
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
```

**Note your EC2 Public IP** from the EC2 dashboard.

### Step 3: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### Step 4: Deploy Your Application

```bash
# Clone your repository
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git fitsnew
cd fitsnew

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions shown
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/fitsnew
```

Add this configuration:
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
sudo ln -s /etc/nginx/sites-available/fitsnew /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d fitsnew.in -d www.fitsnew.in

# Certbot will automatically configure Nginx and set up auto-renewal
```

### Step 7: Configure DNS

In GoDaddy, add A records:
- **Type**: A
- **Name**: @
- **Value**: [Your EC2 Public IP]
- **TTL**: 600

- **Type**: A
- **Name**: www
- **Value**: [Your EC2 Public IP]
- **TTL**: 600

### Step 8: Update Application (Future)

```bash
ssh -i "your-key.pem" ubuntu@YOUR_EC2_IP
cd /home/ubuntu/fitsnew
git pull
npm install
npm run build
pm2 restart fitsnew
```

---

## Option 3: AWS Lightsail

### Step 1: Create Lightsail Instance

1. **Go to AWS Console** → Lightsail → Create Instance
2. **Configure**:
   - **Platform**: Linux/Unix
   - **Blueprint**: Node.js
   - **Instance Plan**: $5/month (1GB RAM) or $10/month (2GB RAM)
   - **Name**: fitsnew
3. **Create Instance**

### Step 2: Connect via Browser SSH

1. Click on your instance → "Connect using SSH"
2. Lightsail opens a browser-based terminal

### Step 3: Setup Application

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PM2
sudo npm install -g pm2

# Clone repository
cd /opt/bitnami
sudo git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git fitsnew
cd fitsnew
sudo npm install
sudo npm run build

# Start with PM2
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup
```

### Step 4: Configure Static IP

1. In Lightsail → Networking → Create Static IP
2. Attach to your instance
3. Note the Static IP address

### Step 5: Configure DNS

In GoDaddy, add A records pointing to your Lightsail Static IP.

### Step 6: Setup SSL

Lightsail has built-in SSL certificate management:
1. Go to your instance → Networking
2. Click "Create certificate"
3. Add domains: `fitsnew.in` and `www.fitsnew.in`
4. Attach certificate to your instance

---

## DNS Configuration in GoDaddy

### For Elastic Beanstalk:
- **Type**: CNAME
- **Name**: @
- **Value**: [Your Elastic Beanstalk URL]
- **TTL**: 600

### For EC2/Lightsail:
- **Type**: A
- **Name**: @
- **Value**: [Your EC2/Lightsail IP]
- **TTL**: 600

- **Type**: A
- **Name**: www
- **Value**: [Your EC2/Lightsail IP]
- **TTL**: 600

---

## SSL/HTTPS Setup

### Elastic Beanstalk:
- Use AWS Certificate Manager (ACM)
- Request certificate for `fitsnew.in` and `www.fitsnew.in`
- Attach to load balancer

### EC2:
- Use Certbot (Let's Encrypt) - see Step 6 in EC2 section
- Free and auto-renewing

### Lightsail:
- Use built-in certificate manager
- Free SSL certificates

---

## Cost Comparison

| Service | Monthly Cost | Best For |
|---------|-------------|----------|
| **Elastic Beanstalk** | $15-30 | Auto-scaling, production |
| **EC2 t2.micro** | $0 (free tier) / $8-10 | Learning, small sites |
| **EC2 t3.small** | $15-20 | Medium traffic |
| **Lightsail** | $5-10 | Simple, fixed pricing |

**Free Tier**: AWS offers 12 months free tier for EC2 t2.micro (750 hours/month)

---

## Quick Start Commands Summary

### Elastic Beanstalk:
```bash
eb init
eb create fitsnew-prod
eb deploy
eb open
```

### EC2:
```bash
# On your server
git clone YOUR_REPO
cd fitsnew
npm install && npm run build
pm2 start ecosystem.config.js
pm2 save && pm2 startup
# Configure Nginx
sudo certbot --nginx -d fitsnew.in -d www.fitsnew.in
```

### Lightsail:
- Use browser SSH
- Follow Step 3 in Lightsail section
- Use Lightsail's built-in SSL

---

## Troubleshooting

### Application not starting?
- Check logs: `pm2 logs fitsnew` (EC2/Lightsail)
- Check logs: `eb logs` (Elastic Beanstalk)
- Verify PORT environment variable is set

### DNS not working?
- Check DNS propagation: https://www.whatsmydns.net
- Wait 1-24 hours for propagation
- Verify DNS records in GoDaddy

### SSL issues?
- Elastic Beanstalk: Check ACM certificate status
- EC2: Run `sudo certbot certificates`
- Lightsail: Check certificate in Lightsail dashboard

### Can't connect via SSH?
- Check Security Group (EC2) or Firewall (Lightsail)
- Verify your IP is allowed
- Check key pair is correct

---

## Recommendation

**For beginners**: Start with **AWS Lightsail** - it's the simplest AWS option with fixed pricing.

**For production**: Use **AWS Elastic Beanstalk** - it handles scaling and SSL automatically.

**For learning/control**: Use **AWS EC2** - you have full control and it's cheaper.

Good luck with your AWS deployment! 🚀

