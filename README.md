##### config

new Modal({
  buttonSelector: '', // Buttons opening modal
  type: '', // Type of modal (form / modal), default modal
  options: {
    content: '', // Modal content (string / html element)
    url: '', // Url to route returning view (if null, options.content will be injected)
    submitSelector: '', // If selected type is form, this button send request to backend
  }
});