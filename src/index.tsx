import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './views/App';

// Import and immediately register the Web Component
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// Ensure the component is registered
if (!customElements.get('help-feedback-element')) {
  console.log('Registering help-feedback-element Web Component from index.tsx');
  customElements.define('help-feedback-element', HelpFeedbackElement);
}

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
