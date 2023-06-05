//GraphQL
import { GET_USER, GET_BOOKS } from '../queries.js';
import { useQuery } from '@apollo/client';

const Recommendations = ({ show, page }) => {
	const userQuery = useQuery(GET_USER);
	const booksQuery = useQuery(GET_BOOKS);

	let loginUser;
	let books;

	if (userQuery.loading) {
		return <div>loading...</div>;
	}

	if (!show) {
		return null;
	}

	if (userQuery.data && booksQuery.data) {
		loginUser = userQuery.data.me;
		books = booksQuery.data.allBooks.filter((book) =>
			book.genres.includes(loginUser.favoriteGenre)
		);
	}

	return (
		<>
			<h2>Recommendations</h2>

			<p>
				books in your favorite genre <strong>{loginUser.favoriteGenre}</strong>
			</p>

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
		</>
	);
};

export default Recommendations;
