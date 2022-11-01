import { RegisteredFileStrings } from './localized-string-set.js';
export declare type UIStrings = Record<string, string>;
export declare type LocalizedMessages = Record<string, {
    message: string;
}>;
/**
 * Encapsulates the global state of the i18n runtime.
 */
export declare class I18n {
    private localeData;
    registerLocaleData(locale: Intl.UnicodeBCP47LocaleIdentifier, messages: LocalizedMessages): void;
    registerFileStrings(filename: string, stringStructure: UIStrings): RegisteredFileStrings;
}
