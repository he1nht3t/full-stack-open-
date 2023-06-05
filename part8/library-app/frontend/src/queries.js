import { gql } from '@apollo/client';

//FRAGMENTS
const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		title
		published
		author {
			name
			id
			born
			bookCount
		}
		id
		genres
	}
`;

//QUERIES
export const GET_BOOKS = gql`
	query getAllBook {
		allBooks {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const GET_BOOKS_BY_GENRE = gql`
	query getAllBook($genres: String!) {
		allBooks(genres: $genres) {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const GET_AUTHORS = gql`
	query getAllAuthor {
		allAuthors {
			name
			born
			id
			bookCount
		}
	}
`;

export const GET_USER = gql`
	query {
		me {
			username
			favoriteGenre
		}
	}
`;

//MUTATIONS

export const ADD_BOOK = gql`
	mutation addBook(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const EDIT_AUTHOR = gql`
	mutation editAuthor($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			name
			born
			id
			bookCount
		}
	}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

//SUBSCRIPTIONS
export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;
