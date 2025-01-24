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

  return (
    <div className="help-feedback-wrapper">
      <help-feedback-element></help-feedback-element>
    </div>
  );
}
