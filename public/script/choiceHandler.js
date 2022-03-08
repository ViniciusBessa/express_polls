const pollForm = document.querySelector('.poll-form');

pollForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = window.location.href;
  const formData = Object.fromEntries(new FormData(pollForm).entries());
  const data = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
});
