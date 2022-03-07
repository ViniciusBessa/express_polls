const choicesDiv = document.getElementById('choices');
let choicesCount = 3;

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
    newInput.maxLength = 100;
    newInput.required = true;

    // Adicionando o novo node ao choicesDiv
    choicesDiv.appendChild(newInput);
    choicesCount++;
  }
});
