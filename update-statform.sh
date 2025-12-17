#!/bin/bash

# StatForm Remote Update Script
# Run this script from your local machine to build and deploy StatForm to the VPS

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
LOCAL_PROJECT_DIR="/Users/fayaa/MyProjects/StatForm/react-form-hub"
REMOTE_USER="root"
REMOTE_HOST="192.64.87.218"
REMOTE_PATH="/var/www/drfayaa/dist/statform"
SSH_KEY="$HOME/.ssh/drfayaa_deploy_key"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  StatForm Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if local project directory exists
if [ ! -d "$LOCAL_PROJECT_DIR" ]; then
    echo -e "${RED}✗ Error: Project directory not found: $LOCAL_PROJECT_DIR${NC}"
    exit 1
fi

# Navigate to project directory
echo -e "${YELLOW}→ Navigating to project directory...${NC}"
cd "$LOCAL_PROJECT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}→ node_modules not found. Running npm install...${NC}"
    npm install
fi

# Build the React app
echo ""
echo -e "${YELLOW}→ Building React application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Check if build directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}✗ Error: Build directory 'dist' not found${NC}"
    exit 1
fi

# Display build info
BUILD_SIZE=$(du -sh dist | cut -f1)
echo -e "${BLUE}→ Build size: $BUILD_SIZE${NC}"

# Deploy to VPS
echo ""
echo -e "${YELLOW}→ Deploying to VPS...${NC}"
echo -e "${BLUE}→ Target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH${NC}"

rsync -avz \
    -e "ssh -i $SSH_KEY" \
    --exclude='.DS_Store' \
    --delete \
    dist/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Files deployed successfully${NC}"

# Verify deployment
echo ""
echo -e "${YELLOW}→ Verifying deployment...${NC}"
REMOTE_FILE_CHECK=$(ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "[ -f $REMOTE_PATH/index.html ] && echo 'OK' || echo 'FAIL'")

if [ "$REMOTE_FILE_CHECK" = "OK" ]; then
    echo -e "${GREEN}✓ Deployment verified - index.html found${NC}"
else
    echo -e "${RED}✗ Deployment verification failed - index.html not found${NC}"
    exit 1
fi

# Get deployed file info
REMOTE_FILES=$(ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" "ls -1 $REMOTE_PATH | wc -l")
echo -e "${BLUE}→ Total files deployed: $REMOTE_FILES${NC}"

# Check key assets
echo ""
echo -e "${YELLOW}→ Checking key assets...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" bash << 'REMOTE_SCRIPT'
REMOTE_PATH="/var/www/drfayaa/dist/statform"

check_file() {
    if [ -f "$REMOTE_PATH/$1" ]; then
        echo "  ✓ $1"
    else
        echo "  ✗ $1 (missing)"
    fi
}

check_file "index.html"
check_file "formsmd.bundle.min.js"
check_file "composer.bundle.min.js"
check_file "MainLogo.png"
check_file "logos/PHAlogo.png"
check_file "font/majalla.ttf"
REMOTE_SCRIPT

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}→ Home Theme URL:${NC} https://drfayaa.com/statform/"
echo -e "${BLUE}→ PHA Theme URL:${NC}  https://drfayaa.com/statform/pha"
echo -e "${BLUE}→ Timestamp:${NC}      $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${YELLOW}Tip: Clear your browser cache if you don't see the changes${NC}"
echo ""
