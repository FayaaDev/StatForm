#!/bin/bash

# StatForm Quick Reference
# Common commands for managing StatForm deployment

cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║                    StatForm Quick Reference                     ║
╔════════════════════════════════════════════════════════════════╗

📦 DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Quick Deploy (from local machine):
  $ ./update-statform.sh

  Manual Build & Deploy:
  $ cd react-form-hub && npm run build:subdir
  $ rsync -avz -e "ssh -i ~/.ssh/drfayaa_deploy_key" \
    --exclude='.DS_Store' --delete \
    ./dist/ root@192.64.87.218:/var/www/drfayaa/dist/statform/

🌐 LIVE URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Home Theme:    https://drfayaa.com/statform/
  PHA Theme:     https://drfayaa.com/statform/pha

🔧 DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Start dev server:
  $ cd react-form-hub && npm run dev

  Run locally:
  $ open http://localhost:5173

  Lint code:
  $ cd react-form-hub && npm run lint

🗄️  SERVER MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SSH to VPS:
  $ ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218

  Check deployed files:
  $ ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 \
    "ls -lah /var/www/drfayaa/dist/statform/"

  View Nginx logs:
  $ ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 \
    "tail -f /var/log/nginx/access.log"

  Test Nginx config:
  $ ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 \
    "nginx -t"

  Reload Nginx:
  $ ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 \
    "systemctl reload nginx"

📂 KEY FILES & PATHS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Local:
  - Project:         /Users/fayaa/MyProjects/StatForm
  - React App:       /Users/fayaa/MyProjects/StatForm/react-form-hub
  - Build Output:    /Users/fayaa/MyProjects/StatForm/react-form-hub/dist
  - Deploy Script:   /Users/fayaa/MyProjects/StatForm/update-statform.sh
  - Deployment Doc:  /Users/fayaa/MyProjects/StatForm/DEPLOYMENT.md

  Remote (VPS):
  - Web Root:        /var/www/drfayaa/dist/statform/
  - Nginx Config:    /etc/nginx/sites-available/drfayaa.com
  - Update Script:   /var/www/drfayaa/update-statform.sh
  - SSL Certs:       /etc/letsencrypt/live/drfayaa.com/

⚙️  CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Base Path:         /statform/
  Router Basename:   /statform
  Vite Config:       react-form-hub/vite.config.js
  App Config:        react-form-hub/src/App.jsx
  Theme Config:      react-form-hub/src/config/themes.js

🔍 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Clear build and reinstall:
  $ cd react-form-hub
  $ rm -rf node_modules dist package-lock.json
  $ npm install
  $ npm run build:subdir  # For drfayaa.com/statform
  $ npm run build:root    # For statform.app

  Check asset URLs (all should include /statform/):
  $ grep -r "src=\"/" react-form-hub/src/
  $ grep -r "href=\"/" react-form-hub/src/

  Test deployment:
  $ curl -I https://drfayaa.com/statform/
  $ curl -I https://drfayaa.com/statform/MainLogo.png

  Browser cache:
  - Chrome/Safari: Cmd + Shift + R (Mac)
  - Hard refresh to see changes

📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Full deployment guide:
  $ cat DEPLOYMENT.md

  Project README:
  $ cat react-form-hub/README.md

🎯 QUICK UPDATES WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Make your changes in react-form-hub/src/
  2. Test locally: cd react-form-hub && npm run dev
  3. Deploy: ./update-statform.sh
  4. Verify: open https://drfayaa.com/statform/
  5. Clear browser cache if needed (Cmd+Shift+R)

╚════════════════════════════════════════════════════════════════╝
EOF
