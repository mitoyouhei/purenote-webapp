import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './views/App';
import { HelpFeedbackElement } from './webcomponents/HelpFeedbackElement';

// Register Web Component before React renders
if (typeof window !== 'undefined' && window.customElements) {
  try {
    if (!window.customElements.get('help-feedback-element')) {
      window.customElements.define('help-feedback-element', HelpFeedbackElement);
      console.log('Successfully registered help-feedback-element');
    } else {
      console.log('help-feedback-element already registered');
    }
  } catch (error) {
    console.error('Failed to register help-feedback-element:', error);
  }
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
