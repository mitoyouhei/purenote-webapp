// Load and register Web Component immediately
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// Register Web Component when DOM is ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (!customElements.get('help-feedback-element')) {
      try {
        customElements.define('help-feedback-element', HelpFeedbackElement);
        console.log('Successfully registered help-feedback-element');
      } catch (error) {
        console.error('Failed to register help-feedback-element:', error);
      }
    }
  });
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './views/App';

// Create root and render app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Add debug log for React rendering
console.log('Starting React render');

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
