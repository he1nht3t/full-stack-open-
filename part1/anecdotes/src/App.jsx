import { useState } from "react";

const Anecdote = ({ title, body }) => {
	return (
		<>
			<h1>{title}</h1>
			<p>{body}</p>
		</>
	);
};

const Vote = ({ value }) => {
	return value ? (
		<p>
			has {value} {value === 1 ? "vote" : "votes"}
		</p>
	) : (
		<p>has no vote.</p>
	);
};

const Button = ({ title, handleClick }) => {
	return <button onClick={handleClick}>{title}</button>;
};

function App() {
	const anecdotes = [
		"Adding manpower to a late software project makes it later!",
		"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time",
		"Even the best planning is not so omniscient as to get it right the first time.",
		"How does a project get to be a year late?... One day at a time.",
		"Plan to throw one (implementation) away; you will, anyhow.",
		"Perfection (in design) is achieved not when there is nothing more to add, but rather when there is nothing more to take away",
		"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		"Program testing can be used to show the presence of bugs, but never to show their absence!",
		"Programs should be written and polished until they acquire publication quality.",
		"Time pressure gradually corrupts an engineer’s standard of quality and perfection. It has a detrimental effect on people as well as products",
		"Prolific programmers contribute to certain disaster.",
		"Documentation is the castor oil of programming. Managers think it is good for programmers and programmers hate it!.",
		"Programming can be fun, so can cryptography; however they should not be combined.",
		"A brute force solution that works is better than an elegant solution that doesn't work.",
		"Good visual layout shows the logical structure of a program.",
	];

	const [selected, setSelected] = useState(0);
	const [votesCount, setVotesCount] = useState(
		Array(anecdotes.length).fill(0)
	);

	const randomNumber = Math.floor(Math.random() * anecdotes.length);
	const mostVotedAnecdote = votesCount.indexOf(Math.max(...votesCount));

	const nextAnecdoteOnClick = () => setSelected(randomNumber);
	const voteOnClick = () => {
		const copyVotes = [...votesCount];
		copyVotes[selected] += 1;
		setVotesCount(copyVotes);
	};

	return (
		<div>
			<Anecdote title="Anecdote of the day" body={anecdotes[selected]} />

			<Vote value={votesCount[selected]} />

			<Button title="Vote" handleClick={voteOnClick} />
			<Button title="Next Anecdote" handleClick={nextAnecdoteOnClick} />

			<Anecdote
				title="Anecdote with most votes"
				body={anecdotes[mostVotedAnecdote]}
			/>
		</div>
	);
}

export default App;
