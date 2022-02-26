const navToggler = document.querySelector('.navbar__toggler');
const navContainer = document.querySelector('.navbar__container');

navToggler.addEventListener('click', (event) => {
  navContainer.classList.toggle('collapsed');
});
