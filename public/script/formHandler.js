const formDOM = document.querySelector('.form');
const formAlert = document.querySelector('.form__alert');

formDOM.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(formDOM).entries());
    const url = window.location.href;

    let data = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(formData),
    });
    data = await data.json();

    if (!data.success) {
      formAlert.innerText = data.message;
    } else {
      document.location.replace('/');
    }
  } catch (err) {
    formAlert.innerText = data.message;
  }
  setTimeout(() => (formAlert.innerText = ''), 5000);
});
