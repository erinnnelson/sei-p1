// HTML elements
const cardPlacers = document.querySelectorAll('.card-placer');
const startButton = document.querySelector('#start');
const newGameButton = document.querySelector('#new-game');
const scoreBox = document.querySelector('#score-box');
const matchCount = document.querySelector('#match-count');
const strikeCount = document.querySelector('#strike-count');
const possibleMatches = document.querySelector('#possible-matches');
const endText = document.querySelector('#end-text');

// Determining which cards are in the deck
const playingCards = `AS,AC,KH,KD,QS,QC,JH,JD,0S,0C,9H,9D,7S,7C,5H,5D,3S,3C,2H,2D`;
const deckColors = ['assets/card_blue3.png', 'assets/card_red3.png', 'assets/card_black3.png']
let randomColor;
let deckColorChange = () => {
  randomColor = Math.floor(Math.random() * (deckColors.length));
};
let deckColor = () => {
    return deckColors[randomColor];
};

// API stuff
const apiCall = `https://deckofcardsapi.com/api/deck/`;
const callNewDeck = `new/shuffle/?cards=`
const deckCall = apiCall + callNewDeck + playingCards;
const drawNumber = `/draw/?count=20`;

// Variable declarations
let playerScore;
let playerStrikes;
let gameHasEnded;
let cardsInPlay;

// Updates player's status
const displayScore = () => {
  matchCount.innerText = playerScore;
};
const displayStrikes = () => {
  strikeCount.innerText = playerStrikes;
};

// Resets everything for a new game
const reset = () => {
  gameHasEnded = false;
  playerScore = 0;
  displayScore();
  playerStrikes = 9;
  displayStrikes();
  cardsInPlay = 0;
  deckColorChange();
  endText.style.display = 'none';
  cardPlacers.forEach((card) => {
    card.firstElementChild.innerHTML = ''
    card.firstElementChild.classList.remove('fixed', 'shown', 'matched');
    card.firstElementChild.style.transform = ''
  })
};


// Functions for freezing/unfreezing all cards on the board so they cannot be selected/flipped
const freezeCards = () => {
  cardPlacers.forEach((card) => {
    card.firstElementChild.classList.add('fixed');
  })
};
const unfreezeCards = () => {
  cardPlacers.forEach((card) => {
    card.firstElementChild.classList.remove('fixed');
  })
};

// Functions for card flipping
const showCard = (cardFlipper) => {
  cardFlipper.style.transform = 'rotateY(-180deg)';
};
const hideCard = (cardFlipper) => {
  cardFlipper.style.transform = '';
}

// specifically for failed game: reveal all remaining cards
const endReveal = () => {
  cardPlacers.forEach((card) => {
    if (!card.firstElementChild.classList.contains('shown')) {
      setTimeout(() => {
        showCard(card.firstElementChild);
      }, 1000);
    }
  })
};

// enacting end-game activity
const winProtocol = () => {
  endText.style.webkitTextStroke = '3px lightgreen'
  endText.innerText = "YOU WIN";
  endText.style.display = 'inline-block';
  console.log('you win!');
};
const loseProtocol = () => {
  endText.style.webkitTextStroke = '3px red'
  endText.innerText = "GAME OVER";
  endText.style.display = 'inline-block';
  console.log('game over');
  endReveal();
};

// check to see if game ends
const cardsMatch = (cardFlipper1, cardFlipper2) => {
  cardFlipper1.classList.add('matched');
  cardFlipper2.classList.add('matched');
  cardFlipper1.lastElementChild.firstElementChild.style.borderColor = 'lightgreen';
  cardFlipper2.lastElementChild.firstElementChild.style.borderColor = 'lightgreen';
  console.log('match!')
  if (playerScore >= 10) {
    winProtocol();
  }
}
const cardsMismatch = (cardDiv1, cardDiv2) => {
  freezeCards();
  cardDiv1.lastElementChild.firstElementChild.style.borderColor = 'red';
  cardDiv2.lastElementChild.firstElementChild.style.borderColor = 'red';
  console.log(`strike ${playerStrikes}`)
  if (playerStrikes >= 10) {
    loseProtocol();
  } else {
    setTimeout(function () {
      hideCard(cardDiv1);
      hideCard(cardDiv2);
      cardDiv1.lastElementChild.firstElementChild.style.borderColor = 'black';
      cardDiv2.lastElementChild.firstElementChild.style.borderColor = 'black';
      unfreezeCards();
    }, 1000);
  }
};

// Evaluates two cards to determine if equal
const checkMatch = (card1, card2, cardFlipper1, cardFlipper2) => {
  if (card1.value === card2.value) {
    playerScore += 1;
    displayScore();
    cardsMatch(cardFlipper1, cardFlipper2);
  } else {
    playerStrikes += 1
    displayStrikes();
    cardsMismatch(cardFlipper1, cardFlipper2);
  }
};

// Evaluates whether a card can be flipped over and decides how to proceed
let inspectCard = (card, cardFlipper) => {
  if (cardFlipper.classList.contains('matched') || cardFlipper.classList.contains('fixed')) {
    return;
  }
  if (cardsInPlay === 0) {
    card1 = card;
    cardFlipper.lastElementChild.firstElementChild.style.borderColor = 'yellow';
    showCard(cardFlipper);
    prevCardFlipper = cardFlipper;
    console.log(card1.code);
    cardsInPlay = 1;
  } else {
    card2 = card;
    if (card1.code === card2.code) {
      return;
    }
    showCard(cardFlipper);
    console.log(card2.code);
    checkMatch(card1, card2, prevCardFlipper, cardFlipper);
    cardsInPlay = 0;
  }
}

//Resets the game, shuffles the deck and deals the cards. Listens for card click.
const buildBoard = async (deck) => {
  reset();
  let deckId = deck.data.deck_id;
  await axios.get(apiCall + deckId + "/shuffle/");
  let cardDrawCall = await axios.get(apiCall + deckId + drawNumber);
  let cards = cardDrawCall.data.cards;
  cards.forEach((card, i) => {
    let cardBack = document.createElement('div');
    cardBack.innerHTML = `<img src="${deckColor()}" alt="Unknown Card">`
    cardBack.classList.add('card-backs');
    let cardFront = document.createElement('div');
    cardFront.innerHTML = `<img src="${card.image}" alt="${card.value} OF ${card.suit}">`
    cardFront.classList.add('card-fronts')
    let cardFlipper = cardPlacers[i].firstElementChild;
    cardFlipper.append(cardBack);
    cardFlipper.append(cardFront);
    cardBack.addEventListener('click', () => {
      inspectCard(card, cardFlipper);
    })
  })
}


// Initial call to the API for first and additional board building.
const getDeck = async () => {
  const deck = await axios.get(deckCall);
  // buildBoard(deck);
  buildBoard(deck);
  startButton.style.display = 'none';
  newGameButton.style.display = 'block';
  scoreBox.style.display = 'block';
  newGameButton.addEventListener('click', () => {
    buildBoard(deck);
  });
};

startButton.addEventListener('click', getDeck);