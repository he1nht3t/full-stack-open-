export const updateCacheWith = (cache, query, addedPerson) => {
	const uniqueByName = (object) => {
		let seen = new Set();

		return object.filter((person) => {
			const name = person.name;
			return seen.has(name) ? false : seen.add(name);
		});
	};

	cache.updateQuery(query, ({ allPersons }) => {
		return {
			allPersons: uniqueByName(allPersons.concat(addedPerson)),
		};
	});
};
