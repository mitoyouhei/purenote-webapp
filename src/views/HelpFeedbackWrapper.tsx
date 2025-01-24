import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HelpFeedbackElement } from '../webcomponents/HelpFeedbackElement';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'help-feedback-element': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function HelpFeedbackWrapper() {
  const [isComponentReady, setIsComponentReady] = useState(false);

  useEffect(() => {
    // Check if Web Component is registered
    const checkComponentRegistration = () => {
      if (customElements.get('help-feedback-element')) {
        console.log('[DEBUG] Web Component is registered');
        setIsComponentReady(true);
      } else {
        console.log('[DEBUG] Web Component not registered yet, retrying...');
        setTimeout(checkComponentRegistration, 100);
      }
    };

    checkComponentRegistration();
  }, []);

  const handleFeedbackRequested = (event: Event) => {
    console.log('[DEBUG] Feedback requested');
    // TODO: Implement feedback form or modal
  };

  useEffect(() => {
    if (!isComponentReady) return;

    const element = document.querySelector('help-feedback-element');
    if (element) {
      element.addEventListener('feedback-requested', handleFeedbackRequested);
      console.log('[DEBUG] Event listener added');
    }

    return () => {
      if (element) {
        element.removeEventListener('feedback-requested', handleFeedbackRequested);
      }
    };
  }, [isComponentReady]);

  if (!isComponentReady) {
    return <div>Loading Help & Feedback...</div>;
  }

  return (
    <div className="help-feedback-wrapper" style={{ minHeight: '100vh', padding: '20px' }}>
      <help-feedback-element></help-feedback-element>
    </div>
  );
}
