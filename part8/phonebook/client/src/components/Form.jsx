import { useState } from 'react';
import { useMutation } from '@apollo/client';

//GraphQL mutation
import { CREATE_PERSON, ALL_PERSONS } from '../queries';

//Update cache
import { updateCacheWith } from '../utils/updateCache';

const Form = ({ setNotify }) => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [street, setStreet] = useState('');
	const [city, setCity] = useState('');

	const [createPerson] = useMutation(CREATE_PERSON, {
		onError: (error) => {
			const errors = error?.graphQLErrors[0]?.extensions?.error?.errors;
			const messages = Object.values(errors)
				.map((e) => e.message)
				.join('\n');
			setNotify(messages);
		},
		update: (cache, response) => {
			updateCacheWith(cache, { query: ALL_PERSONS }, response.data.addPerson);
		},
	});

	const submit = async (event) => {
		event.preventDefault();

		createPerson({
			variables: {
				name,
				street,
				city,
				phone: phone.length > 0 ? phone : undefined,
			},
		});

		setName('');
		setPhone('');
		setStreet('');
		setCity('');
	};

	return (
		<>
			<h2>Add New Content</h2>
			<form onSubmit={submit}>
				<div>
					name{' '}
					<input
						value={name}
						onChange={({ target }) => setName(target.value)}
					/>
				</div>
				<div>
					phone{' '}
					<input
						value={phone}
						onChange={({ target }) => setPhone(target.value)}
					/>
				</div>
				<div>
					street{' '}
					<input
						value={street}
						onChange={({ target }) => setStreet(target.value)}
					/>
				</div>
				<div>
					city{' '}
					<input
						value={city}
						onChange={({ target }) => setCity(target.value)}
					/>
				</div>
				<button type='submit'>add!</button>
			</form>
		</>
	);
};

export default Form;
