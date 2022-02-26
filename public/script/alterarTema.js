function mudarTema() {
  if (localStorage.theme == 'dark') {
    colocarTema('light');
  } else {
    colocarTema('dark');
  }
}

function colocarTema(nomeTema) {
  const html = document.documentElement;

  if (nomeTema == 'light') {
    html.className = 'theme-light';
    localStorage.theme = 'light';
  } else {
    html.className = 'theme-dark';
    localStorage.theme = 'dark';
  }
}

colocarTema(localStorage.theme);
