/*
 * Create a list that holds all of your cards
 */
const cardClassesDeck = [
    "fas fa-heart",
    "fas fa-heart",
    "fas fa-star",
    "fas fa-star",
    "fas fa-anchor",
    "fas fa-anchor",
    "fas fa-bolt",
    "fas fa-bolt",
    "fas fa-cube",
    "fas fa-cube",
    "fas fa-leaf",
    "fas fa-leaf",
    "fas fa-bicycle",
    "fas fa-bicycle",
    "fas fa-bomb",
    "fas fa-bomb"
]

const deck = document.querySelector(".deck");

const restartCardGame = document.querySelector(".restart");

const secondsContainer = document.querySelector(".timer");

const stars = document.querySelectorAll(".fa-star");

const modal = document.querySelector(".modal");

const modalText = document.querySelector(".message");

const timeResults = document.querySelector('.time-on-modal');
const movesResults = document.querySelector('.moves-on-modal');
const startResults = document.querySelector('.rating-on-modal');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */ 
function setupCards() {
    shuffle(cardClassesDeck);

    let cards = ""
    for (const cardClass of cardClassesDeck) {

        const card = `
            <li class="card">
                <i class="${cardClass}"></i>
            </li>
        `
        cards += card;
    }
    deck.innerHTML = cards;
}

setupCards();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let toggleCards = [];
let matchedCards = [];
let moves = 0;
const noOfMoves = document.querySelector(".moves");
noOfMoves.innerHTML = 0;
let startTime;
let elapsedSeconds;
modal.style.display = "none";

/*
* function to add event listerner and 
*/
function activateCards() {
    const cardDeck = document.querySelectorAll(".card");
    cardDeck.forEach((card) => {
        card.addEventListener('click', (e) => {
            if(startTime === undefined) {
                startTime = Date.now();
            }
            if (e.target.classList.contains("card") && !e.target.classList.contains("match") && toggleCards.length < 2 && !toggleCards.includes(e.target)) {
                toggleCards.push(card);
                showCard(card);
            }
            if (toggleCards.length == 2) {
                checkForMatchingCards();
                addmoves();
            }
        });
    });
}

activateCards();
/*
* function to add no of moves
*/
function addmoves(){
    moves++;
    noOfMoves.innerHTML = moves;
    starRating();
}


/*
* function to check for matching cards. 
* - if the first card firstElementChild class name matches second card firstElementChild class name add 'match' class to both the cards
* - if the class names do not match, move the cards back to closed position
*/
function checkForMatchingCards() {
    if (toggleCards[0].firstElementChild.className === toggleCards[1].firstElementChild.className) {
        toggleCards[0].classList.add("match");
        toggleCards[1].classList.add("match");
        matchedCards.push(toggleCards[0], toggleCards[1]);
        toggleCards = [];
        if(matchedCards.length === 16){
            setTimeout(gameWon(), 1000);
            gameWon();
        }
    } else { setTimeout(() =>{
          showCard(toggleCards[0]);
          showCard(toggleCards[1]);
          toggleCards = [];
        }, 300);
    }

}

/*
* function to show card and add open and show classes to card
*/
function showCard(card) {
    card.classList.toggle("open");
    card.classList.toggle("show");
}

/*
* function for star rating
*/
function starRating() {
    if (moves > 8) {
        for (let i = 0; i < 3; i++) {
            if (i > 1) {
              stars[i].style.visibility = "hidden";
            }
        }
    }
    if (moves > 16) {
        for (let i = 0; i < 3; i++) {
            if (i > 0) {
              stars[i].style.visibility = "hidden";
            }
        }
    }
}

/*
* function to update time
*/
function updateTimer() {
    if (startTime === undefined) {
        secondsContainer.innerHTML = 0;
    }
    else {
        const now = Date.now();
        const elapsedTime = now - startTime;
        elapsedSeconds = Math.round(elapsedTime / 1000);
        secondsContainer.innerHTML = elapsedSeconds;
    }
}

let handle = setInterval(updateTimer,1000);

//Adding restart logic
restartCardGame.addEventListener("click", function() {
    deck.innerHTML = "";
    noOfMoves.innerHTML = 0;
    moves = 0;
    startTime = undefined;
    setupCards();
    activateCards();
    for (let i = 0; i < stars.length; i++) {
      stars[i].style.visibility = "visible";
    }
    updateTimer();
});


/*
* function for a finished game to show modal with all the information
*/
function gameWon(){
    const starNumber = document.querySelector(".stars").innerHTML;
    modal.style.display = "block";
    timeResults.innerHTML = elapsedSeconds;
    secondsContainer.innerHTML = elapsedSeconds;
    movesResults.innerHTML = moves+1;
    startResults.innerHTML = starNumber;
}

/*
* restart on modal
*/
const restartModal = document.querySelector('.restart-modal');
restartModal.addEventListener("click", function() {
    modal.style.display = "none";
    deck.innerHTML = "";
    noOfMoves.innerHTML = 0;
    moves = 0;
    startTime = undefined;
    setupCards();
    activateCards();
    secondsContainer.innerHTML = 0;
});
