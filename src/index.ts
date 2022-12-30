interface Options{
    content: string | object;
    url: string;
    submitSelector: string;
}

interface ModalInterface{
    buttonSelector: string;
    type: string;
    options: Options;
}

class Modal implements ModalInterface
{
    buttonSelector: string;
    buttons: NodeList;
    modal: HTMLElement;
    type: string;
    options: Options;
    
    constructor({
        buttonSelector = '',
        type = '',
        options = {
            url: '',
            content: null,
            submitSelector: null,
        },
    } = {})
    {
        this.type = type.toUpperCase();

        switch(this.type){
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

    initOpenModalButtons = (buttonSelector: string): void => {
        if(!buttonSelector) console.error('The modal open button is not defined');
        else{
            this.buttons = document.querySelectorAll(buttonSelector);

            if(!this.buttons.length) console.error('The modal open button does not exist');
            else{
                this.buttons.forEach(button => {
                    button.addEventListener('click', this.openModal);
                });
            }
        }
    }

    openModal = (): void => {
        $(this.modal).modal('show');
    }

    createDefaultModal = (content: string | object): void => {
        this.createModal();

        this.setContent(content);
    }

    createFormModal = (url: string, content: string | object, submitSelector: string): void => {
        this.createModal();

        if(url){
            this.getHtmlForm(url).then(html => {
                this.setContent(html);

                if(!submitSelector){
                    console.error('Submit selector is not defined');
                }else{
                    const submitButtons = this.modal.querySelectorAll(submitSelector);
        
                    if(!submitButtons.length){
                        console.error('Submit selector does not exisit');
                    }else{
                        submitButtons.forEach(button => {
                            button.addEventListener('click', e => this.sendRequest(e));
                        });
                    }
                }
            });
        }else{
            this.setContent(content);

            if(!submitSelector){
                console.error('Submit selector is not defined');
            }else{
                const submitButtons = this.modal.querySelectorAll(submitSelector);
    
                if(!submitButtons.length){
                    console.error('Submit selector does not exisit');
                }else{
                    submitButtons.forEach(button => {
                        button.addEventListener('click', e => this.sendRequest(e));
                    });
                }
            }
        }
    }

    sendRequest = (e: Event): void => {
        const form = e.currentTarget.closest('form');
        const formData = new FormData(form);
        const csrfToken = document.querySelector(`input[name='_token']`);

        if(!form.getAttribute('action')) console.error('Form action is null');
        else{
            $.ajax({
                method: "POST",
                url: form.action,
                data: formData,
                headers: {
                    'X-CSRF-Token': csrfToken ? csrfToken.value : '',
                },
                cache: false,
                contentType: false,
                processData: false,
                success: response => {
                    this.removeErrors();
                    window.location.reload();
                },
                error: response => {
                    this.removeErrors();
                    this.displayErrors(form, JSON.parse(response.responseText).errors);
                },
            });
        }
    }

    displayErrors = (form: any, errors: object) => {
        const inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('select'), ...form.querySelectorAll('textarea')];

        inputs.forEach(input => {
            if(errors[input.name]){
                const errorElement = document.createElement('span');
                errorElement.classList.add('invalid-feedback', 'd-block', 'w-100');

                errorElement.innerHTML = errors[input.name];
                input.parentElement.append(errorElement);
            }
        });
    }

    removeErrors = () => {
        this.modal.querySelectorAll('.invalid-feedback').forEach(error => {
            error.remove();
        })
    }

    createModal = (): void => {
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
    }

    setContent = (content: string | object): void => {
        const modalContent = this.modal.querySelector('.modal-content');
        switch(typeof(content)){
            case 'string':
                modalContent.innerHTML = content;
                break;
            case 'object':
                modalContent.innerHTML = '';
                modalContent.append(content);
                break;
        }
    }

    getHtmlForm = async (url: string): Promise<string> => {
        const response = await fetch(url).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(function (html) {
            // This is the HTML from our response as a text string
            return html;
        })

        return response;
    }
}