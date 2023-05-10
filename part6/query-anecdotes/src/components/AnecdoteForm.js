import { useMutation, useQueryClient } from 'react-query';

import {
	useSetNotification,
	useRemoveNotification,
} from '../contexts/notificationContext';

import { create } from '../requests';

const AnecdoteForm = () => {
	const queryClient = useQueryClient();
	const setNotification = useSetNotification();
	const removeNotification = useRemoveNotification();

	const newAnecdoteMutation = useMutation(create, {
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData('anecdotes');
			queryClient.setQueryData('anecdotes', [...anecdotes, newAnecdote]);
		},
	});

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		newAnecdoteMutation.mutate(content);
		setNotification(`You created '${content}'`);
		event.target.anecdote.value = '';

		setTimeout(() => {
			removeNotification();
		}, 5000);
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name='anecdote' />
				<button type='submit'>create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
