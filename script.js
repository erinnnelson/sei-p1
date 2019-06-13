// HTML elements
const cardPlacers = document.querySelectorAll('.card-placer');
const startButton = document.querySelector('#start');
const newGameButton = document.querySelector('#new-game');
const scoreBox = document.querySelector('#score-box');
const strikeCount = document.querySelector('#strike-count');
const strikeLast = document.querySelector('#strike-last');
const strikeBest = document.querySelector('#strike-best');
const winCount = document.querySelector('#win-count');
const endText = document.querySelector('#end-text');

// Determine which cards are in the deck
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
let prevStrikes;
let lowestStrikes;
let totalWins;
let cardsInPlay;
let gameWon;

// Update score counters
const displayScore = (htmlElement, score) => {
  htmlElement.innerText = score;
};

const updateWins = () => {
  if (!totalWins) {
    if (localStorage.getItem('totalWins')) {
      totalWins = localStorage.getItem('totalWins');
    } else {
      totalWins = 0;
    }
    displayScore(winCount, totalWins);
  }
};

const updateLowestStrikes = () => {
  if (gameWon && playerStrikes < lowestStrikes || gameWon && !lowestStrikes) {
    lowestStrikes = playerStrikes;
    localStorage.setItem('lowestStrikes', lowestStrikes);
    displayScore(strikeBest, lowestStrikes);
  } else if (lowestStrikes === 0) {
  } else if (!lowestStrikes) {
    if (localStorage.getItem('lowestStrikes')) {
      lowestStrikes = localStorage.getItem('lowestStrikes');
      console.log(lowestStrikes);
      displayScore(strikeBest, lowestStrikes);
    } else {
      strikeBest.innerText = '-';
    }
  }
};

const updatePrevStrikes = () => {
  if (prevStrikes || prevStrikes === 0) {
    prevStrikes = playerStrikes;
    localStorage.setItem('prevStrikes', prevStrikes);
    displayScore(strikeLast, prevStrikes);
  } else {
    if (localStorage.getItem('prevStrikes')) {
      prevStrikes = localStorage.getItem('prevStrikes');
      displayScore(strikeLast, prevStrikes);
    } else {
      strikeLast.innerText = '-';
      prevStrikes = 0;
      localStorage.setItem('prevStrikes', prevStrikes);
    }
  }
};

// Prepare for new game
const reset = () => {
  updateWins();
  updateLowestStrikes();
  updatePrevStrikes();
  playerScore = 0;
  playerStrikes = 0;
  displayScore(strikeCount, playerStrikes);
  cardsInPlay = 0;
  deckColorChange();
  gameWon = false;
  endText.style.display = 'none';
  cardPlacers.forEach((card) => {
    card.firstElementChild.innerHTML = ''
    card.firstElementChild.classList.remove('fixed', 'shown', 'matched');
    card.firstElementChild.style.transform = ''
  })
};

// Render card selection inactive
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

// Trigger card flipping animations
const showCard = (cardFlipper) => {
  cardFlipper.style.transform = 'rotateY(-180deg)';
};
const hideCard = (cardFlipper) => {
  cardFlipper.style.transform = '';
};

// End game stuff
const winProtocol = () => {
  endText.style.webkitTextStroke = '3px lightgreen'
  endText.innerText = "YOU WIN";
  endText.style.display = 'inline-block';
  totalWins = Number(totalWins) + 1;
  localStorage.setItem('totalWins', totalWins);
  displayScore(winCount, totalWins);
  gameWon = true;
  updateLowestStrikes();
  console.log('you win!');
};

// Evaluate two card values
const cardsMatch = (cardFlipper1, cardFlipper2) => {
  cardFlipper1.classList.add('matched');
  cardFlipper2.classList.add('matched');
  cardFlipper1.lastElementChild.firstElementChild.style.borderColor = 'lightgreen';
  cardFlipper2.lastElementChild.firstElementChild.style.borderColor = 'lightgreen';
  console.log('match!')
  playerScore += 1;
  if (playerScore >= 10) {
    winProtocol();
  }
};

const cardsMismatch = (cardDiv1, cardDiv2) => {
  freezeCards();
  cardDiv1.lastElementChild.firstElementChild.style.borderColor = 'red';
  cardDiv2.lastElementChild.firstElementChild.style.borderColor = 'red';
  console.log(`strike ${playerStrikes}`)
  playerStrikes += 1
  displayScore(strikeCount, playerStrikes);
  setTimeout(function () {
    hideCard(cardDiv1);
    hideCard(cardDiv2);
    cardDiv1.lastElementChild.firstElementChild.style.borderColor = 'black';
    cardDiv2.lastElementChild.firstElementChild.style.borderColor = 'black';
    unfreezeCards();
  }, 1000);
};

const checkMatch = (card1, card2, cardFlipper1, cardFlipper2) => {
  if (card1.value === card2.value) {
    cardsMatch(cardFlipper1, cardFlipper2);
  } else {
    cardsMismatch(cardFlipper1, cardFlipper2);
  }
};

const inspectCard = (card, cardFlipper) => {
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
    // checks if 2nd selected selected card is the same as the 1st
    if (card1.code === card2.code) {
      return;
    }
    showCard(cardFlipper);
    console.log(card2.code);
    checkMatch(card1, card2, prevCardFlipper, cardFlipper);
    cardsInPlay = 0;
  }
};

//Build the deck and listen for interaction
const buildBoard = async (deck) => {
  reset();
  let deckId = deck.data.deck_id;
  // console.log(deckId);
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
  let deck = await axios.get(deckCall);
  buildBoard(deck);
  startButton.style.display = 'none';
  scoreBox.style.display = 'grid'
  newGameButton.addEventListener('click', () => {
    buildBoard(deck);
  });
};

// first interaction
startButton.addEventListener('click', getDeck);

// toggle
// localStorage.clear()