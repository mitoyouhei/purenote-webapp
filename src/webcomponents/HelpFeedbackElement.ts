const TEMPLATE_HTML = `
  <style>
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h2 {
      color: #333;
      margin-bottom: 2rem;
    }
    h3 {
      color: #666;
      margin: 1.5rem 0;
    }
    .faq-item {
      margin-bottom: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    .faq-question {
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .faq-question:hover {
      background-color: #e9ecef;
    }
    .faq-question span {
      transition: transform 0.2s;
    }
    .faq-question.open span {
      transform: rotate(180deg);
    }
    .faq-answer {
      display: none;
      padding: 1rem;
      color: #666;
      line-height: 1.5;
      border-top: 1px solid #e0e0e0;
    }
    .faq-answer.open {
      display: block;
    }
    .feedback-section {
      margin-top: 2rem;
      text-align: center;
    }
    .feedback-text {
      color: #666;
      margin-bottom: 1rem;
    }
    .feedback-button {
      background-color: #0d6efd;
      color: #fff;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    .feedback-button:hover {
      background-color: #0b5ed7;
    }
  </style>
  <div class="help-feedback-container">
    <h2>Help and Feedback</h2>
    
    <section class="faq-section">
      <h3>FAQ</h3>
      <div class="faq-item">
        <div class="faq-question">
          How can I turn off the news feed?
          <span>▼</span>
        </div>
        <div class="faq-answer">
          You can turn off the news feed by going to Settings > Preferences and toggling the "Show News Feed" option.
        </div>
      </div>
      
      <div class="faq-item">
        <div class="faq-question">
          How can I change the language of my news feed?
          <span>▼</span>
        </div>
        <div class="faq-answer">
          To change the language, navigate to Settings > Language & Region and select your preferred language from the dropdown menu.
        </div>
      </div>
      
      <div class="faq-item">
        <div class="faq-question">
          Where can I find Quick Links, how can I hide them?
          <span>▼</span>
        </div>
        <div class="faq-answer">
          Quick Links can be found in the sidebar. To hide them, click on the "Quick Links" header and click the hide icon, or go to Settings > Sidebar to customize visibility.
        </div>
      </div>
      
      <div class="faq-item">
        <div class="faq-question">
          How can I change my background image?
          <span>▼</span>
        </div>
        <div class="faq-answer">
          To change your background image, go to Settings > Appearance > Background. You can either choose from our preset images or upload your own.
        </div>
      </div>
    </section>
    
    <section class="feedback-section">
      <h3>Send feedback</h3>
      <p class="feedback-text">Can't find a solution? Send us your feedback</p>
      <button class="feedback-button">Send Feedback</button>
    </section>
  </div>
`;

class HelpFeedbackElement extends HTMLElement {
  private shadow!: ShadowRoot;

  constructor() {
    super();
    console.log('[DEBUG] HelpFeedbackElement constructor called');
    
    try {
      // Create and attach shadow root
      this.shadow = this.attachShadow({ mode: "open" });
      console.log('[DEBUG] Shadow root attached');

      // Set innerHTML directly and force a reflow
      this.shadow.innerHTML = TEMPLATE_HTML;
      void this.shadow.offsetHeight; // Force reflow
      console.log('[DEBUG] Template HTML set directly to shadow root');

      // Log the actual content
      const container = this.shadow.querySelector('.help-feedback-container');
      console.log('[DEBUG] Container found:', !!container);
      if (container) {
        console.log('[DEBUG] Container HTML length:', container.innerHTML.length);
        console.log('[DEBUG] Container children count:', container.children.length);
        console.log('[DEBUG] First child tag:', container.firstElementChild?.tagName);
      } else {
        throw new Error('Container not found in shadow DOM');
      }

      // Force styles
      requestAnimationFrame(() => {
        this.style.display = 'block';
        this.style.width = '100%';
        if (container) {
          container.style.display = 'block';
          container.style.visibility = 'visible';
        }
      });
    } catch (error) {
      console.error('[ERROR] Failed to initialize component:', error);
      this.shadow.innerHTML = `
        <div style="color: red; padding: 20px; border: 1px solid red;">
          Error initializing help component: ${error instanceof Error ? error.message : 'Unknown error'}
          <br>
          <small>Please check console for details.</small>
        </div>
      `;
    }
  }

  connectedCallback() {
    try {
      console.log('[DEBUG] HelpFeedbackElement connected');
      this.style.display = 'block';
      this.setupEventListeners();
      console.log('[DEBUG] Event listeners set up');
    } catch (error) {
      console.error('[ERROR] Failed in connectedCallback:', error);
    }
  }

  private setupEventListeners() {
    // Add click handlers for FAQ questions
    this.shadow.querySelectorAll(".faq-question").forEach((questionEl) => {
      questionEl.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLElement;
        const answer = target.nextElementSibling as HTMLElement;
        
        // Toggle the open class on both question and answer
        target.classList.toggle("open");
        answer.classList.toggle("open");
      });
    });

    // Add click handler for feedback button
    const feedbackButton = this.shadow.querySelector(".feedback-button");
    if (feedbackButton) {
      feedbackButton.addEventListener("click", () => {
        // Dispatch a custom event that React components can listen to
        this.dispatchEvent(new CustomEvent("feedback-requested", {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  // Cleanup event listeners when element is removed
  disconnectedCallback() {
    this.shadow.querySelectorAll(".faq-question").forEach((questionEl) => {
      questionEl.replaceWith(questionEl.cloneNode(true));
    });
    
    const feedbackButton = this.shadow.querySelector(".feedback-button");
    if (feedbackButton) {
      feedbackButton.replaceWith(feedbackButton.cloneNode(true));
    }
  }
}

// Export the class only, registration is handled in index.tsx
export { HelpFeedbackElement };
