import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import ErrorBoundary from './general/components/ErrorBoundary';

// Place this below the imports to ensure they are in the correct order
// Save the original console.error function
const originalConsoleError = console.error;

console.error = function (message, ...args) {
  // If the error message contains the ResizeObserver loop error, ignore it
  if (typeof message === 'string' && message.includes("ResizeObserver")) {
    return;
  }

  // Otherwise, call the original console.error function
  originalConsoleError.apply(console, [message, ...args]);
};

// Save the original console.warn function
const originalConsoleWarn = console.warn;

console.warn = function (message, ...args) {
  // If the warning message contains the ResizeObserver loop warning, ignore it
  if (typeof message === 'string' && message.includes("ResizeObserver")) {
    return;
  }

  // Otherwise, call the original console.warn function
  originalConsoleWarn.apply(console, [message, ...args]);
};

// Optionally, use window.addEventListener to catch and suppress errors globally
window.addEventListener('error', event => {
  if (event.message.includes('ResizeObserver')) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </StrictMode>
);

reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
