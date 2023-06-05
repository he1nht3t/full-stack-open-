import { useState } from 'react';
import { useMutation } from '@apollo/client';

//mutations
import { ADD_BOOK, GET_BOOKS } from '../queries';

//utils
import { updateCache } from '../utils/updateCache';

const NewBook = (props) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [published, setPublished] = useState(0);
	const [genre, setGenre] = useState('');
	const [genres, setGenres] = useState([]);

	const [addBook] = useMutation(ADD_BOOK, {
		onError: (error) => {
			console.log(error);
		},
		update: (cache, response) => {
			updateCache(cache, { query: GET_BOOKS }, response.data.addBook);
		},
	});

	if (!props.show) {
		return null;
	}

	const submit = async (event) => {
		event.preventDefault();
		const publishedInt = parseInt(published);
		addBook({ variables: { title, author, published: publishedInt, genres } });

		setTitle('');
		setPublished('');
		setAuthor('');
		setGenres([]);
		setGenre('');
	};

	const addGenre = () => {
		setGenres(genres.concat(genre));
		setGenre('');
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					title
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					published
					<input
						type='number'
						value={published}
						onChange={({ target }) => setPublished(target.value)}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type='button'>
						add genre
					</button>
				</div>
				<div>genres: {genres.join(' ')}</div>
				<button type='submit'>create book</button>
			</form>
		</div>
	);
};

export default NewBook;
