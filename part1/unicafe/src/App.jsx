import { useState } from "react";

const Statistics = ({
	good,
	neural,
	bad,
	totalFeedback,
	averageFeedback,
	positiveFeedbackPercent,
}) => {
	return (
		<>
			<h1>Statistics</h1>
			{good === 0 && neural === 0 && bad === 0 ? (
				<p>No Feedback Given...</p>
			) : (
				<table>
					<tbody>
						<StatisticLine text={"Good"} value={good} />
						<StatisticLine text={"Neutral"} value={neural} />
						<StatisticLine text={"Bad"} value={bad} />
						<StatisticLine text={"All"} value={totalFeedback} />
						<StatisticLine
							text={"Average"}
							value={averageFeedback}
						/>
						<StatisticLine
							text={"Positive"}
							value={positiveFeedbackPercent}
						/>
					</tbody>
				</table>
			)}
		</>
	);
};

const Button = ({ handleClick, title }) => {
	return <button onClick={handleClick}>{title}</button>;
};

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	);
};

function App() {
	const [good, setGood] = useState(0);
	const [neural, setNeural] = useState(0);
	const [bad, setBad] = useState(0);

	const setGoodOnClick = () => setGood(good + 1);
	const setNeutralOnClick = () => setNeural(neural + 1);
	const setBadOnClick = () => setBad(bad + 1);

	const totalFeedback = good + neural + bad;
	const averageFeedback = (good - bad) / totalFeedback;
	const positiveFeedbackPercent = (good / totalFeedback) * 100;

	return (
		<>
			<h1>Give Feedback</h1>

			<Button handleClick={setGoodOnClick} title={"Good"} />
			<Button handleClick={setNeutralOnClick} title={"Neutral"} />
			<Button handleClick={setBadOnClick} title={"Bad"} />

			<Statistics
				good={good}
				neural={neural}
				bad={bad}
				totalFeedback={totalFeedback}
				averageFeedback={averageFeedback}
				positiveFeedbackPercent={positiveFeedbackPercent}
			/>
		</>
	);
}

export default App;
