// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { StoreProvider } from './Store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <StoreProvider>
    <Router>
        <App />
    </Router>
      </StoreProvider>
  </React.StrictMode>
);
