const cards = document.querySelectorAll('.memory-card');
const time = document.getElementById('time');
const flipCount = document.getElementById('flip-count');
const alertCont = document.querySelector('.alert-container');
const alertText = document.querySelector('.alert-text');
const playAgainButton = document.querySelector('.play-again');
const closeAlertButton = document.querySelector('.close-alert');


let hasFlippedCard = false;
let flippedVeryFirstCard = false;
let lockBoard = false;
let firstCard, secondCard;
let allCardFlipped = true;
let images;
let currentTime = 60,
    currentFlip = 0,
    timeInterval;

(function getImages() {
    fetch('../image.json')
        .then(response => response.json())
        .then(data => {
            images = data;
            shuffleImages();
            setCards();
            shuffleCard();
        });
})();

function setCards() {
    for (i = 0; i < cards.length; i += 2) {
        cards[i].dataset.image = images[i].name;
        cards[i + 1].dataset.image = images[i].name;

        setImages(cards[i], images[i]);
        setImages(cards[i + 1], images[i]);
    }
}

function setImages(card, imageObj) {
    let image = card.querySelector('.card-front');
    image.src = `./img/${imageObj.fileName}`;
    image.alt = imageObj.name;
}


function shuffleImages() {
    for (let i = images.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = images[i];
        images[i] = images[j];
        images[j] = temp;
    }
}

function startTimer() {
    timeInterval = setInterval(() => {
        if (currentTime > 0) {
            updateTime();
        } else {
            gameFinish('Lose');
        }
    }, 1000);
}

function updateTime() {
    currentTime--;
    time.innerHTML = currentTime;
}

function flipCard() {
    if (!flippedVeryFirstCard) {
        startTimer();
        flippedVeryFirstCard = true;
    }

    if (lockBoard) return;

    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        currentFlip++;
        flipCount.innerHTML = currentFlip;
        return;
    }
    secondCard = this;
    currentFlip++;
    flipCount.innerHTML = currentFlip;
    matchCard()

    checkAllCardFlipped();
    if (allCardFlipped) {
        gameFinish('Win');
    }

    allCardFlipped = true;
}

function matchCard() {
    if (firstCard.dataset.image === secondCard.dataset.image) {
        disableCard();
    } else {
        unflipCard();
    }
}

function disableCard() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCard() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000)
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffleCard() {
    cards.forEach(card => {
        let randomNum = Math.floor(Math.random() * 12);
        card.style.order = randomNum;
    })
};

function gameFinish(condition) {
    alertCont.classList.add('fade-in');
    alertText.innerHTML = `You ${condition}!`
    alertText.className = `alert-text text-${condition.toLowerCase()}`;
    clearInterval(timeInterval);
}

function checkAllCardFlipped() {
    cards.forEach(card => {
        if (!card.classList.contains('flip')) {
            allCardFlipped = false;
        }
    })
}

function playAgain() {
    location.reload();
}

function closeAlert() {
    alertCont.classList.remove('fade-in');
}



cards.forEach(card => card.addEventListener('click', flipCard));

playAgainButton.addEventListener('click', playAgain);

closeAlertButton.addEventListener('click', closeAlert)