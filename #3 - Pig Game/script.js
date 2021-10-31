'use strict';



// Selecting elements
const player0Element = document.querySelector('.player--0');
const player1Element = document.querySelector('.player--1');
const score0Element = document.getElementById('score--0');
const score1Element = document.getElementById('score--1');
const current0Element = document.getElementById('current--0');
const current1Element = document.getElementById('current--1');


const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, playing;



// starting conditions


const switchPlayer = function() {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    currentScore = 0;
    player0Element.classList.toggle('player--active');
    player1Element.classList.toggle('player--active');
};
const init = function() {
    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    current0Element.textContent = 0;
    current1Element.textContent = 0;
    score0Element.textContent = 0;
    score1Element.textContent = 0;

    player0Element.classList.add('player--active');
    player1Element.classList.remove('player--active');
    player0Element.classList.remove('player--winner');
    player1Element.classList.remove('player--winner');
    diceElement.classList.add('hidden');    
};

init();

// Rolling dine functionality
btnRoll.addEventListener('click', function() {
    if (playing) {
        // 1. Generate a random number
        const dice = Math.trunc(Math.random() * 6) + 1;
    
        // 2. Display dice
        diceElement.classList.remove('hidden');
        diceElement.src = `dice-${dice}.png`;
    
        // 3. Check for ralled 1
        if (dice !== 1) {
            // add dice to current score
            currentScore += dice;
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    
            
    
        } else {
            // switch to next player
            switchPlayer();
        };
    };
});

btnHold.addEventListener('click', function() {
    if (playing) {
        // 1. Add current score to active player's score
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];
    
        // 2. check if player's score is >= 100
        // finish
        if (scores[activePlayer] >= 20) {
            playing = false;
            diceElement.classList.add('hidden');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
        } else {
            switchPlayer();
        };
    };
});

btnNew.addEventListener('click', init);







