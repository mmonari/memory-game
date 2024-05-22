const cards = document.querySelectorAll(".card");
const homeScreen = document.querySelector(".home-screen");
const gameScreen = document.querySelector(".game-screen");
const timeoutScreen = document.querySelector(".timeout-screen");
const winScreen = document.querySelector(".win-screen");
const startGameBtn = document.getElementById("start-game-btn");
const restartBtn = document.querySelectorAll("#restart-btn, #restart-btn-win");
const homeBtn = document.querySelectorAll("#home-btn, #home-btn-win");
const timerDisplay = document.getElementById("timer");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = true;
let countdown;
let timeLeft = 60;

startGameBtn.addEventListener("click", startGame);
restartBtn.forEach(btn => btn.addEventListener("click", restartGame));
homeBtn.forEach(btn => btn.addEventListener("click", goHome));

function startGame() {
    homeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    matched = 0;
    timeLeft = 20;
    timerDisplay.textContent = timeLeft;
    disableDeck = true;
    shuffleCard();
    setTimeout(flipAllCards, 0);
    setTimeout(startCountdown, 5000);
}

function restartGame() {
    timeoutScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    startGame();
}

function goHome() {
    timeoutScreen.classList.add("hidden");
    winScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    clearInterval(countdown);
}

function flipAllCards() {
    cards.forEach(card => card.classList.add("flip"));
    setTimeout(() => {
        cards.forEach(card => card.classList.remove("flip"));
        disableDeck = false;
    }, 5000);
}

function startCountdown() {
    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame(false);
        }
    }, 1000);
}

function endGame(isWin) {
    disableDeck = true;
    gameScreen.classList.add("hidden");
    if (isWin) {
        winScreen.classList.remove("hidden");
    } else {
        timeoutScreen.classList.remove("hidden");
    }
}

function flipCard({target: clickedCard}) {
    if(cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");
        if(!cardOne) {
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        let cardOneImg = cardOne.querySelector(".back-view img").src,
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if(img1 === img2) {
        matched++;
        if(matched === 4) {
            clearInterval(countdown);
            setTimeout(() => {
                endGame(true);
            }, 500);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    matched = 0;
    cardOne = cardTwo = "";
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${arr[i]}.png`;
        card.addEventListener("click", flipCard);
    });
}

shuffleCard();

