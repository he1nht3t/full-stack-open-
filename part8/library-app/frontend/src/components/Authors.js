import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';

//Query
import { GET_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = (props) => {
	const [name, setName] = useState('');
	const [born, setBorn] = useState('');

	const result = useQuery(GET_AUTHORS);
	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: GET_AUTHORS }],
	});

	const submit = (event) => {
		event.preventDefault();
		const setBornTo = parseInt(born);
		editAuthor({ variables: { name, setBornTo } });
		setName('');
		setBorn('');
	};

	if (!props.show) {
		return null;
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	const authors = result?.data?.allAuthors;

	if (!authors) {
		return null;
	}

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.id}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div>
				<h2>Set birthyear</h2>
				<form onSubmit={submit}>
					<div>
						name
						<select
							value={name}
							onChange={({ target }) => setName(target.value)}>
							<option value=''>Select author</option>
							{authors.map((a) => (
								<option key={a.id} value={a.name}>
									{a.name}
								</option>
							))}
						</select>
					</div>
					<div>
						born
						<input
							type='number'
							value={born}
							onChange={({ target }) => setBorn(target.value)}
						/>
					</div>
					<button type='submit'>update author</button>
				</form>
			</div>
		</div>
	);
};

export default Authors;
