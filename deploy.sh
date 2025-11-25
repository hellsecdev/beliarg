#!/bin/bash

# Beliarg Production Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

SERVER_IP="164.90.136.126"
SERVER_USER="root"
APP_DIR="/var/www/beliarg"
DOMAIN="beliarg.online"

echo "🔥 Beliarg Deployment Script"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Starting deployment to $SERVER_USER@$SERVER_IP"

# Step 1: Check Node.js installation
print_info "Checking Node.js installation on server..."
ssh $SERVER_USER@$SERVER_IP "node --version || (echo 'Node.js not found. Installing...' && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs)"

# Step 2: Check PostgreSQL installation
print_info "Checking PostgreSQL installation on server..."
ssh $SERVER_USER@$SERVER_IP "psql --version || (echo 'PostgreSQL not found. Installing...' && sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib)"

# Step 3: Setup PostgreSQL database
print_info "Setting up PostgreSQL database..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
sudo -u postgres psql -c "CREATE DATABASE beliarg_db;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER beliarg_user WITH PASSWORD 'CHANGE_THIS_PASSWORD';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE beliarg_db TO beliarg_user;"
sudo -u postgres psql -c "ALTER USER beliarg_user CREATEDB;"
ENDSSH

# Step 4: Create application directory
print_info "Creating application directory..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $APP_DIR"

# Step 5: Copy files to server
print_info "Copying files to server..."
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' --exclude '.env' \
    ./ $SERVER_USER@$SERVER_IP:$APP_DIR/

# Step 6: Install dependencies and build
print_info "Installing dependencies and building application..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
cd $APP_DIR
npm install
npm run build
ENDSSH

# Step 7: Setup environment file
print_info "Setting up environment file..."
print_warn "Please manually create .env file on server with the following content:"
echo ""
echo "PORT=3000"
echo "DATABASE_URL=postgresql://beliarg_user:CHANGE_THIS_PASSWORD@localhost:5432/beliarg_db"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo ""
read -p "Press Enter after you've created the .env file on the server..."

# Step 8: Apply database schema
print_info "Applying database schema..."
ssh $SERVER_USER@$SERVER_IP "cd $APP_DIR && sudo -u postgres psql -d beliarg_db -f sql/schema.sql"

# Step 9: Install PM2
print_info "Installing PM2..."
ssh $SERVER_USER@$SERVER_IP "npm install -g pm2 || echo 'PM2 already installed'"

# Step 10: Create logs directory
print_info "Creating logs directory..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $APP_DIR/logs"

# Step 11: Start/restart application with PM2
print_info "Starting application with PM2..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
cd $APP_DIR
pm2 delete beliarg 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
ENDSSH

# Step 12: Setup Nginx
print_info "Installing and configuring Nginx..."
ssh $SERVER_USER@$SERVER_IP << ENDSSH
sudo apt-get update
sudo apt-get install -y nginx || echo 'Nginx already installed'
sudo cp $APP_DIR/nginx/beliarg.conf /etc/nginx/sites-available/beliarg
sudo ln -sf /etc/nginx/sites-available/beliarg /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
ENDSSH

# Step 13: Setup SSL with Certbot
print_info "Setting up SSL certificate..."
print_warn "SSL setup requires manual intervention. Run the following on the server:"
echo ""
echo "sudo apt-get install -y certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d beliarg.online -d www.beliarg.online"
echo ""
read -p "Press Enter after SSL is configured (or skip if not ready)..."

# Step 14: Setup firewall
print_info "Configuring firewall..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable || echo 'Firewall already configured'
ENDSSH

print_info "Deployment completed!"
print_warn "Don't forget to:"
echo "  1. Update .env file with secure passwords and JWT_SECRET"
echo "  2. Run certbot for SSL setup"
echo "  3. Update nginx/beliarg.conf to enable HTTPS redirect after SSL"
echo "  4. Test the application at http://$DOMAIN"

