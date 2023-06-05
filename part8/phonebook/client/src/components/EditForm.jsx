import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

//GraphQL
import { EDIT_NUMBER } from '../queries';

const EditForm = ({ setNotify }) => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');

	const [editNumber, result] = useMutation(EDIT_NUMBER);

	const submit = (event) => {
		event.preventDefault();

		editNumber({ variables: { name, phone } });

		setName('');
		setPhone('');
	};

	useEffect(() => {
		if (result.data && result.data.editNumber === null) {
			setNotify('person not found');
		}
	}, [result.data]); // eslint-disable-line

	return (
		<>
			<h2>Change Number</h2>
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
				<button type='submit'>Save Change</button>
			</form>
		</>
	);
};

export default EditForm;
