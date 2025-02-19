import React from 'react';
import ReactDOM from 'react-dom/client';  // Cambié la importación de 'react-dom' a 'react-dom/client'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Usamos createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
