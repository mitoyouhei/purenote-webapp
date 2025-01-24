import { HelpFeedbackElement } from './HelpFeedbackElement';

// Register Web Component immediately when this file is imported
console.log('Attempting to register help-feedback-element Web Component');
if (!customElements.get('help-feedback-element')) {
  try {
    customElements.define('help-feedback-element', HelpFeedbackElement);
    console.log('Successfully registered help-feedback-element Web Component');
  } catch (error) {
    console.error('Failed to register help-feedback-element:', error);
  }
} else {
  console.log('help-feedback-element Web Component already registered');
}
