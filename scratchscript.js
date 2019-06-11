let cardHolder = document.querySelector('.cardholder');
let cardFlipper = document.querySelector('.cardflipper');
let cardBack = document.querySelector('.cardback');
let cardFront = document.querySelector('.cardfront');


cardBack.addEventListener('click', () => {
  cardFlipper.style.transform = 'rotateY(180deg)';

})

cardFront.addEventListener('click', () => {
  cardHolder.style.transform = '';
  cardFlipper.style.transform = '';

})