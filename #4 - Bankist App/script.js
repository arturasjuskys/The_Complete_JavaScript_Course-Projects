'use strict;';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-11-23T14:11:59.604Z',
        '2020-11-24T17:01:17.194Z',
        '2020-11-25T23:36:17.929Z',
        '2020-11-26T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];
console.log(accounts);

//////////////////////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date);
    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        // const day = `${date.getDate()}`.padStart(2, '0');
        // const month = `${date.getMonth() + 1}`.padStart(2, '0');
        // const year = date.getFullYear();
        // // day.month.year
        // return `${day}.${month}.${year}`;
        return new Intl.DateTimeFormat(locale).format(date);
    }
};

const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const displayMovements = function (acc, sort = false) {
    // empty the container before inseting our data
    containerMovements.innerHTML = '';

    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movs.forEach(function (mov, i) {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);
        const html = `
            <div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">${formatCur(mov, acc.locale, acc.currency)}</div>
            </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce((accumulator, mov) => (accumulator += mov), 0);
    labelBalance.textContent = formatCur(account.balance, account.locale, account.currency);
};
const calcDisplaySummary = function (account) {
    const balanceIn = account.movements.filter((val) => val > 0).reduce((acc, val) => acc + val, 0);
    const balanceOut = account.movements
        .filter((val) => val < 0)
        .reduce((acc, val) => acc + val, 0);
    const balanceInterest = account.movements
        .filter((val) => val > 0)
        .map((val) => (val * account.interestRate) / 100)
        .filter((interest, i, arr) => {
            // interests over 1 will be added
            // console.log(arr);
            return interest >= 1;
        })
        .reduce((acc, val) => acc + val, 0);

    // labelSumIn.textContent = balanceIn.toFixed(2);
    // labelSumOut.textContent = Math.abs(balanceOut).toFixed(2);
    // labelSumInterest.textContent = balanceInterest.toFixed(2);
    labelSumIn.textContent = formatCur(balanceIn, account.locale, account.currency);
    labelSumOut.textContent = formatCur(Math.abs(balanceOut), account.locale, account.currency);
    labelSumInterest.textContent = formatCur(balanceInterest, account.locale, account.currency);
};
const updateUI = function (account) {
    // Display Movements
    displayMovements(account);

    // Display Balance
    calcDisplayBalance(account);

    // Display Summary
    calcDisplaySummary(account);
};

const createUsername = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map((name) => name[0])
            .join('');
    });
};
createUsername(accounts);

const startLogOutTimer = function () {
    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);

        // In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        // When 0 seconds, stop timer and logout user
        if (time === 0) {
            clearInterval(timer);
            containerApp.style.opacity = 0;
            labelWelcome.textContent = 'Log in to get started';
        }
        // Decrease 1 sec
        time--;
    };
    // Set time to 5 minutes

    let time = 120;

    // Call the timer every second
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};

/////////////////////////////////////////////////////////////////////////////////
// Event Handlers
let currentAccount, timer;

// FAKE ALWAYS LOGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting with API
const now = new Date();
labelDate.textContent = new Intl.DateTimeFormat('en-US').format(now);

btnLogin.addEventListener('click', function (event) {
    // This will prevent default form submit reload after click or Enter press
    event.preventDefault();
    currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value);
    console.log(currentAccount);

    // ?. - optional chaining, checks if account exists
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Display UI & Welcome Message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // Create current date and time
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            // weekday: 'long',
        };
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

        /*
        const now = new Date();
        const day = `${now.getDate()}`.padStart(2, '0');
        const month = `${now.getMonth() + 1}`.padStart(2, '0');
        const year = now.getFullYear();
        // day.month.year
        labelDate.textContent = `${day}.${month}.${year}, `;*/

        // Clear Input Fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // Timer reset
        if (timer) clearInterval(timer);
        timer = startLogOutTimer();

        // Update UI
        updateUI(currentAccount);
    }
});
btnTransfer.addEventListener('click', function (event) {
    event.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find((acc) => acc.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';

    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance > amount &&
        receiverAcc?.username !== currentAccount.username
    ) {
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);

        // Timer reset
        clearInterval(timer);
        timer = startLogOutTimer();
    }
});
btnLoan.addEventListener('click', function (event) {
    event.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && amount > currentAccount.movements.some((val) => val >= amount * 0.1)) {
        setTimeout(function () {
            currentAccount.movements.push(amount);
            // Add loan date
            currentAccount.movementsDates.push(new Date().toISOString());
            updateUI(currentAccount);
        }, 3000);
    }
    inputLoanAmount.value = '';
    inputLoanAmount.blur();

    // Timer reset
    clearInterval(timer);
    timer = startLogOutTimer();
});
btnClose.addEventListener('click', function (event) {
    event.preventDefault();
    // Check credentials
    const index = accounts.findIndex((acc) => acc.username === currentAccount.username);
    if (
        currentAccount.username === inputCloseUsername.value &&
        currentAccount.pin === Number(inputClosePin.value)
    ) {
        // Delete User
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
    }

    // Clear Input Fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
});

// preserves sort on/of
let sorted = false;
btnSort.addEventListener('click', function (event) {
    event.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    // flips sort on/of
    sorted = !sorted;
});
