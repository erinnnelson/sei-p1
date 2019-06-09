// HTML elements
const gameBoard = document.querySelector('.game-board');
const startButton = document.querySelector('button');

// Cards used for the deck are specified here.
// --NEED CODE FOR RANDOMIZING ? --
const playingCards = `AS,AC,KH,KD,QS,QC,JH,JD,0S,0C,9H,9D,7S,7C,5H,5D,3S,3C,2H,2D`;
const deckColors = ['assets/card_blue2.png', 'assets/card_red2.png', 'assets/card_black2.png']

let colorAdvance = 0

let deckColor = () => {
  if (colorAdvance === 0) {
    return deckColors[0];
  }
  if (colorAdvance === 1) {
    return deckColors[1];
  }
  if (colorAdvance === 2) {
    return deckColors[2];
  }
};

// API stuff
const apiCall = `https://deckofcardsapi.com/api/deck/`;
const callNewDeck = `new/shuffle/?cards=`
const deckCall = apiCall + callNewDeck + playingCards;
const drawNumber = `/draw/?count=20`;


// Functions for flipping cards front or back
let showCard = (cardDiv) => {
  cardDiv.firstElementChild.style.display = 'none';
  cardDiv.firstElementChild.nextElementSibling.style.display = '';
};

let hideCard = (cardDiv) => {
  cardDiv.firstElementChild.style.display = '';
  cardDiv.firstElementChild.nextElementSibling.style.display = 'none';
}

// Function that checks two selected cards to see if they are equal
// If they are not equal the cards flip back around
// --NEED CODE TO HIDE CARDS IF USER CLICKS A NEW CARD BEFORE THE PREVIOUS CARDS HIDE THEMSELVES--
const checkCards = (card1, card2, div1, div2) => {
  if (card1.value === card2.value) {
    console.log('match!')
    div1.className = 'fixed';
    div2.className = 'fixed';
    console.log(div1);
    console.log(div2);

  } else {
    console.log('try again, idiot');
    setTimeout(function () {
      hideCard(div1);
      hideCard(div2);
    }, 1500);
  }

};

// Function that shuffles and builds the playing board. shows cards when clicked.
const buildBoard = async (deck) => {
  gameBoard.innerHTML = ``;
  let deckId = deck.data.deck_id;
  let shuffledDeck = await axios.get(apiCall + deckId + "/shuffle/");
  let cardDrawCall = await axios.get(apiCall + deckId + drawNumber);
  console.log(deckId);
  let cards = cardDrawCall.data.cards;
  // console.log(cards);
  let cardsInPlay = 0;
  let initialCardHolder;
  cards.forEach((card, i) => {
    let cardValue = card.value;
    let cardImage = card.image;
    let cardSuit = card.suit;
    let cardHolder = document.createElement('div');
    cardHolder.innerHTML = `
    <img class="card-backs" src="${deckColor()}" alt="Unknown card">
    <img style="display: none;" id="card${i + 1}" class="cards" src="${cardImage}" alt="${cardValue} OF ${cardSuit}">
    `
    gameBoard.append(cardHolder);
    cardHolder.addEventListener('click', () => {
      // looked up some code from https://stackoverflow.com/questions/5898656/check-if-an-element-contains-a-class-in-javascript
      // This if statement checks to see if the card is already part of a match
      if (cardHolder.classList.contains('fixed')) {
        return;
      }
      if (cardsInPlay === 0) {
        card1 = card;
        showCard(cardHolder);
        console.log(cardHolder.firstElementChild);
        initialCardHolder = cardHolder;
        console.log(card.code);
        cardsInPlay = 1;
      } else {
        card2 = card;
        if (card1.code === card2.code) {
          return;
        }
        showCard(cardHolder);
        console.log(card.code);
        checkCards(card1, card2, initialCardHolder, cardHolder);
        cardsInPlay = 0;
      }

    })

  })
  if (colorAdvance === 2) {
    colorAdvance = 0;
  } else {
    colorAdvance += 1;
  }
}


// Initial call to the API for first and additional board building.
const getDeck = async () => {
  const deck = await axios.get(deckCall);
  buildBoard(deck);
  startButton.addEventListener('click', () => {
    buildBoard(deck);
  });
};

getDeck();
