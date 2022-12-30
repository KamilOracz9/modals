interface Options {
    content: string | object;
    url: string;
    submitSelector: string;
}
interface ModalInterface {
    buttonSelector: string;
    type: string;
    options: Options;
}
export default class Modal implements ModalInterface {
    buttonSelector: string;
    buttons: NodeList;
    modal: HTMLElement;
    type: string;
    options: Options;
    constructor({ buttonSelector, type, options, }?: {
        buttonSelector?: string;
        type?: string;
        options?: {
            url: string;
            content: any;
            submitSelector: any;
        };
    });
    initOpenModalButtons: (buttonSelector: string) => void;
    openModal: () => void;
    createDefaultModal: (content: string | object) => void;
    createFormModal: (url: string, content: string | object, submitSelector: string) => void;
    sendRequest: (e: Event) => void;
    displayErrors: (form: any, errors: object) => void;
    removeErrors: () => void;
    createModal: () => void;
    setContent: (content: string | object) => void;
    getHtmlForm: (url: string) => Promise<string>;
}
export {};
