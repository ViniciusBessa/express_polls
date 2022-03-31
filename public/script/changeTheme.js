function changeTheme() {
  if (localStorage.theme == 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

function setTheme(themeName) {
  const html = document.documentElement;

  if (themeName == 'light') {
    html.className = 'theme-light';
    localStorage.theme = 'light';
  } else {
    html.className = 'theme-dark';
    localStorage.theme = 'dark';
  }
}

setTheme(localStorage.theme);
