var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class Modal {
    constructor({ buttonSelector = '', type = '', options = {
        url: '',
        content: null,
        submitSelector: null,
    }, } = {}) {
        this.initOpenModalButtons = (buttonSelector) => {
            this.buttons = document.querySelectorAll(buttonSelector);
            if (!this.buttons.length)
                console.error('The modal open button does not exist');
            else {
                this.buttons.forEach(button => {
                    button.addEventListener('click', this.openModal);
                });
            }
        };
        this.openModal = () => {
            $(this.modal).modal('show');
        };
        this.createDefaultModal = (content) => {
            this.createModal();
            this.setContent(content);
        };
        this.createFormModal = (url, content, submitSelector) => {
            this.createModal();
            if (url) {
                this.getHtmlForm(url).then(html => {
                    this.setContent(html);
                    if (!submitSelector) {
                        console.error('Submit selector is not defined');
                    }
                    else {
                        const submitButtons = this.modal.querySelectorAll(submitSelector);
                        if (!submitButtons.length) {
                            console.error('Submit selector does not exisit');
                        }
                        else {
                            submitButtons.forEach(button => {
                                button.addEventListener('click', e => this.sendRequest(e));
                            });
                        }
                    }
                });
            }
            else {
                this.setContent(content);
                if (!submitSelector) {
                    console.error('Submit selector is not defined');
                }
                else {
                    const submitButtons = this.modal.querySelectorAll(submitSelector);
                    if (!submitButtons.length) {
                        console.error('Submit selector does not exisit');
                    }
                    else {
                        submitButtons.forEach(button => {
                            button.addEventListener('click', e => this.sendRequest(e));
                        });
                    }
                }
            }
        };
        this.sendRequest = (e) => {
            const form = e.currentTarget.closest('form');
            const formData = new FormData(form);
            const csrfToken = document.querySelector(`input[name='_token']`);
            if (!form.getAttribute('action'))
                console.error('Form action is null');
            else {
                fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'X-CSRF-Token': csrfToken ? csrfToken.value : '',
                    },
                    contentType: false,
                    processData: false,
                })
                    .then(response => {
                    this.removeErrors();
                    window.location.reload();
                })
                    .catch(response => {
                    console.log(response);
                    if (typeof (response.responseText) !== 'json') {
                        console.error('Response from backend is not valid json');
                        return false;
                    }
                    this.removeErrors();
                    this.displayErrors(form, JSON.parse(response.responseText).errors);
                });
            }
        };
        this.displayErrors = (form, errors) => {
            const inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('select'), ...form.querySelectorAll('textarea')];
            inputs.forEach(input => {
                if (errors[input.name]) {
                    const errorElement = document.createElement('span');
                    errorElement.classList.add('invalid-feedback', 'd-block', 'w-100');
                    errorElement.innerHTML = errors[input.name];
                    input.parentElement.append(errorElement);
                }
            });
        };
        this.removeErrors = () => {
            this.modal.querySelectorAll('.invalid-feedback').forEach(error => {
                error.remove();
            });
        };
        this.createModal = () => {
            const modalId = Date.now().toString();
            document.body.innerHTML += `
            <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        
                    </div>
                </div>
            </div>
        `;
            this.modal = document.getElementById(modalId);
        };
        this.setContent = (content) => {
            const modalContent = this.modal.querySelector('.modal-content');
            switch (typeof (content)) {
                case 'string':
                    modalContent.innerHTML = content;
                    break;
                case 'object':
                    modalContent.innerHTML = '';
                    modalContent.append(content);
                    break;
            }
        };
        this.getHtmlForm = (url) => __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url).then(function (response) {
                // The API call was successful!
                return response.text();
            }).then(function (html) {
                // This is the HTML from our response as a text string
                return html;
            });
            return response;
        });
        this.type = type.toUpperCase();
        switch (this.type) {
            case 'FORM':
                this.createFormModal(options.url, options.content, options.submitSelector);
                break;
            case 'MODAL':
                this.createDefaultModal(options.content);
                break;
            default:
                this.createDefaultModal(options.content);
                break;
        }
        this.initOpenModalButtons(buttonSelector);
    }
}
//# sourceMappingURL=Modal.js.map