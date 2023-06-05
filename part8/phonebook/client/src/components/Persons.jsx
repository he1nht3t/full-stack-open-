/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import Person from './Person';

//GraphQL query
import { FIND_PERSON } from '../queries';

const Persons = ({ persons }) => {
	const [nameToSearch, setNameToSearch] = useState(null);
	const [findPerson, { loading, data }] = useLazyQuery(FIND_PERSON);

	useEffect(() => {
		if (nameToSearch) {
			findPerson({ variables: { nameToSearch } });
		}
	}, [nameToSearch, findPerson]);

	if (loading) {
		return <div>loading...</div>;
	}

	if (nameToSearch && data && data.findPerson) {
		return (
			<Person person={data.findPerson} onClose={() => setNameToSearch(null)} />
		);
	}

	return (
		<div>
			<h2>Persons</h2>
			{persons.map((p) => (
				<div key={p.id}>
					{p.name} {p.phone}
					<button onClick={() => setNameToSearch(p.name)}>show address</button>
				</div>
			))}
		</div>
	);
};

export default Persons;
