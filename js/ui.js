import { decodeHTML } from './utils.js'

// DOM Elements
const sections = document.querySelectorAll('.screen')
const categorySelect = document.getElementById('category')
const questionText = document.getElementById('question-text')
const questionCounterObj = document.getElementById('question-counter')
const scoreObj = document.getElementById('score')
const timerDisplay = document.getElementById('timer-display')
const optionsContainer = document.getElementById('options-container')
const nextBtn = document.getElementById('next-btn')
const endScreen = document.getElementById('end-screen')
const finalScoreObj = document.getElementById('final-score')
const endMessageObj = document.getElementById('end-message')
const highScoresList = document.getElementById('high-scores-list')

export const UI = {
	elements: {
		amountInput: document.getElementById('amount'),
		categorySelect: document.getElementById('category'),
		difficultySelect: document.getElementById('difficulty'),
		timerSelect: document.getElementById('timer'),
		usernameInput: document.getElementById('username'),
		startBtn: document.getElementById('start-btn'),
		nextBtn: document.getElementById('next-btn'),
		playAgainBtn: document.getElementById('play-again-btn'),
		homeBtn: document.getElementById('home-btn'),
		gameScreen: document.getElementById('game-screen'),
		startScreen: document.getElementById('start-screen'),
		endScreen: document.getElementById('end-screen'),
	},

	populateCategories(categories) {
		// Clear existing except first
		while (categorySelect.options.length > 1) {
			categorySelect.remove(1)
		}
		categories.forEach(cat => {
			const option = document.createElement('option')
			option.value = cat.id
			option.textContent = cat.name
			categorySelect.appendChild(option)
		})
	},

	showScreen(screenId) {
		sections.forEach(s => {
			s.classList.remove('active')
			s.classList.add('hidden')
		})
		const screen = document.getElementById(screenId)
		screen.classList.remove('hidden')
		setTimeout(() => {
			screen.classList.add('active')
		}, 10)
	},

	updateHUD(currentIndex, totalQuestions, score) {
		questionCounterObj.textContent = `${currentIndex + 1}/${totalQuestions}`
		scoreObj.textContent = score
	},

	updateTimer(timeLeft, isWarning) {
		timerDisplay.textContent = timeLeft
		timerDisplay.style.borderColor = isWarning ? 'orange' : 'var(--accent)'
	},

	renderQuestion(question, onSelectAnswer) {
		questionText.textContent = decodeHTML(question.text)

		// Clear options
		while (optionsContainer.firstChild) {
			optionsContainer.removeChild(optionsContainer.firstChild)
		}

		question.answers.forEach(answer => {
			const button = document.createElement('button')
			button.classList.add('option-btn')
			button.textContent = decodeHTML(answer)
			button.dataset.correct = answer === question.correctAnswer
			button.addEventListener('click', onSelectAnswer)
			optionsContainer.appendChild(button)
		})

		nextBtn.classList.add('hidden')
	},

	revealAnswer(selectedBtn) {
		const buttons = Array.from(optionsContainer.children)
		buttons.forEach(btn => {
			btn.disabled = true
			if (btn.dataset.correct === 'true') {
				btn.classList.add('correct')
			}
		})

		if (selectedBtn) {
			if (selectedBtn.dataset.correct !== 'true') {
				selectedBtn.classList.add('incorrect')
			} else {
				selectedBtn.classList.add('correct')
			}
		}

		nextBtn.classList.remove('hidden')
	},

	showEndScreen(score, maxScore, userName) {
		this.showScreen('end-screen')
		finalScoreObj.textContent = score

		const percentage = (score / maxScore) * 100
		let message = ''
		if (percentage === 100)
			message = `Perfect! You are a Genius, ${userName}! 🤯`
		else if (percentage >= 80) message = `Amazing job, ${userName}! 🤩`
		else if (percentage >= 50) message = `Good effort, ${userName}! 👍`
		else message = `You can do better, ${userName}! 😅`

		endMessageObj.textContent = message
	},

	renderHighScores(scores) {
		highScoresList.innerHTML =
			scores
				.map(
					s => `<li>
								<span class="hs-name">${s.name}</span>
								<span class="hs-score">${s.score} pts</span>
						</li>`
				)
				.join('') || '<li>No scores yet!</li>'
	},
}
