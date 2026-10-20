import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './i18n';
import './index.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('#root not found');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is prerendered (scripts/prerender.mjs); dev starts empty.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
