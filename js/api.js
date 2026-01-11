import { API_BASE_URL, API_CATEGORY_URL } from './config.js'

export async function fetchCategories() {
	try {
		const res = await fetch(API_CATEGORY_URL)
		const data = await res.json()
		return data.trivia_categories
	} catch (error) {
		console.error('Failed to fetch categories:', error)
		return []
	}
}

export async function fetchQuestions(amount, category, difficulty) {
	let url = `${API_BASE_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`
	if (category) url += `&category=${category}`

	try {
		const res = await fetch(url)
		const data = await res.json()
		return data.results
	} catch (error) {
		console.error('Failed to fetch questions:', error)
		return null
	}
}
