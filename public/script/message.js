const messageDOM = document.querySelector('.alert');
const messageButton = document.querySelector('.alert__button');

if (messageButton) {
  messageButton.addEventListener('click', () => {
    messageDOM.remove();
  });
}
