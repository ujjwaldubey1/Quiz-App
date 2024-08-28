import React, { useState, useEffect } from "react"

export default function APIHandling() {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [question, setQuestion] = useState(0)
	const [answers, setAnswers] = useState({})
	const [result, setResult] = useState(null)
	const [buttonClicked, setButtonClicked] = useState(false)

	useEffect(() => {
		fetch(
			"https://opentdb.com/api.php?amount=20&category=10&difficulty=easy&type=multiple"
		)
			.then((res) => {
				if (!res.ok) {
					throw new Error("Response not okay")
				}
				return res.json()
			})
			.then((data) => {
				setData(data.results)
				setLoading(false)
			})
			.catch((error) => {
				setLoading(false)
				setError(error)
			})
	}, [])

	const handleAnswerSelect = (answer) => {
		setAnswers({
			...answers,
			[question]: answer,
		})
	}

	const handleNextQuestion = () => {
		if (question < data.length - 1) {
			setQuestion(question + 1)
		}
	}

	const handlePreviousQuestion = () => {
		if (question > 0) {
			setQuestion(question - 1)
		}
	}

	const handleSubmit = () => {
		const correctAnswers = data.filter(
			(q, index) => answers[index] === q.correct_answer
		).length
		setResult(correctAnswers)
		setButtonClicked(true)
	}

	if (loading) return <p>Loading..</p>
	if (error) return <p>Error: {error.message}</p>

	const currentQuestion = data[question]
	const allAnswers = [
		...currentQuestion.incorrect_answers,
		currentQuestion.correct_answer,
	]

	return (
		<div>
			<div className="main-div">
				{data.length > 0 && (
					<div className="questionsDiv">
						<p>
							Question {question + 1}: {currentQuestion.question}
						</p>
						<div className="answersDiv">
							{allAnswers.map((answer, index) => (
								<div className="answerOption" key={index}>
									<input
										type="radio"
										name={`question-${question}`}
										id={`answer-${index}`}
										value={answer}
										checked={answers[question] === answer}
										onChange={() => handleAnswerSelect(answer)}
									/>
									<label
										htmlFor={`answer-${index}`}
										className={
											answer === currentQuestion.correct_answer
												? "correctAnswer"
												: "incorrectAnswer"
										}>
										{answer}
									</label>
								</div>
							))}
						</div>
					</div>
				)}
				<div className="navigationButtons">
					<button
						className="prevButton"
						onClick={handlePreviousQuestion}
						disabled={question === 0}>
						Previous
					</button>
					<button
						className="nextButton"
						onClick={handleNextQuestion}
						disabled={question === data.length - 1}>
						Next
					</button>
				</div>
			</div>

			<div>
				{question === data.length - 1 && (
					<div>
						<button
							className="submitButton"
							onClick={handleSubmit}
							style={{
								backgroundColor: buttonClicked ? "#4CAF50" : "#f0f0f0",
								color: buttonClicked ? "white" : "black",
							}}>
							Submit
						</button>
						{result !== null && (
							<p>
								Total Result: {result} out of {data.length}
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
