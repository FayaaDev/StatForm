# Deployment Guide

This guide explains how to build and deploy the React Form Hub for different domains.

## Build Commands

The app supports two deployment scenarios:

### 1. Root Domain Deployment (statform.app)

For deploying to the root of a domain:

```bash
cd react-form-hub
npm run build:root
```

This builds the app with `base: "/"`, making all assets load from the root path.

### 2. Subdirectory Deployment (drfayaa.com/statform)

For deploying to a subdirectory:

```bash
cd react-form-hub
npm run build:subdir
```

This builds the app with `base: "/statform/"`, making all assets load from the `/statform` path.

## Custom Base Path

To deploy to a different subdirectory, set the `VITE_BASE_PATH` environment variable:

```bash
VITE_BASE_PATH=/your-path/ npm run build
```

## How It Works

The app uses Vite's `BASE_URL` feature to make all asset paths dynamic:

- **vite.config.js**: Uses `process.env.VITE_BASE_PATH` to set the base path
- **App.jsx**: Uses `import.meta.env.BASE_URL` for React Router's basename
- **index.html**: Uses `%BASE_URL%` placeholders for asset paths
- **Config files**: Use getters to dynamically construct paths at runtime

## After Building

1. The build output will be in `react-form-hub/dist/`
2. Upload the entire `dist/` folder to your server
3. For root deployment: Upload to the web root
4. For subdirectory deployment: Upload to the appropriate subdirectory

## Testing Locally

To test the production build locally:

```bash
cd react-form-hub
npm run preview
```

This will serve the built files on a local server for testing.
