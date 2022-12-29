// import Modal from "./Modal.js";

// var button = document.createElement('button');
// button.innerHTML = 'asdasdasdasd';

// var form = document.createElement('form');
// var submitButton = document.createElement('button');
// submitButton.type = 'button';
// submitButton.innerHTML = 'submit';
// submitButton.classList.add('submit-form');

// form.appendChild(submitButton);

// const modal = new Modal({
//   buttonSelector: '.open-modal', // Buttons opening modal
//   type: 'FORM', // Type of modal (form / modal), default modal
//   options: {
//     content: form, // Modal content (string / html element)
//     url: 'http://127.0.0.1:8000/products/questions/create', // Url to route returning view (if null, options.content will be injected)
//     submitSelector: '.create-submit', // If selected type is form, this button send request to backend
//   }
// });

export {default as Modal} from './Modal.js';