const deckSize = 20;
const playingCards = `AS,AC,KH,KD,QS,QC,JH,JD,0S,0C,9H,9D,7S,7C,5H,5D,3S,3C,2H,2D`;
const deckCall = `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${playingCards}`;
const drawCall = `https://deckofcardsapi.com/api/deck/`;
const drawNumber = `/draw/?count=${deckSize}`;
const gameBoard = document.querySelector('.game-board');

const buildBoard = async (deck) => {
  gameBoard.innerHTML = ``;
  let deckId = deck.data.deck_id;
  let cardDrawCall = await axios.get(drawCall + deckId + drawNumber);
  let cards = cardDrawCall.data.cards;
  cards.forEach((card, i) => {
    let cardValue = card.value;
    let cardImage = card.image;
    let cardSuit = card.suit;
    let cardHolder = document.createElement('div');
    cardHolder.innerHTML = `
    <img id="card${i}" class="cards" src="${cardImage}" alt="${cardValue} OF ${cardSuit}">
    `
    gameBoard.append(cardHolder);
    console.log(cardImage)
  })
  console.log(cards);
  console.log(deckId);
}

const getDeck = async () => {
  const deck = await axios.get(deckCall);
  let deckShuffled = deck.data.shuffled;
  // if (deckShuffled = false) {
  //   return;
  // }
  buildBoard(deck)
}
getDeck();
