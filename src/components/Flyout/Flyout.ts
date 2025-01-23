// © Microsoft Corporation. All rights reserved.

import { FASTElement, ViewTemplate, attr, customElement, observable } from "@cs-core/foundation";
import { html } from "@cs-core/foundation";
import { FlyoutStyles as styles } from "./Flyout.styles";
import { FlyoutTemplate as template } from "./Flyout.template";

export interface FlyoutStrings {
    title: string;
    closeButtonText: string;
    closeButtonAriaLabel: string;
}

export interface FlyoutTelemetryTags {
    closeButton: string;
    openButton: string;
}

@customElement({
    name: "app-flyout",
    template,
    styles
})
export class Flyout extends FASTElement {
    @attr open: boolean = false;
    @attr supportUrl: string;

    @observable public strings: FlyoutStrings;
    @observable public telemetryTags: FlyoutTelemetryTags;

    /**
     * Shows the flyout panel
     */
    public show(): void {
        this.open = true;
        this.$emit("flyout-opened");
    }

    /**
     * Hides the flyout panel
     */
    public hide(): void {
        this.open = false;
        this.$emit("flyout-closed");
        this.$emit("close"); // Add close event for React integration
    }

    /**
     * Toggle the flyout panel state
     */
    public toggle(): void {
        this.open ? this.hide() : this.show();
    }

    /**
     * Handle keyboard events
     */
    private handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape' && this.open) {
            this.hide();
        }
    };

    public get supportUrlLink(): string {
        return this.supportUrl;
    }

    /**
     * Called when the component is connected to the DOM
     */
    public connectedCallback(): void {
        super.connectedCallback();
        
        // Set default strings if not provided
        if (!this.strings) {
            this.strings = {
                title: "Help & Feedback",
                closeButtonText: "Close",
                closeButtonAriaLabel: "Close feedback panel"
            };
        }

        // Add keyboard event listener
        document.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Called when the component is disconnected from the DOM
     */
    public disconnectedCallback(): void {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.handleKeyDown);
    }
}
