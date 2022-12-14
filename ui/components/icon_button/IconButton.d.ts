export interface IconWithTextData {
    iconName: string;
    iconColor?: string;
    iconWidth?: string;
    iconHeight?: string;
    text?: string;
}
export interface IconButtonData {
    clickHandler?: () => void;
    groups: IconWithTextData[];
    leadingText?: string;
    trailingText?: string;
    accessibleName?: string;
}
export declare class IconButton extends HTMLElement {
    static readonly litTagName: import("../../lit-html/static.js").Static;
    private readonly shadow;
    private clickHandler;
    private groups;
    private leadingText;
    private trailingText;
    private accessibleName;
    set data(data: IconButtonData);
    get data(): IconButtonData;
    setTexts(texts: (string | undefined)[]): void;
    connectedCallback(): void;
    private onClickHandler;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        'icon-button': IconButton;
    }
}
