// Load and register Web Component immediately
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// Force synchronous registration before any other imports
(function() {
  console.log('Forcing immediate Web Component registration');
  if (typeof customElements !== 'undefined' && !customElements.get('help-feedback-element')) {
    try {
      customElements.define('help-feedback-element', HelpFeedbackElement);
      console.log('Successfully registered help-feedback-element synchronously');
    } catch (error) {
      console.error('Failed to register help-feedback-element:', error);
      // Retry once after a short delay
      setTimeout(() => {
        try {
          if (!customElements.get('help-feedback-element')) {
            customElements.define('help-feedback-element', HelpFeedbackElement);
            console.log('Successfully registered help-feedback-element after delay');
          }
        } catch (retryError) {
          console.error('Failed to register help-feedback-element after retry:', retryError);
        }
      }, 0);
    }
  } else {
    console.log('help-feedback-element already registered or customElements not available');
  }
})();

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
