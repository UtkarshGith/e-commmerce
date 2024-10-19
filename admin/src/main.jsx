import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Capitalized

// Create the root and render the App inside BrowserRouter
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BrowserRouter>  {/* Capitalized */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
