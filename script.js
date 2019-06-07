const call = async () => {
  const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2")
  console.log(response);
}
call();