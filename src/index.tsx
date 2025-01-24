// Load and register Web Component
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// Ensure customElements is available and register the component
if (typeof window !== 'undefined' && window.customElements) {
  window.customElements.whenDefined('help-feedback-element').then(() => {
    console.log('help-feedback-element is defined and ready');
  });

  if (!window.customElements.get('help-feedback-element')) {
    window.customElements.define('help-feedback-element', HelpFeedbackElement);
    console.log('Registered help-feedback-element');
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
