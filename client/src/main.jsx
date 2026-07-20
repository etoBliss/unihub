import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Capture the install prompt BEFORE React mounts — it can fire very early
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__pwaPrompt = e; // stash globally so PWAInstallPrompt can pick it up
});

// Register service worker — autoUpdate mode silently installs new versions
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
