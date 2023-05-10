import { createAnecdote } from '../reducers/anecdoteReducer';
import { useDispatch } from 'react-redux';

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		const content = e.target.new_anecdote.value;
		dispatch(createAnecdote(content));
		e.target.new_anecdote.value = '';
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<input name='new_anecdote' type='text' />
				</div>
				<button>create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
