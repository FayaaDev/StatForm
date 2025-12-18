const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure Metro only watches the mobile-app directory
// This prevents it from bundling web components from the parent project
config.watchFolders = [__dirname];

// Block the parent directory's components from being resolved
config.resolver.blockList = [
  // Block parent project components that use web-only features
  new RegExp(path.resolve(__dirname, '../components') + '/.*'),
  new RegExp(path.resolve(__dirname, '../contexts') + '/.*'),
  new RegExp(path.resolve(__dirname, '../hooks') + '/.*'),
  new RegExp(path.resolve(__dirname, '../services') + '/.*'),
  new RegExp(path.resolve(__dirname, '../utils') + '/.*'),
];

module.exports = config;
