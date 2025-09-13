const burger = document.querySelector('.header__mobile--menu');
const nav = document.querySelector('.header__nav');
const body = document.body;

burger.addEventListener('click', e => {
  e.stopPropagation();
  nav.classList.toggle('active');
  body.classList.toggle('no-scroll');
});

document.addEventListener('click', e => {
  if (nav.classList.contains('active') && !nav.contains(e.target)) {
    nav.classList.remove('active');
    body.classList.remove('no-scroll')
  } 
});