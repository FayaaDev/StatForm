# StatForm Deployment Guide

This guide explains how to deploy updates to StatForm on your VPS.

## Quick Deploy (Recommended)

To build and deploy StatForm from your local machine to the VPS:

```bash
cd /Users/fayaa/MyProjects/StatForm
./update-statform.sh
```

This script will:
1. ✅ Build the React application
2. ✅ Deploy files to the VPS via rsync
3. ✅ Verify the deployment
4. ✅ Check that all key assets are present

## Manual Deployment

If you prefer to deploy manually:

```bash
# 1. Build the application
cd /Users/fayaa/MyProjects/StatForm/react-form-hub
npm run build

# 2. Deploy to VPS
rsync -avz -e "ssh -i ~/.ssh/drfayaa_deploy_key" \
  --exclude='.DS_Store' \
  --delete \
  ./dist/ root@192.64.87.218:/var/www/drfayaa/dist/statform/
```

## Server-Side Updates (Advanced)

If you have the source code cloned on the VPS at `/var/www/statform-source`, you can update directly on the server:

```bash
ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218
/var/www/drfayaa/update-statform.sh
```

**Note:** This requires the repository to be cloned on the server first.

## Live URLs

After deployment, your app will be available at:

- **Home Theme:** https://drfayaa.com/statform/
- **PHA Theme:** https://drfayaa.com/statform/pha

## Configuration Files

### Important Files Modified for Deployment

1. **`vite.config.js`** - Sets `base: "/statform/"` for subdirectory deployment
2. **`src/App.jsx`** - Uses `basename="/statform"` in BrowserRouter
3. **`src/config/themes.js`** - All asset paths include `/statform/` prefix
4. **`index.html`** - Inline script uses base path for dynamic CSS loading

### Server Configuration

- **Nginx Config:** `/etc/nginx/sites-available/drfayaa.com`
- **Deployment Path:** `/var/www/drfayaa/dist/statform/`
- **Backup Configs:** `/etc/nginx/sites-available/drfayaa.com.backup-*`

## Troubleshooting

### Images or Assets Not Loading

If images/assets return 404 errors:

1. Verify all paths include the `/statform/` prefix
2. Check that files exist on the server:
   ```bash
   ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 "ls -la /var/www/drfayaa/dist/statform/"
   ```
3. Clear browser cache (Cmd+Shift+R on Mac)

### React Router Not Working

If routes return 404:

1. Check that Nginx config has the correct `try_files` directive
2. Verify `basename="/statform"` is set in `BrowserRouter`
3. Test Nginx config:
   ```bash
   ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 "nginx -t"
   ```

### Build Fails

1. Clear node_modules and reinstall:
   ```bash
   cd react-form-hub
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. Check Node.js version (requires Node 18+):
   ```bash
   node -v
   ```

## Nginx Configuration

The Nginx configuration includes:

- ✅ SSL/HTTPS with Let's Encrypt
- ✅ Gzip compression
- ✅ Security headers
- ✅ Static asset caching (1 year)
- ✅ React Router SPA support via `try_files`

To reload Nginx after config changes:

```bash
ssh -i ~/.ssh/drfayaa_deploy_key root@192.64.87.218 "nginx -t && systemctl reload nginx"
```

## File Structure on Server

```
/var/www/drfayaa/dist/statform/
├── assets/
│   ├── index-*.js          # React bundle
│   └── index-*.css         # Compiled CSS
├── font/
│   └── majalla.ttf         # Custom font
├── logos/
│   ├── PHAlogo.png         # PHA theme logo
│   └── PHAlogo.svg
├── composer.bundle.min.js  # Forms.md composer
├── formsmd.bundle.min.js   # Forms.md renderer
├── formsmd.min.css         # LTR styles
├── formsmd.rtl.min.css     # RTL styles
├── FreeLanceCertificate.pdf
├── FreeLanceLogo.png
├── MainLogo.png            # Home theme logo
├── statform-favicon.svg
└── index.html              # Entry point
```

## Development vs Production

### Development
```bash
cd react-form-hub
npm run dev
```
Access at: http://localhost:5173

### Production
```bash
./update-statform.sh
```
Access at: https://drfayaa.com/statform/

## SSH Key Location

The deployment uses the SSH key at: `~/.ssh/drfayaa_deploy_key`

Make sure this key is added to the VPS's `~/.ssh/authorized_keys` file.

## Support

For issues or questions about deployment:
- Check the console logs in your browser (F12)
- Check Nginx error logs on the server: `/var/log/nginx/error.log`
- Verify file permissions: `ls -la /var/www/drfayaa/dist/statform/`
