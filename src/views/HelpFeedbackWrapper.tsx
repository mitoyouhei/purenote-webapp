import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'help-feedback-element': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function HelpFeedbackWrapper() {
  const handleFeedbackRequested = (event: Event) => {
    // Handle the feedback-requested custom event
    console.log('Feedback requested');
    // TODO: Implement feedback form or modal
  };

  React.useEffect(() => {
    const element = document.querySelector('help-feedback-element');
    if (element) {
      element.addEventListener('feedback-requested', handleFeedbackRequested);
    }
    return () => {
      if (element) {
        element.removeEventListener('feedback-requested', handleFeedbackRequested);
      }
    };
  }, []);

  console.log('Rendering HelpFeedbackWrapper');
  return (
    <div className="help-feedback-wrapper" style={{ minHeight: '100vh', padding: '20px', position: 'relative', zIndex: 1 }}>
      <help-feedback-element style={{ display: 'block', visibility: 'visible' }}></help-feedback-element>
    </div>
  );
}
