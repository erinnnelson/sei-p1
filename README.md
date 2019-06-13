# Unitled Card Matching Game

## -an incredible use of the Deck of Cards API, by Erinn Nelson

### **[Surge Site](https://http://cardmatch.surge.sh/ "Card Matching Game")**


### **Project Purpose:**

A card game that challenges the players to select cards and find the ones that match using their memory. It's a matching game. If all cards are matched correctly, the player wins and goes to Disney World.

### **Current Features:**

* Unknown cards animate to flip around and reveal thier face when clicked

* Game recognizes cards with identical values as matches. Suits don't matter.

* 10 matches wins the game

* Cards are shuffled randomly every new game

* Local storage tracks the number of wins, number strikes from the previous game, and all time lowest strikes

### **Planned Features:**

**Mechanics**

* Hint System- after five strikes, earn a free peek at one card

**Local Storage**

* Store the Deck ID so a new deck doesn't have to be created when the page reloads

* Welcome back returning players

* Button for resetting local storage

* Only start the strikes from previous game count after the first card has been flipped in a new game

**Format for Mobile**

* Reformat card layout

* Turn off over hover animations

**Animations**

* Dealing cards and removing cards

* Delayed and blinking card-status indicators, shake for incorrect matches

**Sounds**

* Card flip

* Card dealing

* Match

* Incorrect match

* Start button

* New game button

**Misc**

* Make strike tracker bigger and highlighted when strikes !== 0

* Create a nicer border for the body on laptop/desktop

* Give New Game button a z-index so that drop shadow is masked by the game board

* Update tracker for previous game strike count to show null if no cards were flipped

* Add Rules and About info text

**Problems**

* Figure out why the game board and score box are not centered with each other


### **Wireframes:**

<img src="wireframes/wireframe_main.gif" alt="wireframe" width="500"/>
<img src="wireframes/wireframe_mobile.jpg" alt="mobile wireframe" width="400"/>

### **Original Stretch Goals:**

**CSS Animations:** Gaze in wonderment as the deck comes to life on your screen! Behold the majesty of cards being dealt and also flipped over!

**JavaScript Local Storage:** Want to keep track of how many games you've won? Who wouldn't!? Maybe one day we can all live in that beautiful reality.