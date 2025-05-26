import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Add Chrome runtime type
declare global {
  interface Window {
    chrome?: {
      runtime: {
        onMessage: {
          removeListener: (callback: () => void) => void;
        };
      };
    };
  }
}

// Cleanup function for message port
const cleanup = () => {
  if (window.chrome && window.chrome.runtime) {
    try {
      window.chrome.runtime.onMessage.removeListener(() => {});
    } catch (e) {
      console.log('Cleanup completed');
    }
  }
};

// Add cleanup on unmount
window.addEventListener('unload', cleanup);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
