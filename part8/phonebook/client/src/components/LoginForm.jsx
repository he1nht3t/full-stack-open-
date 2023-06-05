import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

//GraphQL mutation
import { LOGIN } from '../queries';

const LoginForm = ({ setToken, setNotify }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	//GraphQL mutation
	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			setNotify(error.graphQLErrors[0].message);
		},
	});

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			setToken(token);
			localStorage.setItem('Phonebook-User-Token', token);
		}
	}, [result.data]); // eslint-disable-line

	const handleLogin = (e) => {
		e.preventDefault();
		login({ variables: { username, password } });

		setUsername('');
		setPassword('');
	};
	return (
		<>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						type='text'
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type='password'
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type='submit'>login</button>
			</form>
		</>
	);
};

export default LoginForm;
