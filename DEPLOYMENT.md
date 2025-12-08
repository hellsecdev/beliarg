# Beliarg Deployment Guide

This document describes the process of deploying the Beliarg application to a production server.

## Preparation for Deployment

### What Was Fixed in the Code:

1. ✅ Added server dependencies to `package.json`
2. ✅ Converted `server/server.js` from CommonJS to ES modules
3. ✅ Fixed hardcoded API_URL to relative paths
4. ✅ Added static file serving from `dist` folder and SPA fallback
5. ✅ Added `start` script to package.json
6. ✅ Created PM2 configuration (`ecosystem.config.js`)
7. ✅ Created Nginx configuration (`nginx/beliarg.conf`)
8. ✅ Created deployment automation script (`deploy.sh`)

## Server Information

- **IP Address:** 164.90.136.126
- **User:** root
- **Domain:** beliarg.online, www.beliarg.online
- **Application Directory:** /var/www/beliarg

## Manual Deployment (Step by Step)

### 1. Connect to Server

```bash
ssh root@164.90.136.126
```

### 2. Install Node.js (if not installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be version 18+
```

### 3. Install PostgreSQL

```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Database Setup

```bash
sudo -u postgres psql
```

In psql console:

```sql
CREATE DATABASE beliarg_db;
CREATE USER beliarg_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE beliarg_db TO beliarg_user;
ALTER USER beliarg_user CREATEDB;
\q
```

### 5. Apply Database Schema

```bash
cd /var/www/beliarg
sudo -u postgres psql -d beliarg_db -f sql/schema.sql
```

### 6. Create .env File

```bash
cd /var/www/beliarg
nano .env
```

`.env` contents:

```env
PORT=3000
DATABASE_URL=postgresql://beliarg_user:your_secure_password_here@localhost:5432/beliarg_db
JWT_SECRET=$(openssl rand -base64 32)
```

**Important:** Replace `your_secure_password_here` with a real password and generate JWT_SECRET:

```bash
openssl rand -base64 32
```

### 7. Install Dependencies and Build

```bash
cd /var/www/beliarg
npm install
npm run build
```

### 8. Install and Configure PM2

```bash
npm install -g pm2
mkdir -p /var/www/beliarg/logs
cd /var/www/beliarg
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Follow instructions for auto-start
```

### 9. Install and Configure Nginx

```bash
sudo apt-get install -y nginx
sudo cp /var/www/beliarg/nginx/beliarg.conf /etc/nginx/sites-available/beliarg
sudo ln -s /etc/nginx/sites-available/beliarg /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t  # Configuration check
sudo systemctl reload nginx
```

### 10. SSL Setup (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d beliarg.online -d www.beliarg.online
```

After obtaining the certificate, update `/etc/nginx/sites-available/beliarg`:
- Uncomment the SSL block (port 443)
- Uncomment the HTTP to HTTPS redirect in port 80 block
- Comment out proxy_pass in port 80 block

Then:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 11. Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

## Automatic Deployment

Use the `deploy.sh` script:

```bash
./deploy.sh
```

**Note:** The script requires interactive input for some steps (creating .env, SSL setup).

## Verification

1. Check PM2 status:
   ```bash
   pm2 status
   pm2 logs beliarg
   ```

2. Check Nginx:
   ```bash
   sudo systemctl status nginx
   ```

3. Check accessibility:
   - HTTP: http://beliarg.online
   - HTTPS: https://beliarg.online (after SSL setup)

## Application Updates

```bash
# On server
cd /var/www/beliarg
git pull  # If using git
# Or upload new files via rsync/scp
npm install
npm run build
pm2 restart beliarg
```

## Logs

- PM2 logs: `pm2 logs beliarg`
- Nginx logs: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- PM2 log files: `/var/www/beliarg/logs/`

## Troubleshooting

### Application Not Starting

1. Check logs: `pm2 logs beliarg`
2. Check .env file
3. Check database connection: `psql -U beliarg_user -d beliarg_db`

### Nginx Not Proxying Requests

1. Check configuration: `sudo nginx -t`
2. Check that application is listening on port 3000: `pm2 logs beliarg`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

### SSL Issues

1. Make sure the domain points to the server IP
2. Check that ports 80 and 443 are open
3. Check certificate: `sudo certbot certificates`
