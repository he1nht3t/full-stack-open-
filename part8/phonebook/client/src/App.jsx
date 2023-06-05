import { useState, useEffect } from 'react';

//GraphQL
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';

//components
import Persons from './components/Persons';
import Form from './components/Form';
import Notify from './components/Notify';
import EditForm from './components/EditForm';
import LoginForm from './components/LoginForm';

//GraphQL query
import { ALL_PERSONS, PERSON_ADDED } from './queries';

//Update cache
import { updateCacheWith } from './utils/updateCache';

function App() {
	const [message, setMessage] = useState(null);
	const [token, setToken] = useState(null);

	const result = useQuery(ALL_PERSONS);
	const client = useApolloClient();

	const notify = (message) => {
		setMessage(message);
		setTimeout(() => {
			setMessage(null);
		}, 5000);
	};

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	useSubscription(PERSON_ADDED, {
		onData: ({ data }) => {
			const addedPerson = data.data.personAdded;
			notify(`${addedPerson.name} added`);

			updateCacheWith(client.cache, { query: ALL_PERSONS }, addedPerson);
		},
	});

	useEffect(() => {
		const token = localStorage.getItem('Phonebook-User-Token');
		if (token) {
			setToken(token);
		}
	}, []);

	if (!token) {
		return (
			<>
				<Notify message={message} />
				<h2>Login</h2>
				<LoginForm setToken={setToken} setNotify={notify} />
			</>
		);
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	return (
		<>
			<h2>Phonebook</h2>
			<Notify message={message} />
			<button onClick={logout}>logout</button>
			<Persons persons={result.data.allPersons} />
			<Form setNotify={notify} />
			<EditForm setNotify={notify} />
		</>
	);
}

export default App;
