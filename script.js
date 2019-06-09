const playingCards = `AS,AC,KH,KD,QS,QC,JH,JD,0S,0C,9H,9D,7S,7C,5H,5D,3S,3C,2H,2D`;
const deckCall = `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${playingCards}`;
const drawCall = `https://deckofcardsapi.com/api/deck/`;
const drawNumber = `/draw/?count=20`;
const gameBoard = document.querySelector('.game-board');
const startButton = document.querySelector('button');

const checkCards = (card1, card2) => {
  if (card1 === card2) {
    console.log('match!')
  } else console.log('try again');
}

const buildBoard = async (deck) => {
  gameBoard.innerHTML = ``;
  let deckId = deck.data.deck_id;
  // let shuffledDeck = await axios.get(drawCall + deckId + "shuffle");
  let cardDrawCall = await axios.get(drawCall + deckId + drawNumber);
  let cards = cardDrawCall.data.cards;
  console.log(cards);
  let cardsInPlay = 0;
  cards.forEach((card, i) => {
    let cardValue = card.value;
    let cardImage = card.image;
    let cardSuit = card.suit;
    let cardHolder = document.createElement('div');
    cardHolder.innerHTML = `
    <img id="card${i + 1}" class="cards" src="${cardImage}" alt="${cardValue} OF ${cardSuit}">
    `
    gameBoard.append(cardHolder);
    cardHolder.addEventListener('click', () => {
      if (cardsInPlay === 0) {
        card1 = card;
        console.log(card.code);
        cardsInPlay = 1;
      } else {
        card2 = card;
        if (card1.code === card2.code) {
          cardsInPlay = 0;
          return;
        }
        console.log(card.value)
        checkCards(card1.value, card2.value);
        cardsInPlay = 0;
      }

    })

  })
}

const getDeck = async () => {
  const deck = await axios.get(deckCall);
  buildBoard(deck);
}


// startButton.addEventListener('click', getDeck);
getDeck();
