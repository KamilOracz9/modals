# Description

Package to create modal

## Installation

Via NPM: npm i kamiloracz_modals

Via CDN: https://cdn.jsdelivr.net/gh/KamilOracz9/modals@1.0.5/dist/index.js

## Configuration

##### Add data-url attribute to buttons opening modal

```html

<button data-url="Some url" class=".open-modal">Open modal</button>

```

```javascript

new Modal({
    buttonSelector: '', // Buttons opening modal
    type: '', // Type of modal (form / modal), default modal
    options: {
      content: '', // Modal content (string / html element)
      submitSelector: '', // If selected type is form, this button send request to backend
    }
});

```