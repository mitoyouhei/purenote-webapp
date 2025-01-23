// © Microsoft Corporation. All rights reserved.

import CloseButton from "@msnews/icons-wc/icons/CloseButton.svg";
import { Flyout } from "./Flyout";
import { html } from "@cs-core/foundation";

export const FlyoutTemplate = html<Flyout>`
    <template>
        <div 
            role="complementary"
            aria-label=${x => x.strings?.title || "Help & Feedback"}
            aria-hidden=${x => !x.open}
        >
            <div class="flyout-header">
                <h2 class="flyout-title" id="flyoutTitle">${x => x.strings?.title}</h2>
                <fluent-button
                    slot="close-button"
                    appearance="stealth"
                    tabindex="0"
                    id="flyoutCloseButton"
                    @click=${x => x.hide()}
                    aria-label=${x => x.strings?.closeButtonAriaLabel}
                    role="button"
                    title=${x => x.strings?.closeButtonText}
                    data-t="${x => x.telemetryTags?.closeButton}"
                >
                    ${html.partial(CloseButton)}
                </fluent-button>
            </div>
            <div 
                class="flyout-content" 
                role="region"
                aria-labelledby="flyoutTitle"
            >
                <slot></slot>
            </div>
            <div class="flyout-footer">
                <slot name="footer"></slot>
            </div>
        </div>
    </template>
`;
