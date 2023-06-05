import { useState } from 'react';

//GraphQL
import { LOGIN } from '../queries';
import { useMutation } from '@apollo/client';

const LoginForm = ({ setToken, setPage }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [login] = useMutation(LOGIN, {
		onError: (error) => {
			console.log(error);
		},
	});

	const handleSubmit = async (event) => {
		event.preventDefault();

		const result = await login({
			variables: { username, password },
		});

		if (result) {
			const token = result.data.login.value;
			setToken(token);
			localStorage.setItem('library-user-token', token);
			setPage('authors');
		}

		setUsername('');
		setPassword('');
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
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
		</div>
	);
};

export default LoginForm;
