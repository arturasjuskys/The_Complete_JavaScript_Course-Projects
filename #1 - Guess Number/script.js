'use strict';

/*
console.log(document.querySelector('.message').textContent);
document.querySelector('.message').textContent = 'Correct Guess!';
console.log(document.querySelector('.message').textContent);

document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 100;

document.querySelector('.guess').value = 23;
console.log(document.querySelector('.guess').value);
*/

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess, typeof guess);

  // When player GUESS NOTHING
  if (!guess) {
    //document.querySelector('.message').textContent = 'No Number!';
    displayMessage('No Number!');

    // When player is WINNER
  } else if (guess === secretNumber) {
    //document.querySelector('.message').textContent = 'Correct Number!';
    displayMessage('Correct Number');
    document.querySelector('.number').textContent = secretNumber;
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    // When player guess WRONG
  } else if (guess !== secretNumber) {
    if (score > 1) {
      //document.querySelector('.message').textContent = guess > secretNumber ? 'Too High' : 'Too Low';
      displayMessage(guess > secretNumber ? 'Too High' : 'To Low');
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      //document.querySelector('.message').textContent = 'You lost the game';
      displayMessage('You Lost the Game');
      document.querySelector('.score').textContent = 0;
    }
  }
  /*
    else if (guess > secretNumber) {
        if (score > 1) {
            document.querySelector('.message').textContent = 'Too High';
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            document.querySelector('.message').textContent = 'You lost the game';
            document.querySelector('.score').textContent = 0;
        }
    } else if (guess < secretNumber) {
        if (score > 1) {
            document.querySelector('.message').textContent = 'Too Low';
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            document.querySelector('.message').textContent = 'You lost the game';
            document.querySelector('.score').textContent = 0;
        }
    }*/
});

/*
    Coding Challenge #1
        Implement a game rest functionality, so that the player can make a new guess!

Your tasks:
    1. Select the element with the 'again' class and attach a click event handler
    2. In the handler function, restore initial values of the 'score' and 'secretNumber' variables
    3. Restore the initial conditions of the message, number, score and guess input fields
    4. Also restore the original background color (#222) and number width (15rem)
*/

// 1.
document.querySelector('.again').addEventListener('click', function () {
  // 2.
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  // 3.
  //document.querySelector('.message').textContent = 'Start guessing...';
  displayMessage('Start guessing...');
  document.querySelector('.number').textContent = '?';
  document.querySelector('.score').textContent = score;
  document.querySelector('.guess').value = '';

  // 4.
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});
