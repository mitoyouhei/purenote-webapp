// © Microsoft Corporation. All rights reserved.

import { 
    accentForegroundHover, 
    accentForegroundRest,
    neutralLayerFloating,
    neutralStrokeDividerRest,
    typeRampBaseFontSize,
    typeRampPlusOneFontSize
} from "@cs-core/design-system";
import { css } from "@cs-core/foundation";
import { CommonCSSStyles } from "../../FeedbackDialogWC.styles";

export const FlyoutStyles = css`
    ${CommonCSSStyles}

    :host {
        display: block;
        position: fixed;
        top: 0;
        right: 0;
        width: 320px;
        height: 100vh;
        background: ${neutralLayerFloating};
        box-shadow: -2px 0 8px rgba(0,0,0,0.2);
        z-index: 999;
        overflow-y: auto;
        transition: transform 0.3s ease-in-out;
        transform: ${x => x.open ? "translateX(0)" : "translateX(100%)"};
        visibility: ${x => x.open ? "visible" : "hidden"};
    }

    .flyout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid ${neutralStrokeDividerRest};
    }

    .flyout-title {
        margin: 0;
        font-size: ${typeRampPlusOneFontSize};
        line-height: 1.2;
    }

    .flyout-close {
        cursor: pointer;
        color: ${accentForegroundRest};
        padding: 8px;
        margin: -8px;
    }

    .flyout-close:hover {
        color: ${accentForegroundHover};
    }

    .flyout-content {
        padding: 16px;
        font-size: ${typeRampBaseFontSize};
    }

    .flyout-footer {
        padding: 16px;
        border-top: 1px solid ${neutralStrokeDividerRest};
        margin-top: auto;
    }

    ::slotted(*) {
        margin: 8px 0;
    }
`;
