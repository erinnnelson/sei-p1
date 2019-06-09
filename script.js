const deckSize = 20
const playingCards = `AS,AC,KH,KD,QS,QC,JH,JD,0S,0C,9H,9D,7S,7C,5H,5D,3S,3C,2H,2D`
const deckCall = `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${playingCards}`
const drawCall = `https://deckofcardsapi.com/api/deck/`
const drawNumber = `/draw/?count=${deckSize}`

const getDeck = async () => {
  const deck = await axios.get(deckCall)
  let deckShuffled = deck.data.shuffled;
  // if (deckShuffled = false) {
  //   return;
  // }
  let deckId = deck.data.deck_id;
  let card = await axios.get(drawCall + deckId + drawNumber);
  console.log(card)
}
getDeck();
