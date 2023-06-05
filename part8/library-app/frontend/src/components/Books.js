import { useState } from 'react';

//GraphQL
import { useQuery } from '@apollo/client';

//query
import { GET_BOOKS, GET_BOOKS_BY_GENRE } from '../queries';

const Books = (props) => {
	const [genre, setGenre] = useState('all genres');

	const allBooksQuery = useQuery(GET_BOOKS);
	const filteredBooksQuery = useQuery(GET_BOOKS_BY_GENRE, {
		variables: { genres: genre },
	});

	if (!props.show) {
		return null;
	}

	if (allBooksQuery.loading || filteredBooksQuery.loading) {
		return <div>loading...</div>;
	}

	let books = allBooksQuery.data.allBooks;

	if (genre !== 'all genres') {
		books = filteredBooksQuery.data.allBooks;
	}
	const genres = allBooksQuery.data.allBooks
		.map((book) => book.genres)
		.flat()
		.filter((genre, index, self) => {
			/*	console.log(genre);
			console.log(index);
			console.log(self.indexOf(genre));
			console.log(self.indexOf(genre) === index);
    */
			return self.indexOf(genre) === index;
		});

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((book) => (
						<tr key={book.id}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>

			{genres.map((genre) => (
				<button key={genre} onClick={() => setGenre(genre)}>
					{genre}
				</button>
			))}
			<button onClick={() => setGenre('all genres')}>all genres</button>
		</div>
	);
};

export default Books;
