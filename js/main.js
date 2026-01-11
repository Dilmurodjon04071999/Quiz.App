import { fetchCategories } from './api.js';
import { saveHighScore, getHighScores } from './storage.js';
import { UI } from './ui.js';
import { Game } from './game.js';

const game = new Game();

document.addEventListener('DOMContentLoaded', async () => {
    // Initial Load
    const categories = await fetchCategories();
    UI.populateCategories(categories);
    UI.renderHighScores(getHighScores());
    setupEventListeners();
});

function setupEventListeners() {
    UI.elements.startBtn.addEventListener('click', handleStart);
    UI.elements.nextBtn.addEventListener('click', handleNext);
    UI.elements.playAgainBtn.addEventListener('click', handleRestart);
    UI.elements.homeBtn.addEventListener('click', handleHome);
}

async function handleStart() {
    const name = UI.elements.usernameInput.value.trim();
    if (!name) {
        alert('Please enter your name!');
        return;
    }

    UI.elements.startBtn.disabled = true;
    UI.elements.startBtn.textContent = 'Loading...';

    game.setConfig(
        name,
        UI.elements.amountInput.value,
        UI.elements.categorySelect.value,
        UI.elements.difficultySelect.value,
        UI.elements.timerSelect.value
    );

    const success = await game.initGame();

    UI.elements.startBtn.disabled = false;
    UI.elements.startBtn.textContent = 'Start Quiz';

    if (success) {
        UI.showScreen('game-screen');
        startGameLoop();
    } else {
        alert('Could not load questions. Try different settings.');
    }
}

function startGameLoop() {
    loadQuestion();
}

function loadQuestion() {
    const question = game.getCurrentQuestion();
    UI.updateHUD(game.currentQuestionIndex, game.questions.length, game.score);
    
    // Reset timer
    game.timeLeft = game.config.timePerQuestion;
    UI.updateTimer(game.timeLeft, false);

    UI.renderQuestion(question, handleAnswerSelect);
    startTimer();
}

function startTimer() {
    clearInterval(game.timer);
    game.timer = setInterval(() => {
        game.timeLeft--;
        UI.updateTimer(game.timeLeft, game.timeLeft <= 3);

        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleAnswerSelect(e) {
    clearInterval(game.timer);
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    if (isCorrect) {
        game.addScore();
        UI.updateHUD(game.currentQuestionIndex, game.questions.length, game.score);
    }

    UI.revealAnswer(selectedBtn);
}

function handleTimeOut() {
    UI.revealAnswer(null); // Reveal without selection
}

function handleNext() {
    game.nextQuestion();
    if (!game.isGameOver()) {
        loadQuestion();
    } else {
        finishGame();
    }
}

function finishGame() {
    saveHighScore(game.score, game.userName);
    UI.showEndScreen(game.score, game.getMaxPossibleScore(), game.userName);
}

async function handleRestart() {
    UI.elements.playAgainBtn.disabled = true;
    UI.elements.playAgainBtn.textContent = 'Restarting...';

    // Reload with same config
    const success = await game.initGame();

    UI.elements.playAgainBtn.disabled = false;
    UI.elements.playAgainBtn.textContent = 'Play Again';

    if (success) {
        UI.showScreen('game-screen');
        startGameLoop();
    }
}

function handleHome() {
    UI.showScreen('start-screen');
    UI.renderHighScores(getHighScores());
}
