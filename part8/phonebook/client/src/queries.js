import { gql } from '@apollo/client';

//FRAGMENTS
const PERSON_DETAILS = gql`
	fragment PersonDetails on Person {
		name
		phone
		id
		address {
			street
			city
		}
	}
`;

//QUERIES

export const ALL_PERSONS = gql`
	query getAllPersons {
		allPersons {
			...PersonDetails
		}
	}
	${PERSON_DETAILS}
`;

export const FIND_PERSON = gql`
	query findPerson($nameToSearch: String!) {
		findPerson(name: $nameToSearch) {
			...PersonDetails
		}
	}

	${PERSON_DETAILS}
`;

//MUTATIONS

export const CREATE_PERSON = gql`
	mutation createPerson(
		$name: String!
		$street: String!
		$city: String!
		$phone: String
	) {
		addPerson(name: $name, street: $street, city: $city, phone: $phone) {
			...PersonDetails
		}
	}

	${PERSON_DETAILS}
`;

export const EDIT_NUMBER = gql`
	mutation editNumber($name: String!, $phone: String!) {
		editNumber(name: $name, phone: $phone) {
			...PersonDetails
		}
	}
	${PERSON_DETAILS}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

//SUBSCRIPTIONS
export const PERSON_ADDED = gql`
	subscription {
		personAdded {
			...PersonDetails
		}
	}
	${PERSON_DETAILS}
`;
