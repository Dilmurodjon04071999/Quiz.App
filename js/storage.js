const STORAGE_KEY = 'quizHighScores'

export function saveHighScore(score, name) {
	const highScores = getHighScores()
	const newScore = {
		score: score,
		name: name,
		date: new Date().toLocaleDateString(),
	}

	highScores.push(newScore)
	highScores.sort((a, b) => b.score - a.score)
	highScores.splice(3) // Keep top 3

	localStorage.setItem(STORAGE_KEY, JSON.stringify(highScores))
}

export function getHighScores() {
	return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
}
