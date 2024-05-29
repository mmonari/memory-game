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


function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function startGame() {
    homeScreen.classList.add("hidden");
    homeScreen.classList.remove("flex");
    
    gameScreen.classList.remove("hidden");
    gameScreen.classList.add("flex");

    matched = 0;
    timeLeft = 60;
    timerDisplay.textContent = formatTime(timeLeft);
    disableDeck = true;
    shuffleCard();
    setTimeout(flipAllCards, 0);
    setTimeout(startCountdown, 5000);
    
}

function restartGame() {
    timeoutScreen.classList.add("hidden");
    timeoutScreen.classList.remove("flex");

    winScreen.classList.add("hidden");
    winScreen.classList.remove("flex");
    startGame();
}

function goHome() {
    timeoutScreen.classList.add("hidden");
    timeoutScreen.classList.remove("flex");
    winScreen.classList.add("hidden");
    winScreen.classList.remove("flex");
    gameScreen.classList.add("hidden");
    gameScreen.classList.remove("flex");
    homeScreen.classList.remove("hidden");
    homeScreen.classList.add("flex");
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
        timerDisplay.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame(false);
        }
    }, 1000);
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function endGame(isWin) {
    disableDeck = true;
    gameScreen.classList.add("hidden");
    gameScreen.classList.remove("flex");
    
    if (isWin) {
        winScreen.classList.remove("hidden");
        winScreen.classList.add("flex");
        explodeConfetti();
    } else {
        timeoutScreen.classList.remove("hidden");
        timeoutScreen.classList.add("flex");
        
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

function explodeConfetti() {
    const duration = 15 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
      
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
      
        const particleCount = 50 * (timeLeft / duration);
      
        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);
}

shuffleCard();





