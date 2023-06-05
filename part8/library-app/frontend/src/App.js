import { useState, useEffect } from 'react';

import { useApolloClient, useSubscription } from '@apollo/client';

//Components
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';

//Queries
import { BOOK_ADDED, GET_BOOKS } from './queries';

//Utils
import { updateCache } from './utils/updateCache';

const App = () => {
	const [page, setPage] = useState('authors');
	const [token, setToken] = useState(null);
	const client = useApolloClient();

	//Subscription
	useSubscription(BOOK_ADDED, {
		onData: ({ data, client }) => {
			const addedBook = data.data.bookAdded;
			alert(`${addedBook.title} added`);
			updateCache(client.cache, { query: GET_BOOKS }, addedBook);
		},
	});

	useEffect(() => {
		const token = localStorage.getItem('library-user-token');
		if (token) {
			setToken(token);
		}
	}, []);

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	return (
		<div>
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>

				{token ? (
					<>
						<button onClick={() => setPage('add')}>add book</button>
						<button onClick={() => setPage('recommendations')}>
							recommendations
						</button>
						<button onClick={logout}>Logout</button>
					</>
				) : (
					<button onClick={() => setPage('login')}>Login</button>
				)}
			</div>

			<Authors show={page === 'authors'} />

			<Books show={page === 'books'} />

			{token ? (
				<>
					<NewBook show={page === 'add'} />
					<Recommendations show={page === 'recommendations'} />
				</>
			) : (
				<LoginForm setToken={setToken} setPage={setPage} />
			)}
		</div>
	);
};

export default App;
