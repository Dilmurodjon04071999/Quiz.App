import { fetchQuestions } from './api.js'
import { DIFFICULTY_POINTS } from './config.js'
import { shuffleArray } from './utils.js'

export class Game {
	constructor() {
		this.questions = []
		this.currentQuestionIndex = 0
		this.score = 0
		this.timer = null
		this.timeLeft = 0
		this.config = {
			amount: 10,
			category: '',
			difficulty: 'easy',
			timePerQuestion: 10,
		}
		this.userName = ''
	}

	setConfig(name, amount, category, difficulty, time) {
		this.userName = name
		this.config.amount = amount
		this.config.category = category
		this.config.difficulty = difficulty
		this.config.timePerQuestion = parseInt(time)
	}

	async initGame() {
		const results = await fetchQuestions(
			this.config.amount,
			this.config.category,
			this.config.difficulty
		)

		if (!results || results.length === 0) return false

		this.questions = results.map(q => ({
			text: q.question,
			correctAnswer: q.correct_answer,
			answers: (() => {
				const arr = [...q.incorrect_answers, q.correct_answer]
				shuffleArray(arr)
				return arr
			})(),
		}))

		this.score = 0
		this.currentQuestionIndex = 0
		return true
	}

	getCurrentQuestion() {
		return this.questions[this.currentQuestionIndex]
	}

	isGameOver() {
		return this.currentQuestionIndex >= this.questions.length
	}

	calculatePoints() {
		return DIFFICULTY_POINTS[this.config.difficulty] || 1
	}

	addScore() {
		this.score += this.calculatePoints()
	}

	getMaxPossibleScore() {
		return this.questions.length * this.calculatePoints()
	}

	nextQuestion() {
		this.currentQuestionIndex++
	}
}
