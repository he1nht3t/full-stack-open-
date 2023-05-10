import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

import {
	useSetNotification,
	useRemoveNotification,
} from './contexts/notificationContext';

//Query Client
import { useQuery, useQueryClient, useMutation } from 'react-query';

//services
import { get, update } from './requests';

const App = () => {
	const queryClient = useQueryClient();
	const setNotification = useSetNotification();
	const removeNotification = useRemoveNotification();

	const voteAnecdoteMutation = useMutation(update, {
		onSuccess: (updatedAnecdote) => {
			const anecdotes = queryClient.getQueryData('anecdotes');
			const updatedAnecdotes = anecdotes.map((anecdote) =>
				anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
			);
			queryClient.setQueryData('anecdotes', updatedAnecdotes);
		},
	});

	const {
		data: anecdotes,
		isLoading,
		isError,
	} = useQuery('anecdotes', get, { retry: 1 });

	const handleVote = (anecdote) => {
		voteAnecdoteMutation.mutate(anecdote);
		setNotification(`You voted for " ${anecdote.content} " `);
		setTimeout(() => {
			removeNotification();
		}, 5000);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Server error...</div>;
	}

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
