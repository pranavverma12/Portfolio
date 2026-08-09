import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const blockRestrictedActions = () => {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  document.addEventListener('keydown', (event) => {
    const key = String(event.key).toLowerCase();
    const isModifierPressed = event.ctrlKey || event.metaKey;
    const isSaveShortcut = isModifierPressed && key === 's';
    const isInspectShortcut =
      (isModifierPressed && event.shiftKey && ['i', 'c', 'j'].includes(key)) ||
      key === 'f12' ||
      (isModifierPressed && key === 'u');

    if (isSaveShortcut || isInspectShortcut) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  document.addEventListener('dragstart', (event) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });
};

blockRestrictedActions();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
