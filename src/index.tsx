// Import and register Web Component first
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// IIFE to register Web Component immediately
(function registerWebComponent() {
  if (typeof window !== 'undefined' && window.customElements) {
    try {
      if (!window.customElements.get('help-feedback-element')) {
        window.customElements.define('help-feedback-element', HelpFeedbackElement);
        console.log('[DEBUG] Successfully registered help-feedback-element');
      } else {
        console.log('[DEBUG] help-feedback-element already registered');
      }
    } catch (error) {
      console.error('[ERROR] Failed to register help-feedback-element:', error);
    }
  }
})();

// Only import React dependencies after Web Component registration
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './views/App';

// Create root and render app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('[DEBUG] Starting React render');

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
