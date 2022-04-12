const formDOM = document.querySelector('.form');
const formAlert = document.querySelector('.form__alert');
const choicesDiv = document.getElementById('choices');
let choicesCount = 3;

formDOM.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();
    const { title, duplicates, ...choices } = Object.fromEntries(
      new FormData(formDOM).entries()
    );

    let data = await fetch('/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ title, choices, duplicates }),
    });
    data = await data.json();

    if (!data.success) {
      formAlert.innerText = data.message;
    } else {
      document.location.replace(`/polls/${data.pollId}`);
    }
  } catch (err) {
    formAlert.innerText = data.message;
  }
  setTimeout(() => (formAlert.innerText = ''), 5000);
});

choicesDiv.addEventListener('input', (event) => {
  let lastInput = choicesDiv.children;
  lastInput = lastInput[lastInput.length - 1];

  // Se o event target for o último input do choicesDiv
  if (event.target === lastInput) {
    let newInput = document.createElement('input');
    newInput.className = 'form__input';
    newInput.name = `choice-${choicesCount + 1}`;
    newInput.type = 'text';
    newInput.placeholder = 'Digite uma opção';
    newInput.maxLength = 50;

    // Adicionando o novo node ao choicesDiv
    choicesDiv.appendChild(newInput);
    choicesCount++;
  }
});
