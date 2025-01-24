// Register Web Component before anything else
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// Ensure Web Component is registered before React
console.log('Attempting to register Web Component in index.tsx');
if (!customElements.get('help-feedback-element')) {
  try {
    customElements.define('help-feedback-element', HelpFeedbackElement);
    console.log('Successfully registered Web Component in index.tsx');
  } catch (error) {
    console.error('Failed to register Web Component:', error);
  }
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
