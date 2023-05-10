import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
	//order by votes and filter by content
	const anecdotes = useSelector(({ anecdotes, filter }) => {
		return anecdotes
			.filter((anecdote) =>
				anecdote.content.toLowerCase().includes(filter.toLowerCase())
			)
			.sort((a, b) => b.votes - a.votes);
	});

	const dispatch = useDispatch();

	const vote = (anecdote) => {
		const updatedAnecdote = {
			...anecdote,
			votes: anecdote.votes + 1,
		};
		dispatch(voteAnecdote(updatedAnecdote));
		dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
	};

	return (
		<div>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => vote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default AnecdoteList;
