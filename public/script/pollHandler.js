const pollForm = document.querySelector('.poll');
const choicesDOM = Array.from(document.getElementsByClassName('poll__container'));
const endPollButton = document.getElementById('end-poll-button');
const pollTotalVotes = document.getElementById('poll-total-votes');
const pollAlert = document.querySelector('.poll__alert');

pollForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(pollForm).entries());
  const url = window.location.href + '/choices' + `/${formData.choice}`;

  try {
    let data = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    data = await data.json();

    if (!data.success) {
      throw data.message;
    } else {
      pollAlert.innerText = 'Voto contado com sucesso!';
    }
  } catch (error) {
    pollAlert.innerText = error;
  }
  setTimeout(() => (pollAlert.innerText = ''), 5000);
});

async function getUpdatedChoices() {
  // Fazendo um request para receber os dados das escolhas da votação
  const url = window.location.href + '/choices';
  const choicesData = await fetch(url);
  const { choices } = await choicesData.json();

  // Calculando o número total de votos
  let totalVotes = 0;
  choices.forEach((choice) => (totalVotes += choice.number_of_votes));
  pollTotalVotes.innerText = `Total de votos: ${totalVotes}`;

  for (let index = 0; index < choices.length; index++) {
    const choice = choices[index];
    const choiceChildren = choicesDOM[index].children;
    const choiceVotesPercentage = choiceChildren[2];
    const choiceProgressBar = choiceChildren[1].children[1];

    // Atualizando a porcentagem de votos da escolha
    if (totalVotes > 0) {
      choiceVotesPercentage.innerText = Math.round((choice.number_of_votes / totalVotes) * 100) + '%';
      choiceProgressBar.style.width = Math.round((choice.number_of_votes / totalVotes) * 100) + '%';
    } else {
      choiceVotesPercentage.innerText = '0%';
      choiceProgressBar.style.width = '0%';
    }
  }
}

// Atualizando os dados da votação a cada 10 segundos
setInterval(() => getUpdatedChoices(), 10000);

endPollButton.addEventListener('click', async () => {
  const url = window.location.href;

  try {
    let data = await fetch(url, { method: 'PATCH' });
    data = await data.json();

    if (data.success) {
      document.location.reload();
    } else {
      throw data.message;
    }
  } catch (error) {
    pollAlert.innerText = error;
  }
});
